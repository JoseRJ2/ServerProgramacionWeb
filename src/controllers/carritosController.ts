import {Request,Response} from 'express';
import pool from '../database';

class CarritosController{
public async list(req: Request, res: Response ): Promise<void>{
    const respuesta = await pool.query(`SELECT carritos.id, usuarios.nombre as Usuario, clientes.nombre as Cliente, carritos.fechaLimite, estados.estado as estado FROM carritos, usuarios, estados, clientes WHERE usuarios.id = carritos.idUsuario AND clientes.id = carritos.idCliente AND estados.id = carritos.estado`);
    res.json( respuesta );
}

public async listOne(req: Request, res: Response): Promise <void>{
const {id} = req.params;
const respuesta = await pool.query('SELECT carritos.id, usuarios.nombre as Usuario, clientes.nombre as Cliente, carritos.fechaLimite, estados.estado as estado FROM carritos, usuarios, estados, clientes WHERE usuarios.id = carritos.idUsuario AND clientes.id = carritos.idCliente AND estados.id = carritos.estado AND carritos.id = ?', [id]);
if(respuesta.length>0){
res.json(respuesta[0]);
return ;
}
res.status(404).json({'mensaje': 'carrito no encontrado'});
}

public async create(req: Request, res: Response): Promise<void> {
    const ConsultaUsuario = await pool.query(`SELECT usuarios.id as Usuario FROM usuarios WHERE usuarios.nombre = '${req.body.Usuario}'`);
    const ConsultaCliente = await pool.query(`SELECT clientes.id as Cliente FROM clientes WHERE clientes.nombre = '${req.body.Cliente}'`);
    const resp = await pool.query(`INSERT INTO carritos (idUsuario, idCliente, fechaLimite, estado) VALUES ('${ConsultaUsuario[0].Usuario}', '${ConsultaCliente[0].Cliente}', '${req.body.fechaLimite}', ${6})`);
    res.json(resp);
}

public async update(req: Request, res: Response): Promise<void> {
const { id } = req.params;
//console.log(req.params);
console.log(id);
const resp = await pool.query("UPDATE carritos set ? WHERE id = ?", [req.body, id]);
res.json(resp);
}

public async delete(req: Request, res: Response): Promise<void> {
const { id } = req.params;
const resp = await pool.query(`DELETE FROM carritos WHERE id = ${id}`);
res.json(resp);
}


public async agregar(req: Request, res: Response): Promise<void> {
    const parametros = req.body;
    console.log(req.body.Producto)
    const consultaIdProducto = await pool.query(`SELECT productos.id as IdProducto FROM productos WHERE productos.nombre = '${req.body.Producto}'`)
    const consulta1=`SElECT * FROM carritos WHERE id='${parametros.idCarrito}'`;
    const consulta2=`SElECT * FROM productos WHERE id='${consultaIdProducto[0].IdProducto}'`;
    const consulta3=`SElECT cantidad FROM productos WHERE id='${consultaIdProducto[0].IdProducto}'`;
    const resp1= await pool.query(consulta1);
    const resp2= await pool.query(consulta2);
    const res3= await pool.query(consulta3);
    if(resp1.length > 0){
        if(resp2.length > 0){
            if(res3[0].cantidad >= parametros.cantidad){
                const cantidadNueva=res3[0].cantidad-parametros.cantidad;
                const respu1 = await pool.query(`INSERT INTO carritos_productos (idCarrito, idProducto, cantidad) VALUES (${req.body.idCarrito}, ${consultaIdProducto[0].IdProducto}, ${req.body.cantidad});`);
                const respu2 = await pool.query('UPDATE productos SET cantidad = ? WHERE id = ?', [cantidadNueva,consultaIdProducto[0].IdProducto]) 
                const combinedResponse = {
                    respuesta1: respu1,
                    respuesta2: respu2
                };
                res.json(combinedResponse);

            }else{
                console.log("No hay suficientes productos")
            }  
        }else{
            console.log("No existe el producto")
        }
    }else{
        console.log("No existe el carrito")
    }
}

//funcion para pagar el carrito y realiza diferentes validaciones
public async pagarcarrito(req: Request, res: Response): Promise<void> {
    console.log("pagarcarrito");
    const parametros = req.body;
    const consulta1= `SELECT * FROM carritos WHERE id='${parametros.idCarrito}'`;
    const estadoCarrito= await pool.query(`SELECT carritos.estado as estadoCarrito FROM carritos WHERE carritos.id=${parametros.idCarrito}`);
    const consultaPrecio= `SELECT sum(carritos_productos.cantidad*precio) as SUMA from carritos_productos,productos where carritos_productos.idCarrito='${parametros.idCarrito}' and carritos_productos.idProducto=productos.id`;
    const resp1= await pool.query(consulta1);
    const respMonto= await pool.query(consultaPrecio);
    let total:number=respMonto[0].SUMA-((respMonto[0].SUMA)*((parametros.descuento)/100));
    if(resp1.length > 0){
        if(estadoCarrito[0].estadoCarrito==6){
            const respu1 = await pool.query(`INSERT INTO pagarcarritos (idCarrito, descuento, total, fecha) VALUES ('${parametros.idCarrito}', '${parametros.descuento}', '${total}', '${req.body.fecha}')`);
            const respu2 = await pool.query(`UPDATE carritos SET estado = 5 WHERE carritos.id = ${req.body.idCarrito}`)
            const consultaUsuario= await pool.query(`SELECT DISTINCT carritos.idUsuario as IDusuario FROM carritos,pagarcarritos where pagarcarritos.idCarrito=${parametros.idCarrito} and pagarcarritos.id='${respu1.insertId}'`);
            const consultaCliente= await pool.query(`SELECT DISTINCT carritos.idCliente as IDcliente FROM carritos,pagarcarritos where pagarcarritos.idCarrito=${parametros.idCarrito} and pagarcarritos.id='${respu1.insertId}'`);
            const respu3 = await pool.query(`INSERT INTO ventas (idPagoCarrito, idCliente, idUsuario, fecha) VALUES (${respu1.insertId}, ${consultaCliente[0].IDcliente}, ${consultaUsuario[0].IDusuario}, '${req.body.fecha}')`);
            const combinedResponse = {
                respuesta1: respu1,
                respuesta2: respu2,
                respuesta3: respu3
            };
            res.json(combinedResponse);
        }else if(estadoCarrito[0].estadoCarrito==7){
            console.log("El carrito fue cancelado")
        }else{
            console.log("El carrito ya fue pagado")
        }
    }else{
        console.log("carrito no encontrado")
    }   
}

//aqui va a ir cancelar carrito
public async cancelarcarrito(req: Request, res: Response): Promise<void> {
    let i:number=0;
    let respu2;
    const productosDevolver= await pool.query(`SELECT carritos_productos.idProducto as Productos,carritos_productos.cantidad as Cantidad FROM carritos_productos WHERE carritos_productos.idCarrito=${req.body.id}`);
    const consultaCarrito= await pool.query(`SELECT * FROM carritos WHERE id=${req.body.id}`);
    if(consultaCarrito.length > 0){
        const estadoCarrito= await pool.query(`SELECT carritos.estado as estadoCarrito FROM carritos WHERE carritos.id=${req.body.id}`);
        if(estadoCarrito[0].estadoCarrito==6){
            const respu1 = await pool.query(`UPDATE carritos SET estado = 7 WHERE carritos.id = ${req.body.id}`)
           console.log(productosDevolver)
           for(const producto of productosDevolver){
             const consultaCantidad= await pool.query(`SELECT cantidad FROM productos WHERE id=${producto.Productos}`);
                const cantidadNueva=consultaCantidad[0].cantidad+producto.Cantidad;
                respu2 = await pool.query(`UPDATE productos SET cantidad = ${cantidadNueva} WHERE id = ${producto.Productos}`)
           }
            const combinedResponse = {
                respuesta1: respu1,
                respuesta2: respu2
            };
            res.json(combinedResponse);
        }else if(estadoCarrito[0].estadoCarrito==7){
            console.log("El carrito ya fue cancelado")
        }else if(estadoCarrito[0].estadoCarrito==5){
            console.log("El carrito ya fue pagado")
        }
    }else{
        console.log("carrito no encontrado")
    } 
}

//aqui listamos los productos de un carrito
public async listcarrito(req: Request, res: Response): Promise <void>{
    try {
        const listadoCarrito = await pool.query(`
            SELECT carritos.id, estados.estado, productos.nombre,productos.modelo,carritos_productos.cantidad, productos.precio
            FROM carritos_productos, productos, carritos, estados
            WHERE carritos.id = carritos_productos.idCarrito
                AND carritos.id = ?
                AND productos.id = carritos_productos.idProducto
                AND carritos.estado = estados.id;
        `, [req.params.id]);

        res.json(listadoCarrito);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
}

}

export const carritosController = new CarritosController();