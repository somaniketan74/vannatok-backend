import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IOrder extends Document {
    userId: string,
    product: {
        productId: string,
        contentId: string,
        title: string,
        description: string,
        stripeId: string    
    },
    price: {
        priceId: string,
        amount: number,
        currency: string    
    }
}

interface OrderModel<T extends Document> extends PaginateModel<T> {};

const orderSchema:Schema = new Schema({
    orderNo: {type: String, required: true}, 
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    product: {
        productId: {type: Schema.Types.ObjectId, ref: 'Product' },
        contentId: {type: Schema.Types.ObjectId, ref: 'Content' },
        title: { type: String },
        description: { type: String },
        stripeId: { type: String }
    },
    price: {
        priceId: {type: Schema.Types.ObjectId, ref: 'Price' },
        amount: {type: Number, required: true },
        currency: {type: String, required: true }
    },
    status: { type: String, enum: [ "New", "Success", "Failed"], default: "New" }
},{timestamps: true});
orderSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
orderSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Order: OrderModel<IOrder> = model<IOrder>('Order', orderSchema) as OrderModel<IOrder>;
