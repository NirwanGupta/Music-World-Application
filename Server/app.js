require(`dotenv`).config();
require(`express-async-errors`);

const express = require(`express`);
const app = express();
const cronTask = require(`./utils/cron`);

const connectDB = require(`./db/connect`);

const fileUpload = require(`express-fileupload`);
const cloudinary = require(`cloudinary`).v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const authRoutes = require(`./routes/authRoutes`);
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const singerRoutes = require('./routes/singerRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const logActivityRoutes = require(`./routes/logActivityRoute`);

const errorHandlerMiddleware = require(`./middleware/error-handler`);
const notFoundMiddleware = require(`./middleware/not-found`);

const cookieParser = require(`cookie-parser`);
const morgan = require(`morgan`);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload({useTempFiles: true}));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan(`tiny`));

app.use(`/api/v1/auth`, authRoutes);
app.use('/api/v1/user', userRoutes);
app.use(`/api/v1/song`, songRoutes);
app.use('/api/v1/singer', singerRoutes);
app.use('/api/v1/playlists', playlistRoutes);
app.use(`/api/v1`, logActivityRoutes);

const port = process.env.PORT || 5000;

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connection established");
        app.listen(port, () => {
            cronTask.start();
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
