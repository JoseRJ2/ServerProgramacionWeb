import {Request,Response} from 'express';
import pool from '../database';

class VentasController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query('SELECT * FROM ventas');
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
const {id} = req.params;
const respuesta = await pool.query('SELECT * FROM ventas WHERE id = ?', [id]);
if(respuesta.length>0){
res.json(respuesta[0]);
return ;
}
res.status(404).json({'mensaje': 'venta no encontrada'});
}

public async create(req: Request, res: Response): Promise<void> {
    console.log(req.body)
    const resp = await pool.query("INSERT INTO ventas set ?",[req.body]);
    res.json(resp);
}

public async update(req: Request, res: Response): Promise<void> {
const { id } = req.params;
//console.log(req.params);
console.log(id);
const resp = await pool.query("UPDATE ventas set ? WHERE id = ?", [req.body, id]);
res.json(resp);
}

public async delete(req: Request, res: Response): Promise<void> {
const { id } = req.params;
const resp = await pool.query(`DELETE FROM ventas WHERE id = ${id}`);
res.json(resp);
}

public async listarventasfecha(req: Request, res: Response): Promise<void> {
    const listaVentas= await pool.query(`SELECT ventas.id as IDventa,ventas.idPagoCarrito,ventas.idCliente,ventas.idUsuario,pagarcarritos.idCarrito,pagarcarritos.total,ventas.fecha 
    FROM ventas,pagarcarritos
    WHERE ventas.fecha='${req.body.fecha}' and ventas.idPagoCarrito=pagarcarritos.id`);
    if(listaVentas.length>0){
        res.json(listaVentas);
        return ;
    }else{
        console.log("no hay ventas en esa fecha");
    }
}   

}

export const ventasController = new VentasController();