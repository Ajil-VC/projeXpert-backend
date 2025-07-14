import { Document, Model, PopulateOptions } from "mongoose";

export abstract class BaseRepository<T extends Document> {

    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }


    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    // Find by ID with error throwing
    async findByIdOrThrow(id: string, errorMessage?: string): Promise<T> {
        
        const document = await this.findById(id);
        if (!document) {
            throw new Error(errorMessage || `${this.model.modelName} with ID ${id} not found`);
        }
 
        return document;
    }

    // Find by ID with populate
    ////////////////////////////////////////////////////////
    async findByIdWithPopulate(id: string, populateOptions: PopulateOptions | PopulateOptions[]): Promise<T | null> {
        return await this.model.findById(id).populate(populateOptions).exec();
    }

    // Find by ID with populate and error throwing
    async findByIdWithPopulateOrThrow(id: string, populateOptions: PopulateOptions | PopulateOptions[], errorMessage?: string): Promise<T> {
        const document = await this.findByIdWithPopulate(id, populateOptions);
        if (!document) {
            throw new Error(errorMessage || `${this.model.modelName} with ID ${id} not found`);
        }
        return document;
    }



}
