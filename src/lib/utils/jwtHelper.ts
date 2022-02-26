var jwt = require('jsonwebtoken');
import { IUser } from "../../lib/models/User";

export const jwtHelper = {

    createToken: async (user : IUser) => {        
        return jwt.sign({id : user._id, email : user.email, status : user.status, role : user.role, username: user.username}, process.env.JWT_SECRET || "");
    },

    verifyToken: async (token : String) => {
        return jwt.verify(token, process.env.JWT_SECRET || "");
    }
}