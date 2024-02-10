import {Request,Response} from 'express';
import pool from '../database';

class UsuariosController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query('SELECT usuarios.id, usuarios.nombre, roles.nombreRol as Rol, usuarios.usuario, usuarios.contrasena, usuarios.telefono   FROM usuarios, roles WHERE roles.id = usuarios.idRol');
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
    const {id} = req.params;
    const respuesta = await pool.query('SELECT usuarios.id, usuarios.nombre, roles.nombreRol as Rol, usuarios.usuario, usuarios.contrasena, usuarios.telefono   FROM usuarios, roles WHERE roles.id = usuarios.idRol AND usuarios.id = ?', [id]);
    if(respuesta.length>0){
    res.json(respuesta[0]);
    return ;
    }
    res.status(404).json({'mensaje': 'Usuario no encontrado'});
}

public async create(req: Request, res: Response): Promise<void> {
    const consulta1= `SELECT roles.id as IdRol FROM roles WHERE roles.nombreRol = '${req.body.Rol}'`;
    const respuesta = await pool.query(consulta1);
    if(respuesta.length>0){
        const resp = await pool.query(`INSERT INTO usuarios (usuarios.id, usuarios.nombre, usuarios.idRol, usuarios.usuario, usuarios.contrasena, usuarios.telefono) VALUES (NULL, '${req.body.nombre}',${respuesta[0].IdRol} , '${req.body.usuario}', '${req.body.contrasena}', '${req.body.telefono}')`);
        res.json(resp);
    }else{
        res.json({"mensaje":"Rol no encontrado"});
    }
   
}

public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const consultaRol= `SELECT roles.id as IdRol FROM roles WHERE roles.nombreRol = '${req.body.Rol}'`;
    const respRol= await pool.query(consultaRol);
    if(respRol.length>0){
        const resp = await pool.query(`UPDATE usuarios SET usuarios.nombre = '${req.body.nombre}', usuarios.idRol = ${respRol[0].IdRol}, usuarios.usuario = '${req.body.usuario}', usuarios.contrasena = '${req.body.contrasena}', usuarios.telefono = '${req.body.telefono}' WHERE usuarios.id = ${id}`);
        res.json(resp);
    }else{
        res.json({"mensaje":"Rol no encontrado"});
    }
}

public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const resp = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`);
    res.json(resp);
}

public async ValidarU(req: Request, res: Response ): Promise<void>{
    const parametros=req.body;
    const consulta =`SELECT idRol FROM usuarios WHERE usuario ='${parametros.usuario}'and contrasena = '${parametros.contrasena}'`;
    const resp= await pool.query(consulta);
    if(resp.length > 0){
        res.json(resp);
    }else{
        res.json({"idRol":"-1"});
    }
}

}

export const usuariosController = new UsuariosController();