import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface ICompanyFollow extends Document {
    userId: String,
    companyId: String
}
interface CompanyFollowModel<T extends Document> extends PaginateModel<T> {};

const companyFollowSchema:Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
    companyId: {type: Schema.Types.ObjectId, required: true, ref: 'Company' }
},{timestamps: true});
companyFollowSchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
companyFollowSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const CompanyFollow: CompanyFollowModel<ICompanyFollow> = model<ICompanyFollow>('CompanyFollow', companyFollowSchema) as CompanyFollowModel<ICompanyFollow>;
