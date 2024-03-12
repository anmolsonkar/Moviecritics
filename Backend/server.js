import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/routers.js';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

const URI = process.env.MONGODB_URI;

(async () => {
    try {
        await mongoose.connect(URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.log('MongoDB connection error:', error);
    }
})();

app.use('/api', routes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
