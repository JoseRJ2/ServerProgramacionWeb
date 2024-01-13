import {Request,Response} from 'express';
import pool from '../database';

class EstadosController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query('SELECT * FROM estados');
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
const {id} = req.params;
const respuesta = await pool.query('SELECT * FROM estados WHERE id = ?', [id]);
if(respuesta.length>0){
res.json(respuesta[0]);
return ;
}
res.status(404).json({'mensaje': 'Estado no encontrado'});
}

public async create(req: Request, res: Response): Promise<void> {
    console.log(req.body)
    const resp = await pool.query("INSERT INTO estados set ?",[req.body]);
    res.json(resp);
}

public async update(req: Request, res: Response): Promise<void> {
const { id } = req.params;
//console.log(req.params);
console.log(id);
const resp = await pool.query("UPDATE estados set ? WHERE id = ?", [req.body, id]);
res.json(resp);
}

public async delete(req: Request, res: Response): Promise<void> {
const { id } = req.params;
const resp = await pool.query(`DELETE FROM estados WHERE id = ${id}`);
res.json(resp);
}

public async ValidarU(req: Request, res: Response ): Promise<void>{
    const parametros=req.body;
    const consulta =`SELECT rol FROM estados WHERE correo ='${parametros.correo}'and contrasena = '${parametros.contrasena}'`;
    const resp= await pool.query(consulta);
    if(resp.length > 0){
        res.json(resp);
    }else{
        res.json({"rol":"-1"});
    }
}

}

export const estadosController = new EstadosController();