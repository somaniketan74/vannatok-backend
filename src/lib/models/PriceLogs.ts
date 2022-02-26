import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IPriceLog extends Document {
    priceId: string,
    oldPrice: any,
    newPrice: any,
    createdBy: string
}

interface PriceLogModel<T extends Document> extends PaginateModel<T> {};

const priceLogSchema:Schema = new Schema({
    priceId: {type: Schema.Types.ObjectId, required: true, ref: 'Price' },
    createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    oldPrice: { type: Schema.Types.Mixed, required: true },
    newPrice: { type: Schema.Types.Mixed, required: true }
},{timestamps: true});
priceLogSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
priceLogSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const PriceLog: PriceLogModel<IPriceLog> = model<IPriceLog>('PriceLog', priceLogSchema) as PriceLogModel<IPriceLog>;
