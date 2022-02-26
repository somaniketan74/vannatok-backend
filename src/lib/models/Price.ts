import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IPrice extends Document {
    productId: string,
    amount: number,
    currency: string,
    createBy: string,
    updatedBy: string,
    isActive: boolean
}

interface PriceModel<T extends Document> extends PaginateModel<T> {};

const priceSchema:Schema = new Schema({
    productId: {type: Schema.Types.ObjectId, ref: 'Product' },
    contentId: {type: Schema.Types.ObjectId, ref: 'Content' },
    amount: {type: Number, required: true },
    currency: { type: String, required: true },
    createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    updatedBy: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    isActive: {type: Boolean, default: false }
},{timestamps: true});
priceSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
priceSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Price: PriceModel<IPrice> = model<IPrice>('Price', priceSchema) as PriceModel<IPrice>;
