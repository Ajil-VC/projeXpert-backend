import { AdminInitDTO } from "../../../application/DTO/adminInitDTO";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { User } from "../../database/models/user.interface";
import userModel from "../../database/user.models";
import { BaseRepository } from "../base.repository";


export class AdminRepositoryImp extends BaseRepository<User> implements IAdminRepository {

    constructor() {
        super(userModel);
    }

    async getAdmin(adminId: string): Promise<User> {

        return await this.findByIdOrThrow(adminId, 'Couldnt findout admin details.');
    }

    async getAllCompanyDetails(limit: number, skip: number, searchTerm: string): Promise<AdminInitDTO> {

        const [companyData, totalCountResult] = await Promise.all([

            userModel.aggregate([
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'company'
                    }
                },
                { $unwind: '$company' },
                {
                    $match: { 'company.name': { $regex: searchTerm, $options: 'i' } }
                },
                {
                    $group: {
                        _id: '$company._id',
                        companyDetails: { $first: '$company' },
                        users: {
                            $push: {
                                _id: '$_id',
                                name: '$name',
                                email: '$email',
                                role: '$role',
                                isBlocked: '$isBlocked',
                                profilePicUrl: '$profilePicUrl',
                                forceChangePassword: '$forceChangePassword',
                                systemRole: '$systemRole'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        companyId: '$_id',
                        companyDetails: 1,
                        users: 1
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]),

            userModel.aggregate([
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'company'
                    }
                },
                { $unwind: '$company' },
                {
                    $match: { 'company.name': { $regex: searchTerm, $options: 'i' } }
                },
                {
                    $group: {
                        _id: '$company._id'
                    }
                },
                { $count: 'total' }
            ])
        ]);


        if (!companyData) {
            throw new Error('Company data couldnt retrieve.');
        }

        const totalCount = totalCountResult[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit);

        return { companyData, totalPages };

    }

}