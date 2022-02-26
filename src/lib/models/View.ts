import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IView extends Document {
    userId: String,
    contentId: String,
    duration: Number,
}
interface ViewModel<T extends Document> extends PaginateModel<T> {};

const viewSchema:Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
    contentId: {type: Schema.Types.ObjectId, required: true, ref: 'Content' },
    duration: { type: Number, default:0 }
},{timestamps: true});
viewSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
viewSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const View: ViewModel<IView> = model<IView>('View', viewSchema) as ViewModel<IView>;
