"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pagarCarritosController_1 = require("../controllers/pagarCarritosController");
class PagarCarritosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', pagarCarritosController_1.pagarCarritosController.create);
        this.router.put('/update/:id', pagarCarritosController_1.pagarCarritosController.update);
        this.router.delete('/delete/:id', pagarCarritosController_1.pagarCarritosController.delete);
        this.router.get('/', pagarCarritosController_1.pagarCarritosController.list);
        this.router.get('/:id', pagarCarritosController_1.pagarCarritosController.listOne);
    }
}
const pagarCarritosRoutes = new PagarCarritosRoutes();
exports.default = pagarCarritosRoutes.router;
