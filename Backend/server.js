import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/routers.js';
import 'dotenv/config';
import pm2 from 'pm2';

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

// Wrap the app.listen in pm2.connect to manage it with PM2
pm2.connect(function (err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }

    pm2.start({
        name: 'moviecritics',
        script: 'server.js',
        autorestart: true,
        watch: true,
        ignore_watch: ["node_modules", "logs"],
        max_memory_restart: '1G',
        env: {
            "PORT": port,
            "NODE_ENV": "production",
        },
    }, function (err, apps) {
        pm2.disconnect();
        if (err) throw err;
        console.log('PM2 started successfully');
    });
});
