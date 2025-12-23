import { Router } from 'express'
import * as orderController from '../controllers/order.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createOrderSchema } from '../validators/order.validator'

const router = Router()

router.use(authenticate)

router.get('/', orderController.getOrders)
router.post('/', validate(createOrderSchema), orderController.createOrder)
router.get('/:id', orderController.getOrderById)
router.put('/:id/cancel', orderController.cancelOrder)

export default router
