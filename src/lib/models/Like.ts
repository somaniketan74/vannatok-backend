import { model, Schema, Model, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ILike extends Document {
    userId: String,
    contentId: String
}

const likeSchema:Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    contentId: {type: Schema.Types.ObjectId, required: true, ref: 'Content' }
},{timestamps: true});
likeSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
likeSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Like: Model<ILike> = model('Like', likeSchema);
