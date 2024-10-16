import express from 'express';
import * as controller from '../controllers/user.js';

const userRoutes = express.Router();

userRoutes.get('/list-user', controller.getAllUsers);
userRoutes.post('/create-user', controller.createUser);
userRoutes.post('/login-user', controller.loginUser);
userRoutes.post('/block-user', controller.blockUser);
userRoutes.post('/unblock-user', controller.unBlockUser);
userRoutes.delete('/delete-user', controller.deleteUser);

export default userRoutes;