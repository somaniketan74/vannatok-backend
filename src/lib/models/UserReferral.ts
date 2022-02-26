import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IUserReferral extends Document {
    refferalUser: string,
    userId: string
}

/* Model interface */
export interface IUserReferralModel<T extends Document> extends PaginateModel<T> {}

const userReferralSchema: Schema = new Schema({
    refferalUser: { type: String, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });

userReferralSchema.plugin(mongoosePaginate);
userReferralSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const UserReferral: IUserReferralModel<IUserReferral> = model<IUserReferral>('UserReferral', userReferralSchema) as IUserReferralModel<IUserReferral>;