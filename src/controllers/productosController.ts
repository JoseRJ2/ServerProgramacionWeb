import {Request,Response} from 'express';
import pool from '../database';

class ProductosController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query('SELECT productos.id, productos.nombre, productos.modelo, tallas.talla as Talla, productos.color, productos.precio, productos.cantidad FROM productos, tallas WHERE tallas.id = productos.idTalla');
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
    const {id} = req.params;
    const respuesta = await pool.query('SELECT productos.id, productos.nombre, productos.modelo, tallas.talla as Talla, productos.color, productos.precio, productos.cantidad FROM productos, tallas WHERE tallas.id = productos.idTalla AND productos.id = ?', [id]);
    if(respuesta.length>0){
        res.json(respuesta[0]);
        return ;
    }
    res.status(404).json({'mensaje': 'producto no encontrado'});
}

public async create(req: Request, res: Response): Promise<void> {
    const consultaTalla = `SELECT tallas.id as IdTalla FROM tallas WHERE tallas.talla = '${req.body.Talla}'`;
    const respuesta = await pool.query(consultaTalla);
    if(respuesta.length > 0){   
        const resp = await pool.query(`INSERT INTO productos (productos.id, productos.nombre, productos.modelo, productos.idTalla, productos.color, productos.precio, productos.cantidad) VALUES (NULL, '${req.body.nombre}', '${req.body.modelo}', ${respuesta[0].IdTalla}, '${req.body.color}', ${req.body.precio}, ${req.body.cantidad})`);
        res.json(resp);
    }else{
        res.status(404).json({'mensaje': 'Talla invalida'});
    
    }
}

public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const consultaTalla = `SELECT tallas.id as IdTalla FROM tallas WHERE tallas.talla = '${req.body.Talla}'`;
    console.log(req.body.Talla)
    const respuesta = await pool.query(consultaTalla);
    if(respuesta.length > 0){
        const resp = await pool.query(`UPDATE productos SET productos.nombre = '${req.body.nombre}', productos.modelo = '${req.body.modelo}', productos.idTalla = ${respuesta[0].IdTalla}, productos.color = '${req.body.color}', productos.precio = ${req.body.precio}, productos.cantidad = ${req.body.cantidad} WHERE productos.id = ${id}`);
        res.json(resp);
    }else{
        res.status(404).json({'mensaje': 'Talla invalida'});
    } 
}

public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const resp = await pool.query(`DELETE FROM productos WHERE id = ${id}`);
    res.json(resp);
}

}

export const productosController = new ProductosController();