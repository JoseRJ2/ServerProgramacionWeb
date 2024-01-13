import { Router } from 'express';
import { estadosController } from '../controllers/estadosController';
class EstadosRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
    this.router.post('/create',estadosController.create);
    this.router.put('/update/:id',estadosController.update);
    this.router.delete('/delete/:id',estadosController.delete);
    this.router.get('/',estadosController.list);
    this.router.get('/:id',estadosController.listOne);
}
}
const estadosRoutes= new EstadosRoutes();
export default estadosRoutes.router;