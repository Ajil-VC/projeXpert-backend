import mongoose from "mongoose";
import { ICompanySubscriptionRepository } from "../../../domain/repositories/adminRepo/companysubscription.repo";
import companySubscriptionModel from "../../database/companySubscription.model";
import { companySubscription } from "../../database/models/companySubscription.interface";





export class CompanySubscriptionRepositoryImp implements ICompanySubscriptionRepository {


    async subscriptionWithinTimeperiod(plans: string[], startDate: Date | null = null, endDate: Date | null = null): Promise<any> {

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        let start = new Date(currentYear, currentMonth, 1);
        let end = new Date(currentYear, currentMonth + 1, 1);

        if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);

        }

        plans = plans.filter(id => mongoose.Types.ObjectId.isValid(id));

        const planObjectIds = plans?.length
            ? plans.map(id => new mongoose.Types.ObjectId(id))
            : [];

        const pipeline: any[] = [
            {
                $match: {
                    createdAt: { $gte: start, $lt: end }
                }
            }
        ];

        if (planObjectIds.length > 0) {
            pipeline.push(
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: 'plan',
                        foreignField: '_id',
                        as: 'planDetails'
                    }
                },
                { $unwind: { path: "$planDetails", preserveNullAndEmptyArrays: true } },
                {
                    $match: { "planDetails._id": { $in: planObjectIds } }
                }
            );
        } else {
            pipeline.push(
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: 'plan',
                        foreignField: '_id',
                        as: 'planDetails'
                    }
                },
                { $unwind: { path: "$planDetails", preserveNullAndEmptyArrays: true } }
            );
        }

        pipeline.push(

            {
                $group: {
                    _id: { $dayOfMonth: '$createdAt' },
                    createdAt: { $first: '$createdAt' },
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$planDetails.price' }
                }
            },
            {
                $sort: { '_id': 1 }
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: 1,
                    totalAmount: 1,
                    _id: 0
                }
            }
        );

        const data = await companySubscriptionModel.aggregate(pipeline);


        if (!data) {

            throw new Error("Method not implemented.");
        }

        return data;
    }


    async getSubscriptionData(searchTerm: string, sort: 1 | -1, limit: number, skip: number): Promise<{ subscriptions: Array<companySubscription>; totalPage: number; }> {

        const data = await companySubscriptionModel.aggregate([
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "company",
                },
            },
            { $unwind: "$company" },

            {
                $lookup: {
                    from: "subscriptions",
                    localField: "plan",
                    foreignField: "_id",
                    as: "plan",
                },
            },
            { $unwind: "$plan" },

            {
                $match: {
                    $or: [
                        { "company.name": { $regex: searchTerm, $options: "i" } },
                        { "company.email": { $regex: searchTerm, $options: "i" } },
                        { "plan.name": { $regex: searchTerm, $options: "i" } },
                    ],
                },
            },

            {
                $facet: {
                    metadata: [
                        { $count: "total" }
                    ],
                    data: [
                        { $sort: { createdAt: sort } },
                        { $skip: skip },
                        { $limit: limit }
                    ]
                }
            }
        ]);


        if (!data) {
            throw new Error('Couldnt retrieve data.');
        }

        const totalPage = data[0].metadata[0]?.total ? Math.ceil(data[0].metadata[0]?.total / limit) : 1;
        return { subscriptions: data[0].data, totalPage };

    }


    async top5Companies(): Promise<Array<{
        totalAmount: number,
        subscriptionCount: number,
        companyId: any,
        companyName: string
    }>> {


        const data = await companySubscriptionModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), 0, 1),
                        $lt: new Date(new Date().getFullYear() + 1, 0, 1)
                    },
                    subscriptionStatus: "active"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "plan",
                    foreignField: "_id",
                    as: "planData"
                }
            },
            { $unwind: "$planData" },
            {
                $group: {
                    _id: "$companyId",
                    totalAmount: { $sum: "$planData.price" },
                    subscriptionCount: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "companies",
                    localField: "_id",
                    foreignField: "_id",
                    as: "company"
                }
            },
            { $unwind: "$company" },
            {
                $project: {
                    _id: 0,
                    companyId: "$_id",
                    companyName: "$company.name",
                    totalAmount: 1,
                    subscriptionCount: 1
                }
            }
        ]);

        if (!data) {

            throw new Error("Couldnt findout top 5 companies.");
        }
        return data;
    }


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



    async getMonthlySubscriptions(plans: string[] = []): Promise<any> {

        const currentYear = new Date().getFullYear();

        plans = plans.filter(id => mongoose.Types.ObjectId.isValid(id));

        const planObjectIds = plans?.length
            ? plans.map(id => new mongoose.Types.ObjectId(id))
            : [];


        const pipeline: any[] = [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                        $lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
                    }
                }
            }
        ];

        if (planObjectIds.length > 0) {
            pipeline.push(
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: 'plan',
                        foreignField: '_id',
                        as: 'planDetails'
                    }
                },
                { $unwind: { path: "$planDetails", preserveNullAndEmptyArrays: true } },
                {
                    $match: { "planDetails._id": { $in: planObjectIds } }
                }
            );
        } else {
            pipeline.push(
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: 'plan',
                        foreignField: '_id',
                        as: 'planDetails'
                    }
                },
                { $unwind: { path: "$planDetails", preserveNullAndEmptyArrays: true } }
            );
        }

        pipeline.push(
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
        )
        const data = await companySubscriptionModel.aggregate(pipeline);

        if (!data) {
            throw new Error("Data not available.");
        }

        return data;

    }


}