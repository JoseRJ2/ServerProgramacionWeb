"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carritosProductosController = void 0;
const database_1 = __importDefault(require("../database"));
class CarritosProductosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM carritos_productos');
            res.json(respuesta);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parametros = req.body;
            const consulta1 = `SElECT * FROM carritos WHERE id='${parametros.idCarrito}'`;
            const consulta2 = `SElECT * FROM productos WHERE id='${parametros.idProducto}'`;
            const consulta3 = `SElECT cantidad FROM productos WHERE id='${parametros.idProducto}'`;
            const resp1 = yield database_1.default.query(consulta1);
            const resp2 = yield database_1.default.query(consulta2);
            const res3 = yield database_1.default.query(consulta3);
            if (resp1.length > 0) {
                if (resp2.length > 0) {
                    if (res3[0].cantidad >= parametros.cantidad) {
                        const cantidadNueva = res3[0].cantidad - parametros.cantidad;
                        const respu1 = yield database_1.default.query('INSERT INTO carritos_productos set ?', [req.body]);
                        const respu2 = yield database_1.default.query('UPDATE productos SET cantidad = ? WHERE id = ?', [cantidadNueva, parametros.idProducto]);
                        res.json(respu1);
                        res.json(respu2);
                    }
                    else {
                        console.log("No hay suficientes productos");
                    }
                }
                else {
                    console.log("No existe el producto");
                }
            }
            else {
                console.log("No existe el carrito");
            }
        });
    }
}
exports.carritosProductosController = new CarritosProductosController();
