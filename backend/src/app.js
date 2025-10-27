import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import finanzasRoutes from './routes/finanzas.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()  // servidor 

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))

app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser())

app.use('/api', authRoutes);
app.use('/api', finanzasRoutes);
export default app;  