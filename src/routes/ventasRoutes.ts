import { Router } from 'express';
import { ventasController } from '../controllers/ventasController';

class VentasRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
    this.router.post('/create', ventasController.create);
    this.router.put('/update/:id',ventasController.update);
    this.router.delete('/delete/:id',ventasController.delete);
    this.router.get('/',ventasController.list);
    this.router.get('/:id',ventasController.listOne);
    this.router.post('/listarventasfecha',ventasController.listarventasfecha);
}
}
const ventasRoutes= new VentasRoutes();
export default ventasRoutes.router;