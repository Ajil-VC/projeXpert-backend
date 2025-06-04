import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import userModel from "../../database/user.models";


export class AdminRepositoryImp implements IAdminRepository {

    async getAllCompanyDetails(): Promise<any> {

        const allCompanyData = await userModel.aggregate([
            {
                $lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
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
            }
        ]);


        if(!allCompanyData){
            throw new Error('Company data couldnt retrieve.');
        }

        return allCompanyData;

    }

}