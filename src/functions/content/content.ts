import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { contentType, getListType, getListByAdminType } from '../../lib/types/content';
import { Content, IContent } from '../../lib/models/Content';
import { createContentSchema, createContentByAdminSchema, getContentListSchema, updateContentBySchema, updateContentByAdminSchema, getListByAdminSchema, getUserAnalyticsSchema } from "./validators";
import { PaginateOptions, Types } from "mongoose";
import { HttpError } from "../../lib/utils";
import { INVALID_CONTENT, AMOUNT_REQUIRE } from "../../lib/utils";
import { IUser, User } from "../../lib/models/User";
import { ILike, Like } from '../../lib/models/Like';
import { Bookmark, IBookmark } from '../../lib/models/Bookmark';
import { Skill } from '../../lib/models/Skill';
import { v4 } from "uuid";
import _, { forEach } from "lodash";
import { ENDPOINTS } from "../../lib/common/endpoints";
import axios from 'axios';
import { Follow, IFollow, IOrder, Order, SquidexArticle } from '../../lib/models';
import * as urlSlug from 'url-slug';
import { IUserAnalytics, UserAnalytics } from '../../lib/models/UserAnalytics';
import { getUserAnalyticsType, userAnalyticsType } from '../../lib/types/userAnalytics';
import { getSquidexArticlesListType } from '../../lib/types/squidexArticles';
import { UserContentView } from '../../lib/models/UserContentView';

const create: LambdaLogic<{}, contentType> = async event => {
    const payload: contentType = event.body;
    payload.createdBy = payload.updatedBy = await getOwner(event);
    let result = await createContentFunc(payload, event.headers.Authorization);

    return { _id: result?._id };
}

const createByAdmin: LambdaLogic<{}, contentType> = async event => {
    let result = await createContentFunc(event.body, event.headers.Authorization);
    return { _id: result?._id };
}

const getList: LambdaLogic<getListType> = async event => {

    console.time("GetList-Time");
    
    let result = await getContents(event);

    if(event.queryStringParameters.userView && result.docs.length === 0 && event.user) {
        console.time("UserContentViewDelete-QueryTime");
        await UserContentView.deleteMany({userId: event.user.id});
        console.timeEnd("UserContentViewDelete-QueryTime");

        result = await getContents(event)
    }

    console.timeEnd("GetList-Time");
    return result;
}

