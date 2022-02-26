import { model, Schema, Document, Model } from "mongoose";
import mongoose_delete from "mongoose-delete";

export interface IResetPassword extends Document {
    token: string,
    email: string,
    used: boolean,
}

const resetPasswordSchema:Schema = new Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    used: { type: Boolean, default: false },
},{timestamps: true});

//Below plugin used for soft delete
resetPasswordSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const ResetPassword: Model<IResetPassword> = model('ResetPassword', resetPasswordSchema);