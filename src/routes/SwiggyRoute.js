import {Router} from 'express';
import SwiggyController from '../controllers/SwiggyController.js';
const router = Router();


router.get("/home", SwiggyController.GetHomeMenu)
.get("/restaurant/menu",SwiggyController.GetRestaurant);


export default router;