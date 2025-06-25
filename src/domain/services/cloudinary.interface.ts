

export interface ICloudinary {

    uploadImage(file: Express.Multer.File): Promise<{ public_id: string; url: string }>;

    deleteImage(publicId: string): Promise<{ result: string }>;
}