"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carritosProductosController_1 = require("../controllers/carritosProductosController");
class CarritosProductosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', carritosProductosController_1.carritosProductosController.create);
        this.router.get('/', carritosProductosController_1.carritosProductosController.list);
    }
}
const carritosProductosRoutes = new CarritosProductosRoutes();
exports.default = carritosProductosRoutes.router;
