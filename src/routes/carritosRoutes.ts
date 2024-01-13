import { Router } from 'express';
import { carritosController } from '../controllers/carritosController';

class CarritosRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
    this.router.post('/create', carritosController.create);
    this.router.post('/agregar', carritosController.agregar);
    this.router.put('/update/:id',carritosController.update);
    this.router.delete('/delete/:id',carritosController.delete);
    this.router.get('/',carritosController.list);
    this.router.get('/:id',carritosController.listOne);
    this.router.post('/pagarcarrito',carritosController.pagarcarrito);
    this.router.post('/cancelarcarrito',carritosController.cancelarcarrito);
    this.router.get('/listarcarrito/:id',carritosController.listcarrito);
}
}
const carritosRoutes= new CarritosRoutes();
export default carritosRoutes.router;