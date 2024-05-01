import express from 'express';
import formidable from 'express-formidable';
import { getPlaceController, placeController } from '../controllers/placeController.js';

const router = express.Router()

router.post('/create', formidable(), placeController )

router.get('/get', getPlaceController)


export default router;