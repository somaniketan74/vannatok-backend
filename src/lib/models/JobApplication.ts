import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

/* Change to Job Applcation */
export interface IJobApplication extends Document {
    userId: string,
    userData: {
        username: string,
        fullName: string,
        email: string,
    },
    resume: string,
    status: string,
    history: [
        {
            status: string,
            date: Date
        }
    ],
    jobId: string,
    companyId: string,
    createdBy: string,
    updatedBy: string,
}

interface JobApplicationModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T> { };

const jobApplicationSchema: Schema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userData: {
        username: { type: String, required: true },
        fullName: { type: String },
        email: { type: String },
    },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    resume: { type: String },
    status: { type: String, enum: ['Applied', 'Screening', 'Interview', "Disqualified", "Offer"], required: true },
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: {type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
jobApplicationSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
jobApplicationSchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments', 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const JobApplication: JobApplicationModel<IJobApplication> = model<IJobApplication>('JobApplication', jobApplicationSchema) as JobApplicationModel<IJobApplication>;
