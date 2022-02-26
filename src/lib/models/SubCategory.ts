import { model, Schema, Model, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ISubCategory extends Document {
    name: string,
    categoryId: string,
    image: string
}

const subCategorySchema:Schema = new Schema({
    name: {type: String, required: true},
    categoryId: {type: Schema.Types.ObjectId, ref: "Category", required: true },
    order: {type: Number},
    externalId: { type: String},
    image: { type: String}
},{timestamps: true});
subCategorySchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
subCategorySchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const SubCategory: Model<ISubCategory> = model('SubCategory', subCategorySchema);