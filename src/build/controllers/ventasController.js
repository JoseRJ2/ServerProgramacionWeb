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
exports.ventasController = void 0;
const database_1 = __importDefault(require("../database"));
class VentasController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT ventas.id, ventas.idPagoCarrito, clientes.nombre as Cliente, usuarios.nombre as Usuario, ventas.fecha, pagarcarritos.total as total  FROM ventas,clientes,usuarios,pagarcarritos WHERE clientes.id = ventas.idCliente AND usuarios.id = ventas.idUsuario AND pagarcarritos.id = ventas.idPagoCarrito');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT ventas.id, ventas.idPagoCarrito, clientes.nombre as Cliente, usuarios.nombre as Usuario, ventas.fecha, pagarcarritos.total as total  FROM ventas,clientes,usuarios,pagarcarritos WHERE clientes.id = ventas.idCliente AND usuarios.id = ventas.idUsuario AND pagarcarritos.id = ventas.idPagoCarrito  AND ventas.id = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'venta no encontrada' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const resp = yield database_1.default.query("INSERT INTO ventas set ?", [req.body]);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const consultaIdUsuario = `SELECT usuarios.id as idUsuario FROM usuarios WHERE usuarios.nombre = '${req.body.Usuario}'`;
            const resp1 = yield database_1.default.query(consultaIdUsuario);
            const conusltaIdCliente = `SELECT clientes.id as idCliente FROM clientes WHERE clientes.nombre = '${req.body.Cliente}'`;
            const resp2 = yield database_1.default.query(conusltaIdCliente);
            if (resp1.length == 0 || resp2.length == 0) {
                res.status(404).json({ 'mensaje': 'Usuario o Cliente no encontrado' });
                return;
            }
            else {
                const resp = yield database_1.default.query(`UPDATE ventas SET ventas.idPagoCarrito = ${req.body.idPagoCarrito}, ventas.idCliente = ${resp2[0].idCliente}, ventas.idUsuario = ${resp1[0].idUsuario}, ventas.fecha = "${req.body.fecha}" WHERE ventas.id = ${id}`);
                res.json(resp);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM ventas WHERE id = ${id}`);
            res.json(resp);
        });
    }
    listarventasfecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const listaVentas = yield database_1.default.query(`SELECT ventas.id as IDventa,ventas.idPagoCarrito,ventas.idCliente,ventas.idUsuario,pagarcarritos.idCarrito,pagarcarritos.total,ventas.fecha 
    FROM ventas,pagarcarritos
    WHERE ventas.fecha='${req.body.fecha}' and ventas.idPagoCarrito=pagarcarritos.id`);
            if (listaVentas.length > 0) {
                res.json(listaVentas);
                return;
            }
            else {
                console.log("no hay ventas en esa fecha");
            }
        });
    }
}
exports.ventasController = new VentasController();
