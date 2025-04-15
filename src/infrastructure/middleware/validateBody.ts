import { NextFunction, Request, Response } from "express";

export const validateBody = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {

    try {

        const validated = await schema.validate(req.body, { abort: false });
        req.body = validated;
        next();

    } catch (err: any) {
        res.status(400).json({ errors: err });
    }
}