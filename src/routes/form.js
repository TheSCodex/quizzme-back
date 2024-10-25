const express = require('express');
const formControllers = require('../controllers/form.js');

const formRoutes = express.Router();

formRoutes.post('/form/create', formControllers.createForm);
formRoutes.get('/form/template/:templateId', formControllers.getFormsByTemplate);
formRoutes.post('/form/user', formControllers.getFormsByUser);
formRoutes.get('/form/:id', formControllers.getFormById);
formRoutes.get('/forms', formControllers.getAllForms);
formRoutes.put('/form-put/:id', formControllers.updateForm);
formRoutes.delete('/form-destroy/:id', formControllers.deleteForm);

module.exports = formRoutes;