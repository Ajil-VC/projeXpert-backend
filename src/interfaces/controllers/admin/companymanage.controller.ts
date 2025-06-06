import { Request, Response } from "express";
import { companyManagementUsecase } from "../../../config/Dependency/admin/comapanymanage.di";
import { companyStatusChangeUsecase } from "../../../config/Dependency/admin/comapanymanage.di";

export const changeUserStatus = async (req: Request, res: Response) => {

    try {

        const { userId, status } = req.body;

        const result = await companyManagementUsecase.execute(userId, status);
        if (!result) {
            throw new Error('Couldnt update status.');
        }

        res.status(200).json({ status: true, message: 'User status updated.' });
        return;

    } catch (err) {

        console.error(`Error occured while trying to change user status. ${err}`);
        res.status(500).json({ status: false, message: 'Error occured while trying to change user status.' });

    }
}

export const changeCompanyStatus = async (req: Request, res: Response) => {

    try {

        const { companyId, status } = req.body;

        const companyStatus = status === 'true' ? true : false;

        const result = await companyStatusChangeUsecase.execute(companyId, companyStatus);
        if (result) {
            res.status(200).json({ status: true, message: `Status changed.` });
            return;
        }

        throw new Error('Couldnt update the status.');

    } catch (err) {
        console.error(`Error occured while trying to change company status. ${err}`);
        res.status(500).json({ status: false, message: 'Error occured while trying to change company status.' });

    }
}