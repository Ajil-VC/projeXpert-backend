import { Subscription } from "../../infrastructure/database/models/subscription.interface";



export interface GetPlansDTO {
    plans: Subscription[],
    totalPage: number
}