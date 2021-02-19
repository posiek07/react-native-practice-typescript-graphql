import bcrypt from 'bcrypt'
import { Arg, Ctx, Mutation, Resolver, Query } from 'type-graphql'
import { User } from '../entity/User'
import { AuthInput } from '../graphql-types/AuthInput'
import { UserResponse } from '../graphql-types/UserResponse'
import { Request, Response } from 'express'
import { isEmail } from 'class-validator'

// getUserId

const invalidLoginResponse = {
    errors: [
        {
            path: 'email',
            message: 'invalid login'
        }
    ]
};


@Resolver()
export class AuthResolver {
    @Mutation(() => UserResponse)
    async register(@Arg('input') { email, })
}