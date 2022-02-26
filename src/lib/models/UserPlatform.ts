import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IUserPlatform extends Document {
    userId: string,
    platform: string,
    active: boolean,
    endpointArn: string,
    deviceToken: string,
}

/* Model interface */
export interface IUserPlatformModel<T extends Document> extends PaginateModel<T> {}

const userPlatformSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    platform: { type: String, required: true},
    active: { type: Boolean, required: true, default: true},
    endpointArn: { type: String, required: true},
    deviceToken: { type: String, required: true},
}, { timestamps: true });

userPlatformSchema.plugin(mongoosePaginate);
userPlatformSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const UserPlatform: IUserPlatformModel<IUserPlatform> = model<IUserPlatform>('UserPlatform', userPlatformSchema) as IUserPlatformModel<IUserPlatform>;