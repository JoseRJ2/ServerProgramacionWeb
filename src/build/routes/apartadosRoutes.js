"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apartadosController_1 = require("../controllers/apartadosController");
class ApartadosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', apartadosController_1.apartadosController.create);
        this.router.put('/update/:id', apartadosController_1.apartadosController.update);
        this.router.delete('/delete/:id', apartadosController_1.apartadosController.delete);
        this.router.get('/', apartadosController_1.apartadosController.list);
        this.router.get('/:id', apartadosController_1.apartadosController.listOne);
    }
}
const apartadosRoutes = new ApartadosRoutes();
exports.default = apartadosRoutes.router;
