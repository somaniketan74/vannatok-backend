import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IBlogView extends Document {
    userId: string,
    blogId: string
}

interface BlogViewModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T> { };

const blogViewSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: String, required: true },
}, { timestamps: true });
blogViewSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
blogViewSchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments', 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const BlogView: BlogViewModel<IBlogView> = model<IBlogView>('BlogView', blogViewSchema) as BlogViewModel<IBlogView>;
