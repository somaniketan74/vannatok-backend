import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IComment extends Document {
    userId: String,
    contentId: String,
    text: String,
}

interface CommentModel<T extends Document> extends PaginateModel<T> {};

const commentSchema:Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    contentId: {type: Schema.Types.ObjectId, required: true, ref: 'Content' },
    text: { type: String, required: true }
},{timestamps: true});
commentSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
commentSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Comment: CommentModel<IComment> = model<IComment>('Comment', commentSchema) as CommentModel<IComment>;
