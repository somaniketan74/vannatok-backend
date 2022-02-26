import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ISubscribe extends Document {
    email: string,
}

interface SubscribeModel<T extends Document> extends PaginateModel<T> {};

const subscribeSchema:Schema = new Schema({
    email: {type: String, required: true },
},{timestamps: true});
subscribeSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
subscribeSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Subscribe: SubscribeModel<ISubscribe> = model<ISubscribe>('Subscribe', subscribeSchema) as SubscribeModel<ISubscribe>;
