"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventasController_1 = require("../controllers/ventasController");
class VentasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', ventasController_1.ventasController.create);
        this.router.put('/update/:id', ventasController_1.ventasController.update);
        this.router.delete('/delete/:id', ventasController_1.ventasController.delete);
        this.router.get('/', ventasController_1.ventasController.list);
        this.router.get('/:id', ventasController_1.ventasController.listOne);
        this.router.post('/listarventasfecha', ventasController_1.ventasController.listarventasfecha);
    }
}
const ventasRoutes = new VentasRoutes();
exports.default = ventasRoutes.router;
