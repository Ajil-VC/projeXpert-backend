import { Permissions, Roles } from "../../infrastructure/database/models/role.interface";



export interface IRoleRepository {

    getRoles(companyId: string): Promise<Array<Roles>>;
    createRole(roleName: string, permissions: Array<Permissions>, description: string, companyId: string, canMutate?: boolean): Promise<Roles>;
    deleteRole(roleId: string): Promise<boolean>;
    getRoleWithId(roleId: string): Promise<Roles>;
    updateRole(roleName: string, permissions: Array<Permissions>, description: string, roleId: string): Promise<Roles>;
}