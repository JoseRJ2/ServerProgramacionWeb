"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estadosController_1 = require("../controllers/estadosController");
class EstadosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', estadosController_1.estadosController.create);
        this.router.put('/update/:id', estadosController_1.estadosController.update);
        this.router.delete('/delete/:id', estadosController_1.estadosController.delete);
        this.router.get('/', estadosController_1.estadosController.list);
        this.router.get('/:id', estadosController_1.estadosController.listOne);
    }
}
const estadosRoutes = new EstadosRoutes();
exports.default = estadosRoutes.router;
