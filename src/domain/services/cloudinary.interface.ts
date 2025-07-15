

export interface ICloudinary {

    uploadImage(file: Express.Multer.File, folder: string): Promise<{ public_id: string; url: string }>;

    deleteImage(publicId: string): Promise<{ result: string }>;
}