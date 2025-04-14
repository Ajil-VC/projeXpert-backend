
import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async():Promise<void> => {

    try{

        const URI : string | undefined = config.MONGO_URI;

        if (!URI) {
            throw new Error('MONGO_URI is not defined in the configuration');
        }
        await mongoose.connect(URI);
        console.log('Connected to database successfully');
        
    }catch(err){

        if(err instanceof Error){
            
            console.error('MongoDB connection failed: ', err.message);
        }else{
            
            console.error('Something went wrong while trying to connect to MongoDB');
            
        }
        process.exit(1);
    }
}


export default connectDB;