const getContents = async (payload: any) => {
    let { q, ctype, priority, page, limit, categories, subCategories, skills, groupId, userId, myContent, slug, userView } = payload.queryStringParameters;
    let sortQ: any = {
        sequence: 1,
        createdAt: -1
    };
    const populate = [
        { path: "createdBy.userId", select: "fullName username profileImg" },
        { path: "groupId", select: "noOfVideos title" },
        { path: "priceId", select: "amount currency isActive" },
    ]
    let query: any = {
        groupId: { "$eq": null },
        status:  "Published"
    };
    let select: string = "-deleted -__v -earning -sales";

    if (priority) {
        if (priority == "Group") {
            query.groupId = { "$eq": null }
            sortQ = {
                type: 1,
                createdAt: -1
            }
        }
    }
    if (ctype) {
        let qtype: any = [];
        try {
            qtype = JSON.parse(ctype);
            if (qtype) {
                query.type = { "$in": qtype }
            }
            if(qtype.indexOf("Video")>-1){
                delete query.groupId;
            }
        } catch (err) {
            console.log(err);
        }
    }
    if(myContent == 'true' && payload.user && payload.user.id){
        delete query.status;
        query["createdBy.userId"] = payload.user.id;
        select = "-deleted -__v";
    }
    if (categories) {
        try {
            let categories_arr: any = JSON.parse(categories);
            let final_categories_arr = categories_arr.map(Types.ObjectId)
            if (categories_arr) {
                query.categories = { "$elemMatch": { "categoryId": { "$in": final_categories_arr } } }
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (subCategories) {
        try {
            let subCategories_arr: any = JSON.parse(subCategories);
            let final_subCategories_arr = subCategories_arr.map(Types.ObjectId)
            if (subCategories_arr) {
                query.subCategories = { "$elemMatch": { "subCategoryId": { "$in": final_subCategories_arr } } }
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (skills) {
        try {
            let skills_arr: any = JSON.parse(skills);
            let final_skills_arr = skills_arr.map(Types.ObjectId)
            if (skills_arr) {
                query.skills = { "$elemMatch": { "skillId": { "$in": final_skills_arr } } }
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (groupId) {
        query.groupId = groupId
        sortQ = {
            sequence: 1,
            createdAt: 1
        }
    }
    if (userId) {
        query["createdBy.userId"] = userId;

        if(payload.user && payload.user.id && payload.user.id == userId) {
            select = "-deleted -__v";
        }
    }

    const options: PaginateOptions = {
        page: page || 1,
        limit: limit || 10,
        sort: sortQ,
        populate,
        select,
        lean: true
    }
    
    if (q) {
        query["$or"] = [
            { title: { $regex: q, $options: 'i' } },
            { "categories.name": { $regex: q, $options: 'i' } },
            { "subCategories.name": { $regex: q, $options: 'i' } },
            { "skills.name": { $regex: q, $options: 'i' } },
        ]
    }

    if(slug) {
        delete query.groupId;
        query["slug"] = slug;
    }

    if(userView && payload.user && payload.user.id) {
        console.time("userContentView-QueryTime");
        const userContentView = await UserContentView.find({userId: payload.user.id});
        console.timeEnd("userContentView-QueryTime")

        const contentIds: Array<string> = _.map(userContentView, (userConView)=>{
            return userConView.contentId?.toString();
        });

        query._id = {"$nin": contentIds}
    }

    console.time("contentPaginate-QueryTime");
    let result: any =  await Content.paginate(query, options);
    console.timeEnd("contentPaginate-QueryTime");

    let user: IUser|null = null;
    if(payload.user && payload.user.id){
        console.time("User-QueryTime");
        user = await User.findById(payload.user.id);
        console.timeEnd("User-QueryTime");

        result.docs = await addIsLikeProperty(result.docs, payload.user.id);
        result.docs = await addIsBookmarkProperty(result.docs, payload.user.id);
        result.docs = await addIsPaidProperty(result.docs, payload.user.id, user);
        result.docs = await addIsFollowedProperty(result.docs, payload.user.id);
    }
    
    if(!user || !user.isAllowedToViewPremium){
        result.docs.forEach((resultObj: any) => {
            if(resultObj.isPremium && !resultObj.isPaid){
                delete resultObj.data;
            }
        });
    }

    return result;
}

const getListByAdmin: LambdaLogic<getListByAdminType> = async event => {
    let { q, ctype, page, limit, categories, subCategories, skills, groupId, status, slug } = event.queryStringParameters;
    let sortQ: any = {
        createdAt: -1
    };
    const populate = [
        { path: "createdBy.userId", select: "fullName username profileImg" },
        { path: "groupId", select: "noOfVideos title" },
        { path: "priceId", select: "amount currency isActive" },
    ]
    let query: any = {
        groupId: { "$eq": null }
    };
    if (ctype) {
        let qtype: any = [];
        try {
            qtype = JSON.parse(ctype);
            if (qtype) {
                query.type = { "$in": qtype }
            }
            if(qtype.indexOf("Video")>-1){
                delete query.groupId;
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (categories) {
        try {
            let categories_arr: any = JSON.parse(categories);
            let final_categories_arr = categories_arr.map(Types.ObjectId)
            if (categories_arr) {
                query.categories = { "$elemMatch": { "categoryId": { "$in": final_categories_arr } } }
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (subCategories) {
        try {
            let subCategories_arr: any = JSON.parse(subCategories);
            let final_subCategories_arr = subCategories_arr.map(Types.ObjectId)
            if (subCategories_arr) {
                query.subCategories = { "$elemMatch": { "categoryId": { "$in": final_subCategories_arr } } }
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (skills) {
        try {
            let skills_arr: any = JSON.parse(skills);
            let final_skills_arr = skills_arr.map(Types.ObjectId)
            if (skills_arr) {
                query.skills = { "$elemMatch": { "categoryId": { "$in": final_skills_arr } } }
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (groupId) {
        query.groupId = groupId
        sortQ = {
            sequence: 1,
            createdAt: 1
        }
    }
    if(status){
        query.status = status;
    }

    if (q) {
        query["$or"] = [
            { title: { $regex: q, $options: 'i' } },
            { "categories.name": { $regex: q, $options: 'i' } },
            { "subCategories.name": { $regex: q, $options: 'i' } },
            { "skills.name": { $regex: q, $options: 'i' } },
        ]
    }

    const options: PaginateOptions = {
        page: page || 1,
        limit: limit || 10,
        sort: sortQ,
        populate,
        select: "-deleted -__v",
        lean: true
    }

    if(slug) {
        delete query.groupId;
        query["slug"] = slug;
    }

    let result: any =  await Content.paginate(query, options);
    if(event.user && event.user.id){
        result.docs = await addIsLikeProperty(result.docs, event.user.id);
        result.docs = await addIsBookmarkProperty(result.docs, event.user.id);
        result.docs = await addIsPaidProperty(result.docs, event.user.id, null);
        result.docs = await addIsFollowedProperty(result.docs, event.user.id);
    }
    return result;
}

const update: LambdaLogic<{}, contentType, { id: string }> = async event => {
    const payload: any = event.body;
    payload.updatedBy = await getOwner(event);
    const q = {
        "createdBy.userId": event.user.id,
        _id: event.pathParameters.id
    }
    if(payload.skills){
        let { categories, subCategories } = await getCategoryAndSubCatgoryBySkills(payload.skills);
        payload.categories = categories;
        payload.subCategories = subCategories;
    }
    payload.status = "InReview";
    let content: IContent | null = await Content.findOne(q);
    if (!content) throw new HttpError().BadRequest(INVALID_CONTENT);
    if (!content.groupId && payload.isPremium === true && !(payload.amount || content.priceId)) throw new HttpError().BadRequest(AMOUNT_REQUIRE);

    await Content.updateOne(q, { ...payload }, { new: true })

    if(payload.amount && content.priceId){
        await updateContentPrice(content.priceId, payload.amount, event.headers.Authorization);    
    }

    if(payload.amount && !content.priceId){
        let priceResult = await createContentPrice(content._id, payload.amount, payload.currency, event.headers.Authorization);
        if(priceResult){
            await Content.updateMany({ $or:[ {'_id':content._id},{'groupId': content._id} ]}, { $set: { priceId: priceResult._id, isPremium: true } });
        }
    }

    return { success: true };
}

const updateByAdmin: LambdaLogic<{}, contentType, { id: string }> = async event => {
    const payload: any = event.body;
    payload.updatedBy = await getOwner(event);
    const q = {
        _id: event.pathParameters.id
    }
    if(payload.skills){
        let { categories, subCategories } = await getCategoryAndSubCatgoryBySkills(payload.skills);
        payload.categories = categories;
        payload.subCategories = subCategories;
    }

    let contentRes: IContent | null = await Content.findOne(q);
    if (!contentRes) throw new HttpError().BadRequest(INVALID_CONTENT);
    if (!contentRes.groupId && payload.isPremium === true && !(payload.amount || contentRes.priceId)) throw new HttpError().BadRequest(AMOUNT_REQUIRE);

    const content: IContent | null = await Content.findOneAndUpdate(q, { ...payload }, { new: true })
    if (!content) new HttpError().BadRequest(INVALID_CONTENT);
    
    /* If any status changed for course then system will change status for all videos of content */

    if(content?.type == "Group" && (payload.isPremium != undefined) && contentRes?.isPremium != payload.isPremium) {
        let updatePayload: any = {};
        updatePayload["isPremium"] = payload.isPremium;
        await Content.updateMany({groupId: content._id}, { $set: updatePayload });
    }

    if(content?.type == "Group" && (payload.status != undefined ) && contentRes?.status != payload.status) {
        let updatePayload: any = {};
        updatePayload["status"] = payload.status;
        await Content.updateMany({groupId: content._id}, { $set: updatePayload });
    }

    if(payload.amount && contentRes.priceId){
        await updateContentPrice(contentRes.priceId, payload.amount, event.headers.Authorization);    
    }

    if(payload.amount && !contentRes.priceId){
        let priceResult = await createContentPrice(contentRes._id, payload.amount, payload.currency, event.headers.Authorization);
        if(priceResult){
            await Content.updateMany({ $or:[ {'_id':contentRes._id},{'groupId': contentRes._id} ]}, { $set: { priceId: priceResult._id, isPremium: true } });
        }
    }

    return { success: true };
}

const getOwner = async (event: any) => {
    /* This will be only case of first time signup by customer, when user dont have username and we generate the token */
    if (!event.user.username) {
        const user = await User.findById(event.user.id).select('username').lean();
        event.user.username = user?.username || '';
    }
    const owner = {
        userId: event.user.id,
        username: event.user.username
    }
    return owner;
}

const addIsLikeProperty = async (contents: Array<any>, userId: string) => {
    const contentIds: Array<string> = _.map(contents, (c)=>{
        return c._id?.toString();
    });
    const likes = await getLikes(contentIds, userId);
    contents.map((c) => {
        c.isLike = c._id?.toString() in likes;
    })
    return contents;
}

const getLikes = async (contentIds: Array<string>, userId: string) => {
    let result: any = {};
    if (!contentIds || !contentIds.length) return result
    let query = {
        contentId: { $in: contentIds },
        userId
    }
    console.time("Like-QueryTime");
    const likes: Array<ILike> = await Like.find(query).select('contentId').lean();
    console.timeEnd("Like-QueryTime");

    for (const key of likes) {
        result[key.contentId.toString()] = key;
    }
    return result;
}

const addIsBookmarkProperty = async (contents: Array<any>, userId: string) => {
    const contentIds: Array<string> = _.map(contents, (c)=>{
        return c._id?.toString();
    });
    const bookmarks = await getBookmarks(contentIds, userId);
    contents.map((c) => {
        c.isBookmark = c._id?.toString() in bookmarks;
    })
    return contents;
}

const getBookmarks = async (contentIds: Array<string>, userId: string) => {
    let result: any = {};
    if (!contentIds || !contentIds.length) return result
    let query = {
        contentId: { $in: contentIds },
        userId
    }
    console.time("Bookmark-QueryTime");
    const bookmarks: Array<IBookmark> = await Bookmark.find(query).select('contentId').lean();
    console.timeEnd("Bookmark-QueryTime");

    for (const key of bookmarks) {
        result[key.contentId.toString()] = key;
    }
    return result;
}

const addIsPaidProperty = async (contents: Array<any>, userId: string, user: IUser|null) => {
    const contentIds: Array<string> = _.map(contents, (c)=>{
        return c.groupId && c.groupId._id ? c.groupId._id.toString() : c._id?.toString();
    });
    const orders = await getOrders(contentIds, userId);
    if(!user || !user.isAllowedToViewPremium){
        contents.map((c) => {
            c.isPaid = c.groupId && c.groupId._id ? c.groupId._id.toString() in orders : c._id?.toString() in orders;
        })
    }
    else{
        contents.map((c) => {
            c.isPaid = true;
        })
    }
    return contents;
}

const getOrders = async (contentIds: Array<string>, userId: string) => {
    let result: any = {};
    if (!contentIds || !contentIds.length) return result
    contentIds = _.uniq(contentIds);
    let query = {
        status:  "Success",
        "product.contentId": { $in: contentIds },
        userId
    }
    console.time("Order-QueryTime");
    const orders: Array<IOrder> = await Order.find(query).select('product.contentId').lean();
    console.timeEnd("Order-QueryTime");

    for (const key of orders) {
        result[key.product.contentId.toString()] = key;
    }
    return result;
}

const addIsFollowedProperty = async (contents: Array<any>, userId: string) => {
    const creatorUserIds: Array<string> = _.map(contents, (c)=>{
        return c.createdBy.userId?._id?.toString();
    });

    const followed = await getFollowed(creatorUserIds, userId);

    contents.map((c) => {
        c.isFollowed = c.createdBy.userId?._id?.toString() in followed;
    })
    return contents;
}

const getFollowed = async (creatorUserIds: Array<string>, userId: string) => {
    let result: any = {};
    if(!creatorUserIds || !creatorUserIds.length) return result;

    let query = {
        userId : { $in: creatorUserIds },
        followerId: userId
    }

    console.time("Followed-QueryTime");
    const followed: Array<IFollow> = await Follow.find(query).select("userId").lean();
    console.timeEnd("Followed-QueryTime");

    for (const key of followed) {
        result[key.userId.toString()] = key;
    }

    return result;
}

const getCategoryAndSubCatgoryBySkills = async (skills: Array<{skillId: string, name: string}>) => {
    let skillIds = skills.map((s:any) => s.skillId);
    let skillsRes:any = await Skill.find({_id: { $in: skillIds }}).populate([{path:'categoryId'},{path:'subCategoryId'}]);
    let categories:any = [];
    let subCategories:any = [];
    skillsRes.forEach((skill:any) => {
        if(skill.categoryId.length > 0){
            for (const catId of skill.categoryId){
                categories.push({
                    categoryId: catId._id,
                    name: catId.name
                })
            }
        }
        if(skill.subCategoryId.length > 0){
            for (const subCId of skill.subCategoryId){
                subCategories.push({
                    subCategoryId: subCId._id,
                    name: subCId.name
                })
            }
        }
    });
    return { categories, subCategories };
}

const createContentFunc = async (payload: contentType, Authorization: string): Promise<IContent> => {
    const slug = `${payload.title}-${v4()}`;
    payload.slug = urlSlug.convert(slug, {
        transformer: false
    })
    let { categories, subCategories } = await getCategoryAndSubCatgoryBySkills(payload.skills);
    const content: IContent = new Content({...payload, categories, subCategories, earning: 0, sales: 0});
    await content.save();

    if(payload.groupId){
        const course = await Content.findOne({_id: payload.groupId})
        const priceId = course?.priceId;
        const isPremium = content.isPremium!==undefined ? content.isPremium : course?.isPremium; //If frontend sending paid course video is free then priority is video isPremium attribute
        await Content.findOneAndUpdate({_id: content._id}, { $set: { priceId: priceId, isPremium: isPremium } });
        await Content.findOneAndUpdate({_id: payload.groupId}, { $inc: { noOfVideos:1 } });
    }

    if(payload.amount){
        let priceResult = await createContentPrice(content._id, payload.amount, payload.currency, Authorization);
        if(priceResult){
            await Content.findOneAndUpdate({_id: content._id}, { $set: { priceId: priceResult._id, isPremium: true } });
        }   
    }

    const userAnalytics = await UserAnalytics.findOne({user_id: payload.createdBy.userId})
    if(!userAnalytics) {
        const userAnalyticsData: userAnalyticsType = {
            user_id: payload.createdBy.userId,
            uploads: 1,
            views: 0,
            sales: 0,
            earning: 0
        }

        const newUserAnalytics: IUserAnalytics = new UserAnalytics(userAnalyticsData);
        await newUserAnalytics.save();

    }
    
    else{
        await UserAnalytics.findOneAndUpdate({user_id: payload.createdBy.userId}, { $inc: { uploads:1 } });
    }
    
    return content;
}

const createContentPrice = async (contentId: string, amount: number, currency: string = "usd", Authorization: string) => {
    try{
        let pricePayload = { contentId, amount, currency };
        const headers = { Authorization };
        const options = { headers };
        const res = await axios.post(ENDPOINTS.PRICING_CREATION, pricePayload, options);    
        return res?.data?.payload;
    }
    catch(err:any){
        throw new Error(err);
    }
}

const updateContentPrice = async (priceId: string, amount: number, Authorization: string ) => {
    try{
        let pricePayload = { amount };
        const headers = { Authorization };
        const options = { headers };
        const res = await axios.put(`${ENDPOINTS.PRICING_CREATION}/${priceId}`, pricePayload, options);    
        return res.data;
    }
    catch(err:any){
        throw new Error(err);
    }
}

const getUserAnalyticsFunc: LambdaLogic<getUserAnalyticsType> = async event => {
    
    const userAnalytics: any =  await UserAnalytics.findOne({
        user_id : event.user.id
    }).populate("user_id", "fullName username profileImg").select("-deleted -__v");

    const defaultResult: userAnalyticsType = {
        user_id: event.user.id,
        uploads: 0,
        views: 0,
        sales: 0,
        earning: 0
    }

    if(!userAnalytics) return defaultResult;
    
    return userAnalytics;
}

const getSquidexFunc :LambdaLogic<getSquidexArticlesListType> = async event => {
    const { limit, page } = event.queryStringParameters;
    const options: PaginateOptions = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      lean: true
    }
    const squidexArticles = await SquidexArticle.paginate(undefined, options);
    console.log(squidexArticles)
    return squidexArticles;
}

export const createContent = handlerWrapper(create, createContentSchema);
export const createContentByAdmin = handlerWrapper(createByAdmin, createContentByAdminSchema);
export const updateContent = handlerWrapper(update, updateContentBySchema);
export const updateContentByAdmin = handlerWrapper(updateByAdmin, updateContentByAdminSchema);
export const getContentList = handlerWrapper(getList);
export const getContentListByAdmin = handlerWrapper(getListByAdmin, getListByAdminSchema);
export const getUserAnalytics = handlerWrapper(getUserAnalyticsFunc, getUserAnalyticsSchema);
export const getSquidex = handlerWrapper(getSquidexFunc);