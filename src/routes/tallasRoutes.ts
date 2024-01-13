import { Router } from 'express';
import {  tallasController } from '../controllers/tallasController';

class TallasRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
    this.router.post('/create', tallasController.create);
    this.router.put('/update/:id',tallasController.update);
    this.router.delete('/delete/:id',tallasController.delete);
    this.router.get('/',tallasController.list);
    this.router.get('/:id',tallasController.listOne);
}
}
const tallasRoutes= new TallasRoutes();
export default tallasRoutes.router;