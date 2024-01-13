"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tallasController_1 = require("../controllers/tallasController");
class TallasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', tallasController_1.tallasController.create);
        this.router.put('/update/:id', tallasController_1.tallasController.update);
        this.router.delete('/delete/:id', tallasController_1.tallasController.delete);
        this.router.get('/', tallasController_1.tallasController.list);
        this.router.get('/:id', tallasController_1.tallasController.listOne);
    }
}
const tallasRoutes = new TallasRoutes();
exports.default = tallasRoutes.router;
