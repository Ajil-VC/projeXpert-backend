import mongoose, { Types } from "mongoose";
import { useCaseResult } from "../../application/shared/useCaseResult";
import { Company } from "../../domain/entities/company.interface";
import { ICompanyRepository } from "../../domain/repositories/company.repo";
import companyModel from "../database/company.models";
import workSpaceModel from "../database/workspace.models";


export class CompanyRepositoryImp implements ICompanyRepository {


    async findCompanyById(companyId: string): Promise<any> {

        const companyIdOb = new mongoose.Types.ObjectId(companyId);
        const companyData = await companyModel.findOne({ _id: companyIdOb });
        if (!companyData) {
            throw new Error('Couldnt find companydata');
        }
        return companyData;
    }

    async changeCompanyStatus(companyId: string, status: boolean): Promise<any> {

        const companyIdOb = new mongoose.Types.ObjectId(companyId);
        const result = await companyModel.updateOne({ _id: companyIdOb }, { $set: { isBlocked: status } });

        if (result.modifiedCount === 0) {

            throw new Error('Status couldnt udpate.');
        }

        return result;

    }


    async createWorkspace(name: string, companyId: string): Promise<string | useCaseResult> {

        try {

            const companyObjectId = new Types.ObjectId(companyId);
            if (!Types.ObjectId.isValid(companyObjectId)) throw new Error('Company Id is not valid ObjectId');

            const newWorkSpace = new workSpaceModel({
                name: name,
                companyId: companyObjectId,
            })

            const createdWorkSpace = await newWorkSpace.save();
            if (!createdWorkSpace) throw new Error('Workspace not Saved');

            const companyData = await companyModel.findById(new Types.ObjectId(companyId));
            if (!companyData) return { status: false, message: 'No company data found' };
            companyData.workspaces.push(createdWorkSpace._id);
            await companyData.save();


            return String(createdWorkSpace._id);

        } catch (err) {
            console.error('Something went wrong while creating workspace.', err);
            throw new Error('Something went wrong while creating workspace.');
        }

    }


    async findCompanyByEmail(email: string): Promise<Company | null> {

        const isCompanyExist = await companyModel.findOne({ email: email }).exec();

        if (isCompanyExist) return isCompanyExist;
        return null;

    }



    async createCompany(companyName: string, email: string): Promise<string | useCaseResult> {

        try {

            const newCompany = new companyModel({
                email: email,
                name: companyName,
            })
            const companyData = await newCompany.save();
            if (!companyData) return { status: false, message: 'Company Not Saved' };
            return { status: true, message: '', additional: String(companyData._id) };

        } catch (err) {

            console.error('Something went wrong while saving data to db', err);
            return { status: false, message: 'Unknown Error' };
        }
    }

}