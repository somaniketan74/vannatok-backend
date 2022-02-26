import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IQuestionnaire extends Document {
    userId: string, 
    contentId: string,
    result: [object]
}

/* Model interface */
export interface IQuestionnaireModel<T extends Document> extends PaginateModel<T> {}

const questionnaireSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content' },
    result: { type: [Object], required: true }
}, { timestamps: true });

questionnaireSchema.plugin(mongoosePaginate);
questionnaireSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const Questionnaire: IQuestionnaireModel<IQuestionnaire> = model<IQuestionnaire>('Questionnaire', questionnaireSchema) as IQuestionnaireModel<IQuestionnaire>;