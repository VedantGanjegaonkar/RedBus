// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try{
       
        console.log(err);
        
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
    
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }catch(err){
        next(err);
    }
    
};