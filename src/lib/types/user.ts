export type userType = {
    username?: String,
    email?: String,
    fullName?: String,
    bio?: String,
    profileImg?: String,
    status?: String,
    role?: String,
    country?: string,
    dob?: string

}

export type createUserTypes = {
    username: string,
    email: string,
    password: string,
    fullName: string,
    bio: string,
    profileImg: string,
    status: string
}

export type updateUserBodyTypes = {
    bio: string,
    fullName : string,
    profileImg : string,
    password : string,
    country?: string,
    dob?: Date,
    age?: number
}

export type userTokenType = {
    id: string,
    email: string,
    status: string,
    role: string,
    username: string
}