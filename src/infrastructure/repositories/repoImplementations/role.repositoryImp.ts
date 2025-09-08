import mongoose from "mongoose";
import { IRoleRepository } from "../../../domain/repositories/role.repo";
import { Permissions, Roles } from "../../database/models/role.interface";
import RolesModel from "../../database/roles.model";
import userModel from "../../database/user.models";



export class RoleRepositoryImp implements IRoleRepository {


    async updateRole(roleName: string, permissions: Array<Permissions>, description: string, roleId: string): Promise<Roles> {

        const roleOb = new mongoose.Types.ObjectId(roleId);
        const updatedRole = await RolesModel.findByIdAndUpdate(
            roleOb,
            {
                name: roleName,
                permissions,
                description
            },
            { new: true }
        );

        if (!updatedRole) {
            throw new Error('Couldnt update the role.');
        }

        return updatedRole;
    }


    async getRoleWithId(roleId: string): Promise<Roles> {

        const roleOb = new mongoose.Types.ObjectId(roleId);

        const role = await RolesModel.findOne({ _id: roleOb });

        if (!role) {
            throw new Error('Coudnt retrieve the role');
        }

        return role;
    }


    async deleteRole(roleId: string): Promise<boolean> {

        const roleOb = new mongoose.Types.ObjectId(roleId);

        const isRoleInUse = await userModel.findOne({ role: roleOb });
        if (isRoleInUse) {
            throw new Error('This role is in use. Please update the user role before deleting it.');
        }

        const result = await RolesModel.deleteOne({ _id: roleOb });

        if (result.deletedCount === 0) {
            return false;
        } else {
            return true;
        }
    }

    async getRoles(companyId: string): Promise<Array<Roles>> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const roles = await RolesModel.find({ companyId: companyOb }).sort({ canMutate: 1 });
        if (!roles) {

            throw new Error("Couldnt retrieve the roles.");
        }

        return roles;
    }


    async createRole(roleName: string, permissions: Array<Permissions>, description: string, companyId: string, canMutate: boolean = true): Promise<Roles> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const newRole = new RolesModel({
            name: roleName,
            permissions,
            description,
            companyId: companyOb,
            canMutate
        });

        const createdRole = await newRole.save();
        if (!createdRole) {
            throw new Error("Couldnt create new role.");
        }

        return createdRole;
    }


}