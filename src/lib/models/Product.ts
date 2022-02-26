import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IProduct extends Document {
    type: string,
    duration: string,
    stripeId: string,
    createBy: string,
    updatedBy: string,
    isActive: boolean,
    title: string,
    description: string,
    features: [ string ]
}

interface ProductModel<T extends Document> extends PaginateModel<T> {};

const productSchema:Schema = new Schema({
    type: {type: String, enum: ["Subscription"], required: true },
    duration: {type: String, enum: ["Month", "Year"], required: true },
    stripeId: { type: String },
    createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    updatedBy: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    isActive: {type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    features: [ { type: String } ]
},{timestamps: true});
productSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
productSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Product: ProductModel<IProduct> = model<IProduct>('Product', productSchema) as ProductModel<IProduct>;
