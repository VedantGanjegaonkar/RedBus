import { Router } from 'express';

import busController from '../controller/bus.controller';



const router = Router();

router.post('/', busController.createBus);
router.get('/', busController.getAllBuses);
router.get('/:id', busController.getBusById);
router.put('/:id', busController.updateBus);
router.delete('/:id', busController.deleteBus);

export default router