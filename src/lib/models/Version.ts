import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IVersion extends Document {
    version: string,
    app: string
    updatedBy: string
}

interface VersionModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T> { };

const versionSchema: Schema = new Schema({
    version: { type: String, required: true },
    app: { type: String, enum: ["Learnreel-Android", "Learnreel-IOS", "Learnreel-Web"], required: true },
    updatedBy: { type: String, required: true }
}, { timestamps: true });
versionSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
versionSchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments', 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Version: VersionModel<IVersion> = model<IVersion>('Version', versionSchema) as VersionModel<IVersion>;