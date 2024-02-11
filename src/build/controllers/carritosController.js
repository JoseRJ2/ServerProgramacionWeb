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
exports.carritosController = void 0;
const database_1 = __importDefault(require("../database"));
class CarritosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query(`SELECT carritos.id, usuarios.nombre as Usuario, clientes.nombre as Cliente, carritos.fechaLimite, estados.estado as estado FROM carritos, usuarios, estados, clientes WHERE usuarios.id = carritos.idUsuario AND clientes.id = carritos.idCliente AND estados.id = carritos.estado`);
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT carritos.id, usuarios.nombre as Usuario, clientes.nombre as Cliente, carritos.fechaLimite, estados.estado as estado FROM carritos, usuarios, estados, clientes WHERE usuarios.id = carritos.idUsuario AND clientes.id = carritos.idCliente AND estados.id = carritos.estado AND carritos.id = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'carrito no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ConsultaUsuario = yield database_1.default.query(`SELECT usuarios.id as Usuario FROM usuarios WHERE usuarios.nombre = '${req.body.Usuario}'`);
            const ConsultaCliente = yield database_1.default.query(`SELECT clientes.id as Cliente FROM clientes WHERE clientes.nombre = '${req.body.Cliente}'`);
            const resp = yield database_1.default.query(`INSERT INTO carritos (idUsuario, idCliente, fechaLimite, estado) VALUES ('${ConsultaUsuario[0].Usuario}', '${ConsultaCliente[0].Cliente}', '${req.body.fechaLimite}', ${6})`);
            res.json(resp);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            //console.log(req.params);
            console.log(id);
            const resp = yield database_1.default.query("UPDATE carritos set ? WHERE id = ?", [req.body, id]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM carritos WHERE id = ${id}`);
            res.json(resp);
        });
    }
    agregar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parametros = req.body;
            console.log(req.body.Producto);
            const consultaIdProducto = yield database_1.default.query(`SELECT productos.id as IdProducto FROM productos WHERE productos.nombre = '${req.body.Producto}'`);
            const consulta1 = `SElECT * FROM carritos WHERE id='${parametros.idCarrito}'`;
            const consulta2 = `SElECT * FROM productos WHERE id='${consultaIdProducto[0].IdProducto}'`;
            const consulta3 = `SElECT cantidad FROM productos WHERE id='${consultaIdProducto[0].IdProducto}'`;
            const resp1 = yield database_1.default.query(consulta1);
            const resp2 = yield database_1.default.query(consulta2);
            const res3 = yield database_1.default.query(consulta3);
            if (resp1.length > 0) {
                if (resp2.length > 0) {
                    if (res3[0].cantidad >= parametros.cantidad) {
                        const cantidadNueva = res3[0].cantidad - parametros.cantidad;
                        const respu1 = yield database_1.default.query(`INSERT INTO carritos_productos (idCarrito, idProducto, cantidad) VALUES (${req.body.idCarrito}, ${consultaIdProducto[0].IdProducto}, ${req.body.cantidad});`);
                        const respu2 = yield database_1.default.query('UPDATE productos SET cantidad = ? WHERE id = ?', [cantidadNueva, consultaIdProducto[0].IdProducto]);
                        const combinedResponse = {
                            respuesta1: respu1,
                            respuesta2: respu2
                        };
                        res.json(combinedResponse);
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
    //funcion para pagar el carrito y realiza diferentes validaciones
    pagarcarrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("pagarcarrito");
            const parametros = req.body;
            const consulta1 = `SELECT * FROM carritos WHERE id='${parametros.idCarrito}'`;
            const estadoCarrito = yield database_1.default.query(`SELECT carritos.estado as estadoCarrito FROM carritos WHERE carritos.id=${parametros.idCarrito}`);
            const consultaPrecio = `SELECT sum(carritos_productos.cantidad*precio) as SUMA from carritos_productos,productos where carritos_productos.idCarrito='${parametros.idCarrito}' and carritos_productos.idProducto=productos.id`;
            const resp1 = yield database_1.default.query(consulta1);
            const respMonto = yield database_1.default.query(consultaPrecio);
            let total = respMonto[0].SUMA - ((respMonto[0].SUMA) * ((parametros.descuento) / 100));
            if (resp1.length > 0) {
                if (estadoCarrito[0].estadoCarrito == 6) {
                    const respu1 = yield database_1.default.query(`INSERT INTO pagarcarritos (idCarrito, descuento, total, fecha) VALUES ('${parametros.idCarrito}', '${parametros.descuento}', '${total}', '${req.body.fecha}')`);
                    const respu2 = yield database_1.default.query(`UPDATE carritos SET estado = 5 WHERE carritos.id = ${req.body.idCarrito}`);
                    const consultaUsuario = yield database_1.default.query(`SELECT DISTINCT carritos.idUsuario as IDusuario FROM carritos,pagarcarritos where pagarcarritos.idCarrito=${parametros.idCarrito} and pagarcarritos.id='${respu1.insertId}'`);
                    const consultaCliente = yield database_1.default.query(`SELECT DISTINCT carritos.idCliente as IDcliente FROM carritos,pagarcarritos where pagarcarritos.idCarrito=${parametros.idCarrito} and pagarcarritos.id='${respu1.insertId}'`);
                    const respu3 = yield database_1.default.query(`INSERT INTO ventas (idPagoCarrito, idCliente, idUsuario, fecha) VALUES (${respu1.insertId}, ${consultaCliente[0].IDcliente}, ${consultaUsuario[0].IDusuario}, '${req.body.fecha}')`);
                    const combinedResponse = {
                        respuesta1: respu1,
                        respuesta2: respu2,
                        respuesta3: respu3
                    };
                    res.json(combinedResponse);
                }
                else if (estadoCarrito[0].estadoCarrito == 7) {
                    console.log("El carrito fue cancelado");
                }
                else {
                    console.log("El carrito ya fue pagado");
                }
            }
            else {
                console.log("carrito no encontrado");
            }
        });
    }
    //aqui va a ir cancelar carrito
    cancelarcarrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let i = 0;
            let respu2;
            const productosDevolver = yield database_1.default.query(`SELECT carritos_productos.idProducto as Productos,carritos_productos.cantidad as Cantidad FROM carritos_productos WHERE carritos_productos.idCarrito=${req.body.id}`);
            const consultaCarrito = yield database_1.default.query(`SELECT * FROM carritos WHERE id=${req.body.id}`);
            if (consultaCarrito.length > 0) {
                const estadoCarrito = yield database_1.default.query(`SELECT carritos.estado as estadoCarrito FROM carritos WHERE carritos.id=${req.body.id}`);
                if (estadoCarrito[0].estadoCarrito == 6) {
                    const respu1 = yield database_1.default.query(`UPDATE carritos SET estado = 7 WHERE carritos.id = ${req.body.id}`);
                    console.log(productosDevolver);
                    for (const producto of productosDevolver) {
                        const consultaCantidad = yield database_1.default.query(`SELECT cantidad FROM productos WHERE id=${producto.Productos}`);
                        const cantidadNueva = consultaCantidad[0].cantidad + producto.Cantidad;
                        respu2 = yield database_1.default.query(`UPDATE productos SET cantidad = ${cantidadNueva} WHERE id = ${producto.Productos}`);
                    }
                    const combinedResponse = {
                        respuesta1: respu1,
                        respuesta2: respu2
                    };
                    res.json(combinedResponse);
                }
                else if (estadoCarrito[0].estadoCarrito == 7) {
                    console.log("El carrito ya fue cancelado");
                }
                else if (estadoCarrito[0].estadoCarrito == 5) {
                    console.log("El carrito ya fue pagado");
                }
            }
            else {
                console.log("carrito no encontrado");
            }
        });
    }
    //aqui listamos los productos de un carrito
    listcarrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listadoCarrito = yield database_1.default.query(`
            SELECT carritos.id, estados.estado, productos.nombre,productos.modelo,carritos_productos.cantidad, productos.precio
            FROM carritos_productos, productos, carritos, estados
            WHERE carritos.id = carritos_productos.idCarrito
                AND carritos.id = ?
                AND productos.id = carritos_productos.idProducto
                AND carritos.estado = estados.id;
        `, [req.params.id]);
                res.json(listadoCarrito);
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
}
exports.carritosController = new CarritosController();
