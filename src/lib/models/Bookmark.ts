import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IBookmark extends Document {
    userId: String,
    contentId: String
}

interface BookmarkModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T>  {};

const bookmarkSchema:Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    contentId: {type: Schema.Types.ObjectId, required: true, ref: 'Content' }
},{timestamps: true});
bookmarkSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
bookmarkSchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments' , 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Bookmark: BookmarkModel<IBookmark> = model<IBookmark>('Bookmark', bookmarkSchema) as BookmarkModel<IBookmark>;
