import express from 'express';
import formidable from 'express-formidable';
import { eventController, getEventController } from '../controllers/eventController.js';

const router = express.Router()

router.post('/create', formidable(), eventController )

router.get('/get', getEventController)


export default router;