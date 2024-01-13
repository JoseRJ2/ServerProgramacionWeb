import { Router } from 'express';
import { productosController } from '../controllers/productosController';

class ProductosRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
    this.router.post('/create',productosController.create);
    this.router.put('/update/:id',productosController.update);
    this.router.delete('/delete/:id',productosController.delete);
    this.router.get('/',productosController.list);
    this.router.get('/:id',productosController.listOne);
}
}
const productosRoutes= new ProductosRoutes();
export default productosRoutes.router;