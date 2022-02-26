import { model, Schema, Document, PaginateModel } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";
import axios from "axios";

export interface ICompanyEnquiry extends Document {
    name: string,
    email: string,
}

export interface CompanyEnquiryModel<T extends Document> extends PaginateModel<T> , SoftDeleteModel<T> {}

const companyEnquirySchema:Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
},{timestamps: true});

companyEnquirySchema.plugin(mongoosePaginate);

//Below plugin used for soft delete
companyEnquirySchema.plugin(mongoose_delete, { overrideMethods: ['countDocuments' , 'count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

companyEnquirySchema.post<ICompanyEnquiry>('save', async function (doc:any, next:any) {
    //Send slack notification
    const message = `Company name is -> ${this.name} and email address is -> ${this.email}`
    const { data } = await axios({
        url: process.env.SLACK_NOTIFIER_URL,
        method: 'post',
        data: {
            "text": message
        },
    });
    next();
});

export const CompanyEnquiry: CompanyEnquiryModel<ICompanyEnquiry> = model<ICompanyEnquiry>('CompanyEnquiry', companyEnquirySchema) as CompanyEnquiryModel<ICompanyEnquiry>;
