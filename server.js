import express  from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';    
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import cors from 'cors';
import placeRoute from './routes/placeRoute.js'
import eventRoute from './routes/eventRoute.js'

//configure env
dotenv.config();

//database configuration
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
 
//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/place', placeRoute);
app.use('/api/v1/event', eventRoute);
//rest api
app.get('/', (req, res) => {
    res.send({
        message:'Welcome to ecommerce hey you'
    })
})

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT,() => {
    console.log(`Server Runing on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
});