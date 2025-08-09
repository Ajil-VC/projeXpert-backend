import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import companySubscriptionModel from "../../database/companySubscription.model";
import { companySubscription } from "../../database/models/companySubscription.interface";





export class CompanySubscriptionRepositoryImp implements ICompanySubscriptionRepository {


    async getPlanUsage(): Promise<any> {

        const currentYear = new Date().getFullYear();

        const data = await companySubscriptionModel.aggregate([

            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                        $lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
                    }
                }
            },

            {
                $group: {
                    _id: '$plan',
                    usageCount: { $sum: 1 }
                }
            },

            {
                $lookup: {
                    from: 'subscriptions',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'planDetails'
                }
            },

            {
                $unwind: {
                    path: '$planDetails',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $sort: {
                    usageCount: -1
                }
            },

            {
                $project: {
                    _id: 0,
                    planId: '$_id',
                    planName: '$planDetails.name',
                    planAmount: '$planDetails.price',
                    usageCount: 1
                }
            }
        ]);

        if (!data) {
            throw new Error('Couldnt retrieve data.');
        }

        return data;
    }



    async getMonthlySubscriptions(): Promise<any> {

        const currentYear = new Date().getFullYear();
        const data = await companySubscriptionModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                        $lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
                    }
                }
            },

            {
                $lookup: {
                    from: 'subscriptions',
                    localField: 'plan',
                    foreignField: '_id',
                    as: 'planDetails'
                }
            },

            {
                $unwind: {
                    path: '$planDetails',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$planDetails.price' }
                }
            },

            {
                $sort: { '_id': 1 }
            },

            {
                $project: {
                    month: '$_id',
                    count: 1,
                    totalAmount: 1,
                    _id: 0
                }
            }
        ]);

        if (!data) {
            throw new Error("Data not available.");
        }

        return data;

    }
}