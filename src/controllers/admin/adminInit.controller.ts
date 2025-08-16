import { NextFunction, Request, Response } from "express";
import { IAdminData, IAdminInitUse } from "../../config/Dependency/admin/adminInit.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IAdminInit } from "../../interfaces/admin/adminInit.controller.interface";
import { IGetDashBoard } from "../../config/Dependency/admin/comapanymanage.di";


export class AdminController implements IAdminInit {

    constructor(
        private adminInitUsecase: IAdminInitUse,
        private adminDataUsecase: IAdminData,
        private getDashBoardData: IGetDashBoard
    ) { }


    dashBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this.getDashBoardData.execute();
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }


    getAdminData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this.adminDataUsecase.execute(req.user.id);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;
        } catch (err) {
            next(err);
        }
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
