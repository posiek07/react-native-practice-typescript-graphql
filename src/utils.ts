import jwt from 'jsonwebtoken';
import { Request } from 'express'


const APP_SECRET = process.env.SESSION_SECRET || 'rwerwkjer3'

function getUserId(context: { req: Request }) {
    const authorization = context.req.headers['authorization'];
    try {
        if (authorization) {
            const token = authorization.replace('Bearer ', '');
            const user = jwt.verify(token, APP_SECRET) as any;

            console.log(user)
            return user.id
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

export { getUserId, APP_SECRET };