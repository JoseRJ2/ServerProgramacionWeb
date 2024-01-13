"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carritosController_1 = require("../controllers/carritosController");
class CarritosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', carritosController_1.carritosController.create);
        this.router.post('/agregar', carritosController_1.carritosController.agregar);
        this.router.put('/update/:id', carritosController_1.carritosController.update);
        this.router.delete('/delete/:id', carritosController_1.carritosController.delete);
        this.router.get('/', carritosController_1.carritosController.list);
        this.router.get('/:id', carritosController_1.carritosController.listOne);
        this.router.post('/pagarcarrito', carritosController_1.carritosController.pagarcarrito);
        this.router.post('/cancelarcarrito', carritosController_1.carritosController.cancelarcarrito);
        this.router.get('/listarcarrito/:id', carritosController_1.carritosController.listcarrito);
    }
}
const carritosRoutes = new CarritosRoutes();
exports.default = carritosRoutes.router;
