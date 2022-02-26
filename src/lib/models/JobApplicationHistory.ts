import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

/* Change to Job Applcation */
export interface IJobApplicationHistory extends Document {
    jobApplicationId: string,
    status: string,
    createdBy: string,
    updatedBy: string,
}

interface JobApplicationHistoryModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T> { };

const jobApplicationHistorySchema: Schema = new Schema({
    jobApplicationId: { type: Schema.Types.ObjectId, ref: "JobApplication", required: true },
    status: { type: String, enum: ['Applied', 'Screening', 'Interview', "Disqualified", "Offer"], required: true },
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
jobApplicationHistorySchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
jobApplicationHistorySchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments', 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const JobApplicationHistory: JobApplicationHistoryModel<IJobApplicationHistory> = model<IJobApplicationHistory>('JobApplicationHistory', jobApplicationHistorySchema) as JobApplicationHistoryModel<IJobApplicationHistory>;
