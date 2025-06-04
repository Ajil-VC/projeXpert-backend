import jwt from 'jsonwebtoken';
import { config } from '../../../config/config';
import { useCaseResult } from '../../shared/useCaseResult';
import { IUserRepository } from '../../../domain/repositories/user.repo';


export class RefreshTokenUseCase {

    constructor(private userRepo: IUserRepository) { }

    async execute(refreshToken: string): Promise<useCaseResult> {

        const userPayload = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);

        if (!userPayload || typeof userPayload === 'string' || !('userId' in userPayload)) {

            return {
                status: false,
                message: 'Invalid or expired refresh token',
                statusCode: 401
            }
        }
        const userData = await this.userRepo.findUserById((userPayload as jwt.JwtPayload).userId);

        if (!userData) {
            throw new Error('Userdata not available.');
        }

        if (!config.JWT_SECRETKEY) {
            throw new Error('JWT secret key is not defined.');
        }

        const token = jwt.sign(
            {
                id: userData._id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                isBlocked: userData.isBlocked,
                companyId: userData.companyId,
                systemRole: userData.systemRole
            },
            config.JWT_SECRETKEY as string,
            { expiresIn: '15m' }
        );


        return {
            status: true,
            message: 'Token ready',
            statusCode: 201,
            token: token,
            additional: userData.forceChangePassword
        }
    }

}