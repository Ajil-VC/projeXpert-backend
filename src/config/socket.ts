import { Server } from 'socket.io';
import { addUser, getUserSocket, removeUser } from '../infrastructure/services/socket.manager';
import { config } from './config';
import jwt from 'jsonwebtoken';


let io: Server | null = null;

export const setupSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: config.FRONTEND_URL,
            credentials: true,
        }
    });

    //Sockets need to have seperate middleware.
    //For now Im creating socket middleware hereonly.

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        try {

            if (!token) {
                return next(new Error('Authentication error: Token missing'));
            }

            if (!config.JWT_SECRETKEY) {
                throw new Error('JWT secret key is not defined.');
            }

            const decoded = jwt.verify(token, config.JWT_SECRETKEY, (err: any, decoded: any) => {

                if (err) return
                socket.data.user = decoded;
                console.log('Authentication in socket: ', socket.data.user);
                next();

            });

        } catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {

        //Commented code is for user registration in socket.
        // But im already doing it while connecting to socket.
        //So im skipping this for now.
        // socket.on('register', (userId: string) => {
        //     console.log(`User ${userId} registered with socket ${socket.id}`);
        // });

        const userId = socket.data.user?.id;
        if (userId) {
            addUser(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
        }

        socket.on('video-signal', (data) => {
            const { to, type, offer, answer, candidate } = data;
console.log(to,'This is the to data')
            const targetSocketId = getUserSocket(to);
            if (!targetSocketId) {
                console.warn(`Target user ${to} is not connected`);
                return;
            }

            // Forward the signal to the intended user
            getIO().to(targetSocketId).emit('video-signal', {
                from: userId,
                to,
                type,
                offer,
                answer,
                candidate,
                caller: socket.data.user,
            });

            console.log(`Relayed ${type} signal from ${userId} to ${to}`);
        });

        socket.on('disconnect', () => {
            removeUser(socket.id);
            console.log('user disconnected');
        });
    });

    return io;
};


export const getIO = (): Server => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};