import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IFollow extends Document {
    userId: String,
    followerId: String
}
interface FollowModel<T extends Document> extends PaginateModel<T> {};

const followSchema:Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    followerId: {type: Schema.Types.ObjectId, required: true, ref: 'User' }
},{timestamps: true});
followSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
followSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Follow: FollowModel<IFollow> = model<IFollow>('Follow', followSchema) as FollowModel<IFollow>;
