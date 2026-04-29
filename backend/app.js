//importing modules
import express from 'express';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import cors from 'cors'

//running express
const app = express();



//importing middlewares
import notFoundMW from "./middlewares/notFoundMW.js";
import errorHandlingMW from "./middlewares/errorHandlingMW.js";


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Cache-Control'],
    credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});


//imporing routes
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import ticketRouter from './routes/ticketRoutes.js';

//using routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/tickets', ticketRouter);



//not found middleware
app.use("/", notFoundMW);


// global error handling middleware
app.use(errorHandlingMW);


export default app;