import { model, Schema, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ILoginActivity extends Document {
    userId: string,
    source: string
}

/* Model interface */
export interface ILoginActivityModel<T extends Document> extends PaginateModel<T> {}

const loginActivitySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, enum: ["vanna-android", "vanna-ios", "vanna-web", "vanna-partner-android", "vanna-partner-ios", "vanna-partner-web"]},
}, { timestamps: true });

loginActivitySchema.plugin(mongoosePaginate);
loginActivitySchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const LoginActivity: ILoginActivityModel<ILoginActivity> = model<ILoginActivity>('LoginActivity', loginActivitySchema) as ILoginActivityModel<ILoginActivity>;