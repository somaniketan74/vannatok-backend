export type contentType = {
    createdBy: userType,
    updatedBy: userType,
    title: string,
    description: string,
    data: any,
    type: string,
    items: Array<itemType>,
    stats: {
        like: number,
        comment: number,
        views: number,
        shares: number
    },
    status: string,
    skills: Array<skillType>,
    categories: Array<categoryType>,
    subCategories: Array<subCategoryType>,
    tags: Array<string>,
    sequence: number,
    slug: string,
    groupId?: string,
    level?: [string],
    amount?: number,
    currency?: string,
    isPremium?: boolean 
}
export type itemType = {
    contentId: string,
    sequence: Number
}
type userType = {
    userId: string,
    username: string
}
type skillType = {
    skillId: string,
    name: string
}
type categoryType = {
    categoryId: string,
    name: string
}
type subCategoryType = {
    subCategoryId: string,
    name: string
}

export type getListType = {
    page: number,
    limit: number,
    q: string,
    ctype: string,
    priority: string,
    categories: string,
    subCategories: string,
    skills: string,
    groupId: string,
    userId: string,
    isPremium: boolean,
    myContent: string,
    slug: string,
    userView: boolean
}

export type getListByAdminType = {
    page: number,
    limit: number,
    q: string,
    ctype: string,
    categories: string,
    subCategories: string,
    skills: string,
    status: string,
    groupId: string,
    slug: string
}