import { handlerWrapper } from '../../lib/utils/handlerWrapper';
import { LambdaLogic } from '../../lib/types/AWS';
import { getCommentListType } from '../../lib/types/comment';
import { createViewSchema, getListViewSchema, updateViewSchema } from './validators';
import { View, IView } from '../../lib/models';
import { HttpError } from '../../lib/utils';
import { Content } from '../../lib/models/Content';
import { PaginateOptions } from 'mongoose'
import { IUserAnalytics, UserAnalytics } from '../../lib/models/UserAnalytics';
import { userAnalyticsType } from '../../lib/types/userAnalytics';
import { UserContentView } from '../../lib/models/UserContentView';
import { INVALID_CONTENT } from '../../lib/utils/ErrorMessage';
type PathParams = {
    id: string
}

const create: LambdaLogic<{}, IView, {}> = async (event, _context) => {
  let view;
  if(event.user && event.user.id) {
    view = new View({...event.body, userId: event.user.id});
  }
  else {
    view = new View({...event.body});
  }
  
  try {
    const content = await Content.findOneAndUpdate({_id:event.body.contentId}, {$inc: { 'stats.views': 1}} , {new: true, lean: true});
    if (!content) {
      throw new HttpError().BadRequest(INVALID_CONTENT);
    }
    await view.save();
    
    
    
    if(event.user && event.user.id) {
      console.log(event.user.id);
      const userAnalytics = await UserAnalytics.findOne({user_id: event.user.id})
      if(!userAnalytics) {
          const userAnalyticsData: userAnalyticsType = {
              user_id: event.user.id,
              uploads: 0,
              views: 1,
              sales: 0,
              earning: 0
          }

          const newUserAnalytics: IUserAnalytics = new UserAnalytics(userAnalyticsData);
          await newUserAnalytics.save();

      }
      else{
          await UserAnalytics.findOneAndUpdate({user_id: event.user.id}, { $inc: { uploads:1 } });
      }
    }

    let userContentView;
    if(event.user && event.user.id) {
      userContentView = new UserContentView({
        userId: event.user.id,
        contentId: event.body.contentId
      })
    }
    else {
      userContentView = new UserContentView({
        contentId: event.body.contentId
      })
    }

    await userContentView.save();

    return view;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const update: LambdaLogic<{}, {duration: number}, PathParams>  = async (event, _context) => {
    const view = await View.findOneAndUpdate({_id: event.pathParameters.id, userId: event.user.id}, {...event.body} , {lean: true, new: true});
    if (!view) {
        throw new HttpError().BadRequest();
    }
    return view;
}

const  get: LambdaLogic<getCommentListType> = async (event, _context) => {
    const { contentId, limit, userId, page } = event.queryStringParameters;
    let query:any = {};
    const populate = [
      { path: "userId", select: "username fullName profileImg" },
      { path: "contentId", select: "title description" }
    ]
    const sort = { createdAt: -1 };
    if(contentId) query["contentId"] = contentId;
    if(userId) query["userId"] = userId; 
    const options: PaginateOptions = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort,
      populate,
      select: "-deleted -__v -id",
      lean: true
    }
    const views = await View.paginate(query, options);
    return views;
}

export const createView = handlerWrapper(create, createViewSchema);
export const updateView = handlerWrapper(update, updateViewSchema);
export const getView = handlerWrapper(get, getListViewSchema);

