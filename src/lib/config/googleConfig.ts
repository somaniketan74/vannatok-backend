export const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
};

export const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];