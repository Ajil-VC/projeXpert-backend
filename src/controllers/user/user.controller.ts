import { Request, Response, NextFunction } from "express";
import { IUserController } from "../../interfaces/user/user.controller.interface";
import { HttpStatusCode } from "../../config/http-status.enum";
import { RESPONSE_MESSAGES } from "../../config/response-messages.constant";
import { IUpdateProfile} from "../../config/Dependency/user/user.di";






export class userController implements IUserController {

    constructor(
        private updateProfilePic: IUpdateProfile
    ) { }

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const name = req.body.name;
            const files = req.files as Express.Multer.File[] || [];

            const file = files[0];
            const result = await this.updateProfilePic.execute(file, req.user.id, name);

            res.status(HttpStatusCode.OK).json({ status: true, message: RESPONSE_MESSAGES.COMMON.SUCCESS, result });
            return;

        } catch (err) {

            next(err);
        }
    }
}





