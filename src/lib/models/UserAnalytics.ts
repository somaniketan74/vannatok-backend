import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IUserAnalytics extends Document {
    user_id: string,
    views: number,
    uploads: number,
    sales: number,
    earning: number
}

/* Model interface */
export interface IUserAnalyticsModel<T extends Document> extends PaginateModel<T> {}

const userAnalyticsSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, required: true, default: 0 },
    uploads: { type: Number, required: true, default: 0 },
    sales: { type: Number, required: true, default: 0 },
    earning: { type: Number, required: true, default: 0 }
}, { timestamps: true });

userAnalyticsSchema.plugin(mongoosePaginate);
userAnalyticsSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const UserAnalytics: IUserAnalyticsModel<IUserAnalytics> = model<IUserAnalytics>('UserAnalytic', userAnalyticsSchema) as IUserAnalyticsModel<IUserAnalytics>;