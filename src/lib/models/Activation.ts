import { model, Schema, Document, Model } from "mongoose";
import mongoose_delete from "mongoose-delete";

export interface IActivation extends Document {
    key: string,
    userId: string,
    verified: boolean
}

const activationSchema:Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    key: { type: String, required: true },
    verified: { type: Boolean, default: false },
},{timestamps: true});

//Below plugin used for soft delete
activationSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const UserActivation: Model<IActivation> = model('UserActivation', activationSchema);