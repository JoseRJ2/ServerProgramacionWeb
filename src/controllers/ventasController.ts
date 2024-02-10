import {Request,Response} from 'express';
import pool from '../database';

class VentasController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query('SELECT ventas.id, ventas.idPagoCarrito, clientes.nombre as Cliente, usuarios.nombre as Usuario, ventas.fecha, pagarcarritos.total as total  FROM ventas,clientes,usuarios,pagarcarritos WHERE clientes.id = ventas.idCliente AND usuarios.id = ventas.idUsuario AND pagarcarritos.id = ventas.idPagoCarrito');
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
    const {id} = req.params;
    const respuesta = await pool.query('SELECT ventas.id, ventas.idPagoCarrito, clientes.nombre as Cliente, usuarios.nombre as Usuario, ventas.fecha, pagarcarritos.total as total  FROM ventas,clientes,usuarios,pagarcarritos WHERE clientes.id = ventas.idCliente AND usuarios.id = ventas.idUsuario AND pagarcarritos.id = ventas.idPagoCarrito  AND ventas.id = ?', [id]);
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
    const consultaIdUsuario = `SELECT usuarios.id as idUsuario FROM usuarios WHERE usuarios.nombre = '${req.body.Usuario}'`;
    const resp1 = await pool.query(consultaIdUsuario);
    const conusltaIdCliente = `SELECT clientes.id as idCliente FROM clientes WHERE clientes.nombre = '${req.body.Cliente}'`;
    const resp2 = await pool.query(conusltaIdCliente);
    if (resp1.length == 0 || resp2.length == 0){
        res.status(404).json({'mensaje': 'Usuario o Cliente no encontrado'});
        return;
    }else{
        const resp = await pool.query(`UPDATE ventas SET ventas.idPagoCarrito = ${req.body.idPagoCarrito}, ventas.idCliente = ${resp2[0].idCliente}, ventas.idUsuario = ${resp1[0].idUsuario}, ventas.fecha = "${req.body.fecha}" WHERE ventas.id = ${id}`);
        res.json(resp);
    }

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