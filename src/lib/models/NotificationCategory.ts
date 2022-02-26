import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoose_delete from "mongoose-delete";

export interface INotificationCategory extends Document {
    name: string,
    type: string,
}

const notificationCategorySchema:Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }
},{timestamps: true});

//Below plugin used for soft delete
notificationCategorySchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const NotificationCategory: Model<INotificationCategory> = model('NotificationCategory', notificationCategorySchema);


