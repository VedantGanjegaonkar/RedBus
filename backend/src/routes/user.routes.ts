import { Router } from 'express';

import { UserController} from '../controller/user.controller';


const userController = new UserController();

const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);


export default router