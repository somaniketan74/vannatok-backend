import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";
import { SoftDeleteModel } from "mongoose-delete";

export interface ITeam extends Document {
    email: string,
    fullName: string,
    bio: string,
    profileImg: string,
    designation: string,
    companyId: string,
    video: string,
    createdBy: string,
    updatedBy: string
}

/* Model interface */
export interface ITeamModel<T extends Document> extends PaginateModel<T>, SoftDeleteModel<T> {}

const teamSchema: Schema = new Schema({
    email: { type: String },
    fullName: { type: String, required: true },
    bio: { type: String, required: true },
    profileImg: { type: String },
    designation: { type: String},
    video: { type: String},
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

teamSchema.plugin(mongoosePaginate);
teamSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Team: ITeamModel<ITeam> = model<ITeam>('Team', teamSchema) as ITeamModel<ITeam>;