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
exports.usuariosController = void 0;
const database_1 = __importDefault(require("../database"));
class UsuariosController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT usuarios.id, usuarios.nombre, roles.nombreRol as Rol, usuarios.usuario, usuarios.contrasena, usuarios.telefono   FROM usuarios, roles WHERE roles.id = usuarios.idRol');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT usuarios.id, usuarios.nombre, roles.nombreRol as Rol, usuarios.usuario, usuarios.contrasena, usuarios.telefono   FROM usuarios, roles WHERE roles.id = usuarios.idRol AND usuarios.id = ?', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Usuario no encontrado' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const consulta1 = `SELECT roles.id as IdRol FROM roles WHERE roles.nombreRol = '${req.body.Rol}'`;
            const respuesta = yield database_1.default.query(consulta1);
            if (respuesta.length > 0) {
                const resp = yield database_1.default.query(`INSERT INTO usuarios (usuarios.id, usuarios.nombre, usuarios.idRol, usuarios.usuario, usuarios.contrasena, usuarios.telefono) VALUES (NULL, '${req.body.nombre}',${respuesta[0].IdRol} , '${req.body.usuario}', '${req.body.contrasena}', '${req.body.telefono}')`);
                res.json(resp);
            }
            else {
                res.json({ "mensaje": "Rol no encontrado" });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const consultaRol = `SELECT roles.id as IdRol FROM roles WHERE roles.nombreRol = '${req.body.Rol}'`;
            const respRol = yield database_1.default.query(consultaRol);
            if (respRol.length > 0) {
                const resp = yield database_1.default.query(`UPDATE usuarios SET usuarios.nombre = '${req.body.nombre}', usuarios.idRol = ${respRol[0].IdRol}, usuarios.usuario = '${req.body.usuario}', usuarios.contrasena = '${req.body.contrasena}', usuarios.telefono = '${req.body.telefono}' WHERE usuarios.id = ${id}`);
                res.json(resp);
            }
            else {
                res.json({ "mensaje": "Rol no encontrado" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM usuarios WHERE id = ${id}`);
            res.json(resp);
        });
    }
    ValidarU(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const parametros = req.body;
            const consulta = `SELECT idRol FROM usuarios WHERE usuario ='${parametros.usuario}'and contrasena = '${parametros.contrasena}'`;
            const resp = yield database_1.default.query(consulta);
            if (resp.length > 0) {
                res.json(resp);
            }
            else {
                res.json({ "idRol": "-1" });
            }
        });
    }
}
exports.usuariosController = new UsuariosController();
