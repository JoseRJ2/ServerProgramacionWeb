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
exports.productosController = void 0;
const database_1 = __importDefault(require("../database"));
class ProductosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT productos.id, productos.nombre, productos.modelo, tallas.talla as Talla, productos.color, productos.precio, productos.cantidad FROM productos, tallas WHERE tallas.id = productos.idTalla');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT productos.id, productos.nombre, productos.modelo, tallas.talla as Talla, productos.color, productos.precio, productos.cantidad FROM productos, tallas WHERE tallas.id = productos.idTalla AND productos.id = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'producto no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const consultaTalla = `SELECT tallas.id as IdTalla FROM tallas WHERE tallas.talla = '${req.body.Talla}'`;
            const respuesta = yield database_1.default.query(consultaTalla);
            if (respuesta.length > 0) {
                const resp = yield database_1.default.query(`INSERT INTO productos (productos.id, productos.nombre, productos.modelo, productos.idTalla, productos.color, productos.precio, productos.cantidad) VALUES (NULL, '${req.body.nombre}', '${req.body.modelo}', ${respuesta[0].IdTalla}, '${req.body.color}', ${req.body.precio}, ${req.body.cantidad})`);
                res.json(resp);
            }
            else {
                res.status(404).json({ 'mensaje': 'Talla invalida' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const consultaTalla = `SELECT tallas.id as IdTalla FROM tallas WHERE tallas.talla = '${req.body.Talla}'`;
            console.log(req.body.Talla);
            const respuesta = yield database_1.default.query(consultaTalla);
            if (respuesta.length > 0) {
                const resp = yield database_1.default.query(`UPDATE productos SET productos.nombre = '${req.body.nombre}', productos.modelo = '${req.body.modelo}', productos.idTalla = ${respuesta[0].IdTalla}, productos.color = '${req.body.color}', productos.precio = ${req.body.precio}, productos.cantidad = ${req.body.cantidad} WHERE productos.id = ${id}`);
                res.json(resp);
            }
            else {
                res.status(404).json({ 'mensaje': 'Talla invalida' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM productos WHERE id = ${id}`);
            res.json(resp);
        });
    }
}
exports.productosController = new ProductosController();
