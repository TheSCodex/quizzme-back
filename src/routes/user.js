const express = require('express');
const controller = require('../controllers/user.js');

const userRoutes = express.Router();

userRoutes.get('/list-user', controller.getAllUsers);
userRoutes.post('/create-user', controller.createUser);
userRoutes.post('/login-user', controller.loginUser);
userRoutes.post('/block-user', controller.blockUser);
userRoutes.post('/unblock-user', controller.unBlockUser);
userRoutes.put('/demote-user', controller.unprivilegeUser);
userRoutes.put('/promote-user', controller.privilegeUser);
userRoutes.put('/update-user', controller.updateUser);
userRoutes.delete('/delete-user', controller.deleteUser);
userRoutes.post('/user/recovery-send', controller.sendRecoveryCode);
userRoutes.post('/user/recovery-validate', controller.validateRecoveryCode);
userRoutes.post('/user/recovery-post', controller.resetPassword);
userRoutes.post('/user/update-language', controller.updateUserLanguage);
userRoutes.post('/user/update-theme', controller.updateUserTheme);

module.exports = userRoutes;