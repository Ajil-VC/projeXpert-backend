import { Company } from "../../infrastructure/database/models/company.interface"
import { Team } from "../../infrastructure/database/models/team.interface"

interface CompanyData {
    companyDetails: Company,
    users: Team[],
    companyId: string
}

export interface AdminInitDTO {

    companyData: CompanyData[],
    totalPages: number
}