import { Express } from 'express';
import cloudinary from '../../config/cloudinary.config';
import streamifier from 'streamifier';
import { ICloudinary } from '../../domain/services/cloudinary.interface';

export class CloudUploadService implements ICloudinary {
    async uploadImage(file: Express.Multer.File ,folder:string): Promise<{ public_id: string; url: string }> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    
                },
                (error, result) => {
                    if (result) {
                        resolve({
                            public_id: result.public_id,
                            url: result.secure_url,
                        });
                    } else {
                        reject(error);
                    }
                }
            );


            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    }


    async deleteImage(publicId: string): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}
