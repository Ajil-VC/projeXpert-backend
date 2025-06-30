import { NextFunction, Request, Response } from "express";
import { companyManagementUsecase } from "../../../config/Dependency/admin/comapanymanage.di";
import { companyStatusChangeUsecase } from "../../../config/Dependency/admin/comapanymanage.di";

import { HttpStatusCode } from "../http-status.enum";

export const changeUserStatus = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { userId, status } = req.body;

        await companyManagementUsecase.execute(userId, status);

        res.status(HttpStatusCode.OK).json({ status: true, message: 'User status updated.' });
        return;

    } catch (err) {

        next(err);
    }
}

export const changeCompanyStatus = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { companyId, status } = req.body;

        const companyStatus = status === 'true' ? true : false;

        const result = await companyStatusChangeUsecase.execute(companyId, companyStatus);
        if (result) {
            res.status(HttpStatusCode.OK).json({ status: true, message: `Status changed.` });
            return;
        }

        throw new Error('Couldnt update the status.');

    } catch (err) {
        next(err);
    }
}