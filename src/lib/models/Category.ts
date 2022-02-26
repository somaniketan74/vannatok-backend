import { model, Schema, Model, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ICategory extends Document {
    name: string,
    image: string
}

const categorySchema:Schema = new Schema({
    name: {type: String, required: true},
    order: {type: Number},
    externalId: { type: String},
    image: { type: String},
},{timestamps: true});
categorySchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
categorySchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Category: Model<ICategory> = model('Category', categorySchema);
