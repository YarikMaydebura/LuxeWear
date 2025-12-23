import { Router } from 'express'
import * as cartController from '../controllers/cart.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { addToCartSchema, updateCartItemSchema, syncCartSchema } from '../validators/cart.validator'

const router = Router()

router.use(authenticate)

router.get('/', cartController.getCart)
router.post('/', validate(addToCartSchema), cartController.addToCart)
router.put('/:itemId', validate(updateCartItemSchema), cartController.updateCartItem)
router.delete('/:itemId', cartController.removeFromCart)
router.delete('/', cartController.clearCart)
router.post('/sync', validate(syncCartSchema), cartController.syncCart)

export default router
