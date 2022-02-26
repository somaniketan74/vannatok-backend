import { number } from "joi";
import { model, Schema, Document, Model } from "mongoose";
import mongoose_delete from "mongoose-delete";

export interface ITemplate extends Document {
    name: string,
    code: number,
    content: string,
    channel: Array<string>,
    jsonSchema: string
}

const templateSchema:Schema = new Schema({
    name: { type: String, required: true },
    code: { type: Number, required: true },
    content: { type: String, required: true },
    channel: { type: String, enum: ['EMAIL', 'APP-NOTIFICATION', 'PUSH-NOTIFICATION'], required: true },
    jsonSchema: { type: String, required: true },
    isVisibleToUser: { type: Boolean, required: true, default: true}
},{timestamps: true});

//Below plugin used for soft delete
templateSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Template: Model<ITemplate> = model('Template', templateSchema);

