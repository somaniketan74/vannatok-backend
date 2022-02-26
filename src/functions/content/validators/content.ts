import Joi from "joi";
export const getContentUploadUrlSchema = {
    fileType: Joi.string().required(),
    resource: Joi.string()
}

const itemSchema = {
    contentId: Joi.string().required(),
    sequence: Joi.number(),
}
const skillSchema = {
    skillId: Joi.string().required(),
    name: Joi.string()
}
export const createContentSchema = {
    title: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().required().valid("Text", "PDF", "Video", "Group", "Image", "Reel", "Questionnaire"),
    data: Joi.any().when('type', { not: 'Group', then: Joi.any().required() }),
    skills: Joi.array().items(skillSchema).required(),
    groupId: Joi.string(),
    thumbnails: Joi.array().items(Joi.string()),
    sequence: Joi.number(),
    amount: Joi.number(),
    currency: Joi.any().when('amount', { is: Joi.exist(), then: Joi.any().required().valid("usd") }),
    level: Joi.array().items(Joi.string().valid("Beginner", "Intermediate", "Expert")),
    tags: Joi.array().items(Joi.string()),
    isPremium: Joi.boolean()
}

export const createContentByAdminSchema = {
    title: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().required().valid("Text", "PDF", "Video", "Group", "Image", "Reel", "Questionnaire"),
    data: Joi.any().when('type', { not: 'Group', then: Joi.any().required() }),
    skills: Joi.array().items(skillSchema),
    createdBy: Joi.object({
        userId: Joi.string().required(),
        username: Joi.string(),
    }).required(),
    updatedBy: Joi.object({
        userId: Joi.string().required(),
        username: Joi.string(),
    }).required(),
    groupId: Joi.string(),
    thumbnails: Joi.array().items(Joi.string()),
    status: Joi.string().valid("InReview", "Published", "Rejected", "Blocked", "Copyrighted"),
    sequence: Joi.number(),
    amount: Joi.string(),
    currency: Joi.any().when('amount', { is: Joi.exist(), then: Joi.any().required().valid("usd") }),
    level: Joi.array().items(Joi.string()).valid("Beginner", "Intermediate", "Expert"),
    tags: Joi.array().items(Joi.string()),
    isPremium: Joi.boolean()
}

export const updateContentByAdminSchema = {
    title: Joi.string(),
    description: Joi.string(),
    data: Joi.any().when('type', { not: 'Group', then: Joi.any().required() }),
    skills: Joi.array().items(skillSchema),
    type: Joi.string().valid("Text", "PDF", "Video", "Group", "Image", "Reel", "Questionnaire"),
    pathParameters: Joi.object({
        id: Joi.string().required()
    }),
    groupId: Joi.string(),
    thumbnails: Joi.array().items(Joi.string()),
    status: Joi.string().valid("InReview", "Published", "Rejected", "Blocked", "Copyrighted"),
    sequence: Joi.number(),
    amount: Joi.number(),
    currency: Joi.string().valid("usd"),
    level: Joi.array().items(Joi.string()).valid("Beginner", "Intermediate", "Expert"),
    tags: Joi.array().items(Joi.string()),
    isPremium: Joi.boolean()
}

export const updateContentBySchema = {
    title: Joi.string(),
    description: Joi.string(),
    data: Joi.string(),
    skills: Joi.array().items(skillSchema),
    pathParameters: Joi.object({
        id: Joi.string().required()
    }),
    thumbnails: Joi.array().items(Joi.string()),
    sequence: Joi.number(),
    amount: Joi.number(),
    currency: Joi.string().valid("usd"),
    level: Joi.array().items(Joi.string()).valid("Beginner", "Intermediate", "Expert"),
    tags: Joi.array().items(Joi.string()),
    isPremium: Joi.boolean()
}

export const getContentListSchema = {
    page: Joi.number(),
    limit: Joi.number(),
    q: Joi.string(),
    ctype: Joi.string(),
    categories: Joi.string(),
    subCategories: Joi.string(),
    skills: Joi.string(),
    priority: Joi.string(),
    groupId: Joi.string(),
    userId: Joi.string(),
    isPremium: Joi.boolean(),
    myContent: Joi.boolean(),
    slug: Joi.string(),
    userView: Joi.string()
}

export const getListByAdminSchema = {
    page: Joi.number(),
    limit: Joi.number(),
    status: Joi.string().valid("Review", "Published", "Rejected"),
    q: Joi.string(),
    ctype: Joi.string(),
    categories: Joi.string(),
    subCategories: Joi.string(),
    skills: Joi.string(),
    groupId: Joi.string(),
    slug: Joi.string()
}

export const getUserAnalyticsSchema = {
    page: Joi.number(),
    limit: Joi.number()
}
