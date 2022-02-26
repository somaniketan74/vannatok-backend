import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IForgotPasswordCode extends Document {
    code: String,
    userId: String
}
interface ForgotPasswordCodeModel<T extends Document> extends PaginateModel<T> {};

const forgotPasswordCodeSchema:Schema = new Schema({
    code: {type: String, required: true },
    userId: {type: String, required: true }
},{timestamps: true});
forgotPasswordCodeSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
forgotPasswordCodeSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const ForgotPasswordCode: ForgotPasswordCodeModel<IForgotPasswordCode> = model<IForgotPasswordCode>('ForgotPasswordCode', forgotPasswordCodeSchema) as ForgotPasswordCodeModel<IForgotPasswordCode>;
