import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IJobUpload extends Document {
    companyId: string,
    fileUrl: string,
    createdBy:  string,
    updatedBy: string,
    success: boolean,
    successCount : number,
    failureCount : number,
    totalCount : number,
    status: string,
    identifier: string
}

interface jobUploadModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T> { };

const jobUploadSchema: Schema = new Schema ({
    companyId: {type: Schema.Types.ObjectId, ref: "Company", required: true },
    fileUrl: {type: String, required: true },
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", required: true },
    success: {type: Boolean, required: true },
    successCount : {type: Number, required: true },
    failureCount : {type: Number, required: true },
    totalCount : {type: Number, required: true },
    status: {type: String, enum:['In-Progress', 'Processed', 'Failed'], required: true },
    identifier: {type: String, required: true }
},{timestamps: true});

jobUploadSchema.plugin(mongoosePaginate);

jobUploadSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const JobUpload: jobUploadModel<IJobUpload> = model<IJobUpload>('JobUpload', jobUploadSchema) as jobUploadModel<IJobUpload>;

