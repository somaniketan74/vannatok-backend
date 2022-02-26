import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoose_delete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";

export interface INotification extends Document {
    channel: Array<string>,
    email: Array<string>,
    endpointArn: Array<string>,
    platform: string,
    data: any,
    type: string,
    text: any,
    cc: string,
    bcc: string,
    subject: string,
    userId: string
}

export interface INotificationModel<T extends Document> extends PaginateModel<T> {}

const notificationSchema:Schema = new Schema({
    channel: { type: String, enum: ['EMAIL', 'APP-NOTIFICATION', 'PUSH-NOTIFICATION'], required: true },
    email: { type: Array,  required: false },
    endpointArn: { type: String, required: false },
    platform: { type: String, required: false },
    data: { type: Object , required: true },
    type: { type: String, required: true },
    text: { type: String, required: false },
    cc: { type: String, required: false },
    bcc: { type: String, required: false },
    subject: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    isVisibleToUser: { type: Boolean, required: true },
    read: { type: Boolean, required: true, default: false },
},{timestamps: true});

notificationSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
notificationSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Notification: INotificationModel<INotification> = model('Notification', notificationSchema) as INotificationModel<INotification>;
