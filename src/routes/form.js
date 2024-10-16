import express from "express";
import * as formControllers from "../controllers/form.js";

const formRoutes = express.Router();

formRoutes.post("/form/create", formControllers.createForm);
formRoutes.get("/form/template/:templateId", formControllers.getFormsByTemplate);
formRoutes.get("/form/user", formControllers.getFormsByUser);
formRoutes.get("/form/:id", formControllers.getFormById);
formRoutes.put("/form-put/:id", formControllers.updateForm);
formRoutes.delete("/form-destroy/:id", formControllers.deleteForm);

export default formRoutes;
