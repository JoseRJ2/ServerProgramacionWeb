import {Request,Response} from 'express';
import pool from '../database';

class TallasController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query('SELECT * FROM tallas');
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
const {id} = req.params;
const respuesta = await pool.query('SELECT * FROM tallas WHERE id = ?', [id]);
if(respuesta.length>0){
res.json(respuesta[0]);
return ;
}
res.status(404).json({'mensaje': 'talla no encontrada'});
}

public async create(req: Request, res: Response): Promise<void> {
    console.log(req.body)
    const resp = await pool.query("INSERT INTO tallas set ?",[req.body]);
    res.json(resp);
}

public async update(req: Request, res: Response): Promise<void> {
const { id } = req.params;
//console.log(req.params);
console.log(id);
const resp = await pool.query("UPDATE tallas set ? WHERE id = ?", [req.body, id]);
res.json(resp);
}

public async delete(req: Request, res: Response): Promise<void> {
const { id } = req.params;
const resp = await pool.query(`DELETE FROM tallas WHERE id = ${id}`);
res.json(resp);
}

}

export const tallasController = new TallasController();