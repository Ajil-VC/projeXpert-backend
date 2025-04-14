import { Request, Response } from "express";
import userModel from "../../models/user.models";
import workSpaceModel from "../../models/workspace.models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { decodeToken } from "../common/decodeJWT";

const securePassword = async (passWord: string) => {

    try {

        const hashedP = await bcrypt.hash(passWord, 10);
        return hashedP;

    } catch (err) {
        console.error(`Something went wrong while securing password. ${err}`)
    }
}

export const createProfile = async (req: Request, res: Response) => {

    try {

        const { email, userName, passWord } = req.body;
        const hashedPassword = await securePassword(passWord);

        const newUser = new userModel({
            name: userName,
            email: email,
            password: hashedPassword,
            plan: 'Free',
        })


        const userData = await newUser.save();
        if (userData) {

            const newWorkSpace = new workSpaceModel({
                name: 'My Workspace',
                owner: userData._id,
                isDefault: true,
                members: [userData._id]
            })
            const createdWorkSpace = await newWorkSpace.save();
            userData.workspaceIds.push(createdWorkSpace._id);
            await userData.save();

            if (!config.JWT_SECRETKEY) {
                throw new Error('JWT secret key is not defined.');
            }

            const token = jwt.sign(
                {
                    id: userData._id,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role
                },
                config.JWT_SECRETKEY,
                { expiresIn: '1h' }
            )

            res.status(201).json({
                status: true,
                token,
                user: {
                    name: userData.name,
                    profileUrl: userData.profilePicUrl,
                    email: userData.email,
                    plan: userData.plan,
                    role: userData.role,
                    workSpaces: userData.workspaceIds
                },
                workSpace: {
                    name: createdWorkSpace.name,
                    owner: createdWorkSpace.owner,
                    isDefault: createdWorkSpace.isDefault,
                    members: createdWorkSpace.members
                }
            });
        }

    } catch (err) {

        console.error(`Something went wrong while creating profile. ${err}`);
        res.status(500).json({ status: false, message: 'Something went wrong while creating user profile.' });
    }
}


export const getInitData = async (req: Request, res: Response) => {

    try {

        const tokenData = decodeToken(String(req.headers.authorization));//Custom function in the common folder.
        const userData = await userModel.findOne({ email: tokenData.email }).populate('workspaceIds');

        if (userData) {

            res.status(201).json({
                status: true,
                user: {
                    name: userData.name,
                    profileUrl: userData.profilePicUrl,
                    email: userData.email,
                    plan: userData.plan,
                    role: userData.role,
                    workSpaces: userData.workspaceIds
                },
                workSpaces: userData.workspaceIds
            });

        }

    } catch (err) {
        console.error(`Error occured while trying to get init data. ${err}`);
    }

}