import { model, Schema, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IShare extends Document {
    contentId: String,
    userId: String,
}

interface ShareModel<T extends Document> extends PaginateModel<T> {};

const shareSchema:Schema = new Schema({
    contentId: {type: Schema.Types.ObjectId, required: true, ref: 'Content' },
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
},{timestamps: true});
shareSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
shareSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Share: ShareModel<IShare> = model<IShare>('Share', shareSchema) as ShareModel<IShare>;
