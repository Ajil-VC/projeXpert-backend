import { NextFunction, Request, Response } from "express";
import { adminInitUsecase } from "../../config/Dependency/admin/adminInit.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IAdminInit } from "../../interfaces/admin/adminInit.controller.interface";
import { AdminInitUseCase } from "../../application/usecase/admin/admininit.usecase";


export class AdminController implements IAdminInit {

    private adminInitUsecase: AdminInitUseCase;
    constructor() {
        this.adminInitUsecase = adminInitUsecase;
    }

    platFormData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this.adminInitUsecase.execute();
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
}
