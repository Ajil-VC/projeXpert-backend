import { Request, Response } from "express";
import { adminInitUsecase } from "../../../config/Dependency/admin/adminInit.di";


export const platFormData = async (req: Request, res: Response) => {

    try {

        const result = await adminInitUsecase.execute();
        if (!result) {
            res.status(404).json({ status: false, message: 'Couldnt retirieve company details.' });
            return;
        }

        res.status(200).json({ status: true, message: 'Data retrieved.', result });
        return;

    } catch (err) {

        console.error(`Error occured while trying to get init data. ${err}`);
        res.status(500).json({ status: false, message: 'Error occured while trying to get init data.' });
    }
}