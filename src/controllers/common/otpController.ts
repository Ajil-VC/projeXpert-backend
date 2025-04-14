import { otpModel, userModel } from '../../models/zIndex.models';

import { Request, Response } from "express";
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { config } from '../../config/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const securePassword = async (passWord: string) => {

    try {

        const hashedP = await bcrypt.hash(passWord, 10);
        return hashedP;

    } catch (err) {
        console.error(`Something went wrong while securing password. ${err}`)
    }
}


export const gen_otp = async (req: Request, res: Response): Promise<void> => {

    try {

        const email: string = req.body.email;

        const isEmailExist: any = await userModel.findOne({ email: email }).exec();
        if (isEmailExist) {
            res.status(409).json({ status: false, message: 'Email already exists' });
            return;
        }

        //OTP Generating
        const otp = otpGenerator.generate(5, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        console.log(`Otp for email ${email} is : ${otp}`);

        //OTP Saving to schema
        await otpModel.create({ email, otp });

        //Sending OTP to email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.FROM_EMAIL,
                pass: config.APP_PASSWORD
            }
        });
        await transporter.sendMail({
            from: config.FROM_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `OTP For ProjeXpert is : ${otp}`
        })

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (err) {
        console.error("Something went wrong while generating otp.", err)
        res.status(500).json({ error: "Something went wrong while generating otp." });
    }
}


export const validateOtp = async (req: Request, res: Response): Promise<void> => {

    try {

        const email = req.body.email;
        const otpFromUser = req.body.otp + '';

        const otpRecord = await otpModel.findOne({ email: email, otp: otpFromUser }).exec();

        if (otpRecord) {
            res.status(200).json({ message: "otp Validated", status: true });
        } else {
            res.status(404).json({ message: "Invalid otp", status: false });
        }

    } catch (err) {
        console.error("Something went wrong while validating otp", err);
        res.status(500).json({ error: "Something went wrong while validating otp" });
    }
}


export const signIn = async (req: Request, res: Response): Promise<void> => {

    try {
        const { email, passWord } = req.body;
        console.log(email, passWord)
        if (!email || !passWord) {
            res.status(400).json({ status: false, message: 'Email and password required.' });
            return;
        }

        const userData = await userModel.findOne({ email }).exec();
        if (!userData) {
            res.status(404).json({ status: false, message: 'Invalid credentials.' });
            return;
        }

        const isPassWordValid = await bcrypt.compare(passWord, userData?.password as string);
        console.log(isPassWordValid);

        if (!isPassWordValid) {
            res.status(400).json({ status: false, message: 'Invalid credentials.' });
            return;
        }

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

        res.status(200).json({ status: true, token });



    } catch (err) {
        console.error(`Error occured while loging in ${err}`);
        res.status(500).json({ error: 'Error occured while loging in' })
    }
}