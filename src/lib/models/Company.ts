import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ICompany extends Document {
    createdBy: string,
    updatedBy: string,
    name: string,
    companyType: string,
    contactNo: string,
    email: string,
    founded: string,
    bio: string,
    locations: Array<string>,
    headquarter: string,
    logo: string,
    poster: string,
    gallery: [string],
    website: string,
    headerImg: string,
    employeeSize: string,
    slug: string,
    stats: {
        follower: number
    }
    isPublic: boolean
}

export interface CompanyModel<T extends Document> extends PaginateModel<T> , SoftDeleteModel<T> {}

const companySchema:Schema = new Schema({
    stats: {
        follower: { type: Number, default: 0}
    },
    createdBy: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    updatedBy: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: {type: String, required: true },
    companyType: {type: String, required: true },
    contactNo: {type: String },
    email: {type: String },
    founded: {type: String },
    bio: {type: String },
    locations: {type: [String] },
    headquarter: {type: String },
    logo: {type: String, required: true },
    poster: {type: String },
    gallery: {type: [String] },
    headerImg: {type: String },
    website: {type: String },
    employeeSize: {type: String },
    slug: { type: String, required: true },
    isPublic: {type: Boolean },
},{timestamps: true});

companySchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
companySchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments' , 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Company: CompanyModel<ICompany> = model<ICompany>('Company', companySchema) as CompanyModel<ICompany>;
