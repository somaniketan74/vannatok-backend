import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export type skills = {
    category: string,
    job_type: string
}


export interface IJob extends Document {
    title: string,
    description: string,
    type: string,
    external: boolean,
    external_job_ref: string,
    external_job_url: string,
    external_id: string,
    location: [string],
    jobId: string,
    //skills: [skills],
    skills: [string],
    status: string,
    companyId: string,
    createdBy: string,
    updatedBy: string,
    slug: string
}

export interface JobModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T>  {
    createJob(doc: IJob): Promise<IJob>
};

const jobSchema:Schema = new Schema({
    title: {type: String, required: true },
    description: {type: String, required: true },
    type: {type: String, enum:['Permanent', 'Contract'], required: true },
    external: { type: Boolean },
    external_job_ref: { type: String },
    external_job_url: { type: String },
    external_id: { type: String },
    location: {type: [String], required: true },
    jobId: {type: String, required: true },
    skills: {type: [String] },
    status: {type: String, enum:['New', 'Open', 'Closed'], required: true },
    slug: {type: String, required: true },
    companyId: {type: Schema.Types.ObjectId, ref: "Company", required: true },
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", required: true },
    stats: {
        applicants: { type: Number, default: 0 },
        view: { type: Number, default: 0 },
    }
},{timestamps: true});

jobSchema.static('createJob', async function (doc: IJob): Promise<IJob> {
    let jobObj = new Job(doc);
    return jobObj.save();
});
jobSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
jobSchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments' , 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Job: JobModel<IJob> = model<IJob>('Job', jobSchema) as JobModel<IJob>;
