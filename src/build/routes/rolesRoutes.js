"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolesController_1 = require("../controllers/rolesController");
class RolesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', rolesController_1.rolesController.create);
        this.router.put('/update/:id', rolesController_1.rolesController.update);
        this.router.delete('/delete/:id', rolesController_1.rolesController.delete);
        this.router.get('/', rolesController_1.rolesController.list);
        this.router.get('/:id', rolesController_1.rolesController.listOne);
    }
}
const rolesRoutes = new RolesRoutes();
exports.default = rolesRoutes.router;
