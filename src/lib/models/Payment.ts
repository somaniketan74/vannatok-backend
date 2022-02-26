import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IPayment extends Document {
    orderId: string,
    amount: number,
    currency: string,
    provider: string,
    client_secret: string,
    status: string
}

interface PaymentModel<T extends Document> extends PaginateModel<T> {};

const paymentSchema:Schema = new Schema({
    orderId: {type: Schema.Types.ObjectId, ref: 'Order'},
    amount: {type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, enum: ["Stripe"], required: true },
    client_secret: { type: String},
    status: { type: String, enum:["New", "Created", "Success", "Failed", "Processing"], required: true, default: "New"},
},{timestamps: true});
paymentSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
paymentSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Payment: PaymentModel<IPayment> = model<IPayment>('Payment', paymentSchema) as PaymentModel<IPayment>;