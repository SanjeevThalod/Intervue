import express from 'express';
import { getAllPolls, getPollById } from '../Controllers/pollController.js';

const router = express.Router();

router.get('/history', getAllPolls);
router.get('/:id', getPollById);


export default router;
