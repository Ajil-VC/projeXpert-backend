import { NextFunction, Request, Response } from "express";
import { ICompanyManagementUse, ICompanyStatusChange, IGetSubscriptionAdmin } from "../../config/Dependency/admin/comapanymanage.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { ICompanyManagement } from "../../interfaces/admin/company.controller.interface";

export class CompanyManagementController implements ICompanyManagement {


    constructor(
        private companyManagementUsecase: ICompanyManagementUse,
        private companyStatusChangeUsecase: ICompanyStatusChange,
        private getSubscriptionsusecase: IGetSubscriptionAdmin
    ) { }


    getSubscriptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const searchTerm = typeof req.query.searchTerm === 'string' ? req.query.searchTerm.trim() : '';
            const sort = req.query.sort === '1' ? 1 : -1;
            const page = req.query.page;
            const pageNum =
                typeof page === "string"
                    ? parseInt(page)
                    : 1;

            const limit = 2;
            const skip = (pageNum - 1) * limit;

            const result = await this.getSubscriptionsusecase.execute(searchTerm, sort, limit, skip);
            res.status(HttpStatusCode.OK).json({ status: true, result });
            return;

        } catch (err) {
            next(err);
        }
    }


    changeUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { userId, status } = req.body;

            await this.companyManagementUsecase.execute(userId, status);

            res.status(HttpStatusCode.OK).json({ status: true, message: 'User status updated.' });
            return;

        } catch (err) {

            next(err);
        }
    }


    changeCompanyStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { companyId, status } = req.body;

            const companyStatus = status === 'true' ? true : false;

            const result = await this.companyStatusChangeUsecase.execute(companyId, companyStatus);
            if (result) {
                res.status(HttpStatusCode.OK).json({ status: true, message: `Status changed.` });
                return;
            }

            throw new Error('Couldnt update the status.');

        } catch (err) {
            next(err);
        }
    }

}
