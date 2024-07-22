
import { User } from '../model';
import { IUser } from "../interfaces";
import { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// import yup from "yup"
// import userValidationSchema from "../yup/user.yup"

import {NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';


interface CreateUserParams {
    username: string;
    email: string;
    password: string;
    phone:string,
    role: string;
}

export class UserService {
   
    public async findUserByEmail(email: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('Email not found');
        }
        return user;
    }
    
    public async validatePassword(password: string, hashedPassword: string) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid password');
        }
        return isPasswordValid;
    }
    
    public  generateAuthToken(userId: string, role: string): string {
        return jwt.sign({ userId, role }, 'secret', { expiresIn: '10h' });
    }

    public async createUser(params: CreateUserParams) {

            const { username, email, password, role, phone } = params;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ValidationError('Email is already registered');
            }
           
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new user
            const newUser = new User({ username, email, password:hashedPassword, role,phone });
            await newUser.save();
            return newUser;
            

    }


    public async getUserId(authHeader:string|undefined):Promise<string>{

        if (!authHeader) {
            throw new NotFoundError("header not found")
           
        }

        const user =   jwt.verify(authHeader, 'secret') as { userId: string; role: string; iat: number; exp: number; };
        if (!user) {
            throw new NotFoundError("user not found (FORBIDEN)")
        }

        const userID = user.userId
        return userID

    }

    
public async getUserById(userID:string):Promise<IUser> {

    const user = await User.findById(userID)

    if(!user){
        throw new NotFoundError("user not found")
    }
    return user

}

}