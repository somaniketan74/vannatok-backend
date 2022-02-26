import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface DefaultType extends Document {
    en: string,
    "zh-HK" : string,
    "zh-TW" : string,
    "zh-CN" : string
}

export interface ArtilceAuthor extends Document {
    name: DefaultType,
    avatar: string,
    bio: DefaultType,
    slug: DefaultType
}

export interface ArtilceImages extends Document {
    imgM: string,
    imgWeb: string
}

export interface ArtilceSubcategory extends Document {
    en: string[],
    "zh-HK" : string[],
    "zh-TW" : string[],
    "zh-CN" : string[]
}

export interface ISquidexArticle extends Document {
    title: DefaultType,
    slug: DefaultType,
    author: ArtilceAuthor,
    body: DefaultType,
    description: DefaultType,
    readTime: DefaultType,
    images: ArtilceImages,
    subcategory: ArtilceSubcategory
}

interface SquidexArticleModel<T extends Document> extends PaginateModel<T> {};

const squidexArticleSchema:Schema = new Schema({
    title: {type: Object, required: true},
    slug: {type: Object, required: true},
    author: { type: Object, required: true },
    body: {type: Object, required: true},
    description: {type: Object, required: true},
    readTime: { type: Object, required: true },
    images: {type: Object, required: true},
    subcategory: {type: Object, required: true}
},{timestamps: true});
squidexArticleSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
squidexArticleSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const SquidexArticle: SquidexArticleModel<ISquidexArticle> = model<ISquidexArticle>('SquidexArticle', squidexArticleSchema) as SquidexArticleModel<ISquidexArticle>;