import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ISkill extends Document {
    name: string,
    categoryId: [string],
    subCategoryId: [string]
}

interface SkillModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T> { };

const skillSchema: Schema = new Schema({
    name: { type: String, required: true },
    subCategoryId: {type: [Schema.Types.ObjectId], ref: "SubCategory", required: true },
    categoryId: {type: [Schema.Types.ObjectId], ref: "Category", required: true },
    order: {type: Number},
    externalId: { type: String},
}, { timestamps: true });
skillSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
skillSchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments', 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Skill: SkillModel<ISkill> = model<ISkill>('Skill', skillSchema) as SkillModel<ISkill>;
