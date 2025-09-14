import { NextFunction, Request, Response } from "express";
import { IAdminDataUsecase, IAdminInitUsecase } from "../../config/Dependency/admin/adminInit.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IAdminInitController } from "../../interfaces/admin/adminInit.controller.interface";
import { IGetDashBoardUsecase } from "../../config/Dependency/admin/comapanymanage.di";


export class AdminController implements IAdminInitController {

    constructor(
        private _adminInitUsecase: IAdminInitUsecase,
        private _adminDataUsecase: IAdminDataUsecase,
        private _getDashBoardData: IGetDashBoardUsecase
    ) { }


    dashBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this._getDashBoardData.execute();
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }


    getAdminData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this._adminDataUsecase.execute(req.user.id);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;
        } catch (err) {
            next(err);
        }
    }

    platFormData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const page = req.query.page_num;
            const searchTerm = typeof req.query.searchTerm !== 'string' || req.query.searchTerm === 'undefined' ? ''
                : req.query.searchTerm;

            const pageNum =
                typeof page === "string"
                    ? parseInt(page)
                    : 1;
            const limit = 4;
            const skip = (pageNum - 1) * limit;

            const result = await this._adminInitUsecase.execute(limit, skip, searchTerm);
            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Couldnt retirieve company details.' });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Data retrieved.', companyData: result.companyData, totalPages: result.totalPages });
            return;

        } catch (err) {

            next(err);
        }
    }
}
