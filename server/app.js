import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import userRoute from './routes/userRoutes.js'
import personnelRoute from './routes/personnelRoutes.js'
import equipmentRoute from './routes/equipmentRoutes.js'
import borrowRoute from './routes/borrowRoutes.js'
import adminRoute from './routes/adminRoutes.js'

const app = express()

app.use('/api/user', userRoute)

app.use('/api/personnel', personnelRoute)

app.use('/api/equipment', equipmentRoute)

app.use('/api/borrow', borrowRoute)

app.use('/api/admin', adminRoute);

app.listen(3000);