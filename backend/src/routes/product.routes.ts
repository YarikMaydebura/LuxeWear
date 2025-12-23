import { Router } from 'express'
import * as productController from '../controllers/product.controller'

const router = Router()

router.get('/', productController.getProducts)
router.get('/search', productController.searchProducts)
router.get('/featured', productController.getFeaturedProducts)
router.get('/new-arrivals', productController.getNewArrivals)
router.get('/best-sellers', productController.getBestSellers)
router.get('/on-sale', productController.getOnSaleProducts)
router.get('/:id', productController.getProductById)

export default router
