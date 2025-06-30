import { NextFunction, Request, Response } from "express";
import { adminInitUsecase } from "../../../config/Dependency/admin/adminInit.di";

import { HttpStatusCode } from "../http-status.enum";

export const platFormData = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const result = await adminInitUsecase.execute();
        if (!result) {
            res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Couldnt retirieve company details.' });
            return;
        }

        res.status(HttpStatusCode.OK).json({ status: true, message: 'Data retrieved.', result });
        return;

    } catch (err) {

        next(err);
    }
}