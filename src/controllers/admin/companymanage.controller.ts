import { NextFunction, Request, Response } from "express";
import { companyManagementUsecase, getSubscriptionsusecase } from "../../config/Dependency/admin/comapanymanage.di";
import { companyStatusChangeUsecase } from "../../config/Dependency/admin/comapanymanage.di";

import { HttpStatusCode } from "../../config/http-status.enum";
import { ICompanyManagement } from "../../interfaces/admin/company.controller.interface";
import { changeUserStatusUseCase } from "../../application/usecase/admin/updateUserStatus.usecase";
import { ChangeCompanyStatusUsecase } from "../../application/usecase/admin/updateCompanyStatus.usecase";
import { GetSubscriptions } from "../../application/usecase/admin/getSubscriptionDetails.usecase";


export class CompanyManagementController implements ICompanyManagement {

    private companyManagementUsecase: changeUserStatusUseCase;
    private companyStatusChangeUsecase: ChangeCompanyStatusUsecase;
    private getSubscriptionsusecase: GetSubscriptions;
    constructor() {
        this.companyManagementUsecase = companyManagementUsecase;
        this.companyStatusChangeUsecase = companyStatusChangeUsecase;
        this.getSubscriptionsusecase = getSubscriptionsusecase;
    }


    getSubscriptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this.getSubscriptionsusecase.execute();
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
