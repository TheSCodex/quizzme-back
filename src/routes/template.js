import express from "express";
import * as templateControllers from "../controllers/template.js";

const templateRoutes = express.Router();

templateRoutes.post("/template/create", templateControllers.createTemplate);
templateRoutes.get("/template/user", templateControllers.getTemplatesByUser);
templateRoutes.get("/template/:id", templateControllers.getTemplateById);
templateRoutes.put("/template-put/:id", templateControllers.updateTemplate);
templateRoutes.delete("/template-destroy/:id", templateControllers.deleteTemplate);
templateRoutes.get("/template/:templateId/statistics", templateControllers.getTemplateStatistics);

export default templateRoutes;
