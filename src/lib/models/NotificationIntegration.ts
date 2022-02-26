import { NumberAttributeValue } from "aws-sdk/clients/dynamodb";
import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoose_delete from "mongoose-delete";

export interface INotificationIntegration extends Document {
    code: string,
    categoryId: string,
    templateId: string,
    isActive: boolean
}

const notificationIntegrationSchema:Schema = new Schema({
    code: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "NotificationCategory", required: true },
    templateId: { type: Schema.Types.ObjectId, ref: "Template", required: true },
    isActive: { type: Boolean, required: true }
},{timestamps: true});

//Below plugin used for soft delete
notificationIntegrationSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const NotificationIntegration: Model<INotificationIntegration> = model('NotificationIntegration', notificationIntegrationSchema);
