import { model, Schema, Model, Document, PaginateModel, Query } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";
import axios from "axios";
 
/* Document interface */
export interface IContent extends Document {
    createdBy: {
        userId: string,
        username: string
    },
    updatedBy: {
        userId: string,
        username: string
    },
    title: String,
    description: String,
    data: any,
    type: String,
    items: Array<IItem>,
    stats: {
        like: number,
        comment: number,
        views: number,
        shares: number
    },
    earning: number,
    sales: number,
    status: string,
    groupId: string,
    thumbnails: Array<string>,
    tags: Array<string>,
    sequence: number,
    priceId: string,
    isPremium: boolean,
    slug: string
}

export interface IItem extends Document {
    contentId: string,
    sequence: Number
}

/* Model interface */
export interface IContentModel<T extends Document> extends PaginateModel<T> {}

/* Schema */
const itemSchema: Schema = new Schema({
    contentId: { type: Schema.Types.ObjectId, required: true, ref: 'Content' },
    sequence: { type: Number, default: 0 },
})
const CategorySchema: Schema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
    name: { type: String},
})
const subCategorySchema: Schema = new Schema({
    subCategoryId: { type: Schema.Types.ObjectId, required: true, ref: 'SubCategory' },
    name: { type: String},
})
const SkillSchema: Schema = new Schema({
    skillId: { type: Schema.Types.ObjectId, required: true, ref: 'Skill' },
    name: { type: String},
})
const userSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, default: 0 },
})

const contentSchema: Schema = new Schema({
    createdBy: userSchema,
    updatedBy: userSchema,
    title: { type: String, required: true },
    description: { type: String },
    data: { type: Schema.Types.Mixed },
    type: { type: String, enum: ["Group", "Video", "PDF", "Text","Image", "Reel", "Questionnaire"], required: true },
    items: [itemSchema],
    stats: {
        like: { type: Number, default: 0},
        unlike: { type: Number, default: 0},
        comment: { type: Number, default: 0},
        views: { type: Number, default: 0},
        shares: { type: Number, default: 0},
    },
    earning: { type: Number, default: 0},
    sales: { type: Number, default: 0},
    categories: [CategorySchema],
    subCategories: [subCategorySchema],
    skills: [SkillSchema],
    groupId: { type: Schema.Types.ObjectId, ref: 'Content' },
    thumbnails: [{type: String}],
    status: { type: String, enum: ["InReview", "Published", "Rejected", "Blocked", "Copyrighted"], default: "InReview" },
    tags: [{type: String}],
    sequence: { type: Number, default: 0 },
    noOfVideos: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    priceId: { type: Schema.Types.ObjectId, ref: 'Price' },
    slug: { type: String },
    level: { type: [String], enum: ["Beginner", "Intermediate", "Expert"]},
}, { timestamps: true });

/* Plugins */
contentSchema.plugin(mongoosePaginate);
contentSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

contentSchema.post<IContent>('save', async function (doc:any, next:any) {
    //Send slack notification
    const message = `${this.createdBy.username} has uploaded new content -> ${this.title}`
    const { data } = await axios({
        url: process.env.SLACK_NOTIFIER_URL,
        method: 'post',
        data: {
            "text": message
        },
    });
    next();
});

contentSchema.post<Query<IContent, IContent>>('findOneAndUpdate', async function (doc: IContent) {
    //If content status updating as InReview then send slack notification
    if(this.getUpdate()?.$set?.status == "InReview"){
        //Send slack notification
        const message = `${doc.updatedBy.username} has updated content -> ${doc.title}, Please review.`
        const { data } = await axios({
            url: process.env.SLACK_NOTIFIER_URL,
            method: 'post',
            data: {
                "text": message
            },
        });
    }
});

export const Content: IContentModel<IContent> = model<IContent>('Content', contentSchema) as IContentModel<IContent>;