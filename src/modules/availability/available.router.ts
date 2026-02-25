

import { Router } from 'express';

import { availabilityController } from './available.controller.js';
const router = Router();
router.get('/:tutorId', availabilityController.getAvailabilityByDate);

export  const availableRouter = router;