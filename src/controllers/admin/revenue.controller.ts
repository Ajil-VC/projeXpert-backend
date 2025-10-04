import { Request, Response, NextFunction } from "express";
import { IRevenueController } from "../../interfaces/admin/revenue.controller.interface";
import { IRevenueUsecase } from "../../config/Dependency/admin/revenue.di";
import { HttpStatusCode } from "../../config/http-status.enum";


export class RevenueController implements IRevenueController {

    constructor(private _revenueUse: IRevenueUsecase) { }

    getRevenueReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            let filter: "year" | "month" | "date" | null = 'year';
            if (req.query.filter === 'month') {
                filter = 'month';
            } else if (req.query.filter === 'date') {
                filter = 'date';
            }

            const tags = req.query.plans;
            let plans: string[] = [];

            if (Array.isArray(tags)) {
                plans = tags.flatMap(tag => {
                    if (typeof tag === 'string' && tag.includes(',')) {
                        return tag.split(',').map(id => id.trim()).filter(id => id.length > 0);
                    }
                    return typeof tag === 'string' ? tag.trim() : [];
                }).filter(id => id.length > 0);
            } else if (typeof tags === "string") {
                if (tags.includes(',')) {
                    plans = tags.split(',').map(id => id.trim()).filter(id => id.length > 0);
                } else {
                    plans = [tags.trim()].filter(id => id.length > 0);
                }
            }


            const startDate = typeof req.query.startDate === 'string' && req.query.startDate !== 'undefined' ? new Date(req.query.startDate) : null;
            const endDate = req.query.endDate && typeof req.query.endDate === 'string' && req.query.endDate !== 'undefined' ? new Date(req.query.endDate) : null;

            const graphData = await this._revenueUse.execute(filter, plans, startDate, endDate);

            res.status(HttpStatusCode.OK).json({ status: true, result: graphData });
            return;

        } catch (err) {
            next(err);
        }

    }

}