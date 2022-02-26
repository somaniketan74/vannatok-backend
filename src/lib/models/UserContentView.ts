import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IUserContentView extends Document {
    userId: string,
    contentId: string
}

/* Model interface */
export interface IUserContentViewModel<T extends Document> extends PaginateModel<T> {}

const userContentViewSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content' }
}, { timestamps: true });

userContentViewSchema.plugin(mongoosePaginate);
userContentViewSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const UserContentView: IUserContentViewModel<IUserContentView> = model<IUserContentView>('UserContentView', userContentViewSchema) as IUserContentViewModel<IUserContentView>;