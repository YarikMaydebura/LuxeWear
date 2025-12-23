import { Router } from 'express'
import * as addressController from '../controllers/address.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { createAddressSchema, updateAddressSchema } from '../validators/address.validator'

const router = Router()

router.use(authenticate)

router.get('/', addressController.getAddresses)
router.post('/', validate(createAddressSchema), addressController.createAddress)
router.put('/:id', validate(updateAddressSchema), addressController.updateAddress)
router.put('/:id/default', addressController.setDefaultAddress)
router.delete('/:id', addressController.deleteAddress)

export default router
