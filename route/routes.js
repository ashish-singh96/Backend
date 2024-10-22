import express from 'express';
import UserController from '../controller/UserController.js';

const route = express.Router();

route.post('/register', UserController.insert_user);
route.post('/login', UserController.login_user);
route.post('/logout', UserController.logout_user);
export default route;