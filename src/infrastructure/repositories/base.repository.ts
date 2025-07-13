import { Model } from "mongoose";

export abstract class BaseRepository<T> {

    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

 
    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    async create(data: any): Promise<T> {
        return await this.model.create(data);
    }

}
