const express = require('express');
const templateControllers = require('../controllers/template.js');

const templateRoutes = express.Router();

templateRoutes.post('/template/create', templateControllers.createTemplate);
templateRoutes.get('/template/all', templateControllers.getTemplates);
templateRoutes.get('/template/user', templateControllers.getTemplatesByUser);
templateRoutes.get('/template/:id', templateControllers.getTemplateById);
templateRoutes.put('/template-put/:id', templateControllers.updateTemplate);
templateRoutes.delete('/template-destroy/:id', templateControllers.deleteTemplate);
templateRoutes.get('/template/:templateId/statistics', templateControllers.getTemplateStatistics);

module.exports = templateRoutes;