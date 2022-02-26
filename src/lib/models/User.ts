import { model, Schema, Model, Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongoose_delete from "mongoose-delete";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    fullName: string,
    bio: string,
    profileImg: string,
    followedByCount: number,
    followingCount: number,
    status: string,
    role: string,
    country: string,
    dob: Date,
    age: number,
    companyId: string,
    resume: string,
    video: string,
    signupSource: string,
    platform: [string],
    deviceToken: [string],
    androidEndpointArn: [string],
    iosEndpointArn: [string],
    isAllowedToViewPremium: boolean
}

/* Model interface */
export interface IUserModel<T extends Document> extends PaginateModel<T> {}

export interface ILogin {
    email: string,
    password: string
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    fullName: { type: String },
    fb_user_id: { type: String },
    signupSource: { type: String, default: "learnreel" },
    platform: { type: [String], enum: ["android", "ios"] },
    deviceToken: { type: [String] },
    androidEndpointArn: { type: [String] },
    iosEndpointArn: { type: [String] },
    bio: { type: String },
    profileImg: { type: String },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    role: { type: String, enum: ["Admin", "User", "CompanyAdmin", "CompanyMember"], default: "User" },
    status: { type: String, enum: ["Active", "Inactive", "Blacklisted", "Pending", "Suspended"] },
    sso: { type: String, enum: ["google", "facebook", "linkedin", "apple", "twitter"] },
    country: { type: String},
    dob: { type: Date},
    age: { type: Number},
    resume: { type: String },
    video: { type: String },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    isAllowedToViewPremium: { type: Boolean }
}, { timestamps: true });

userSchema.index({ email: -1 })
userSchema.index({ username: -1 }, { unique: true, partialFilterExpression: { 'username': { $exists: true, $gt: '' } } })

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

export const User: IUserModel<IUser> = model<IUser>('User', userSchema) as IUserModel<IUser>;