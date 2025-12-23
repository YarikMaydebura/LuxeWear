import { Request, Response, NextFunction } from 'express'
import { addressService } from '../services/address.service'
import { sendSuccess, sendCreated, sendNoContent } from '../utils/api-response'
import { AuthenticatedRequest } from '../types'
import { ApiError } from '../utils/api-error'

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const addresses = await addressService.getAddresses(user.id)
    sendSuccess(res, addresses)
  } catch (error) {
    next(error)
  }
}

export async function createAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const address = await addressService.createAddress(user.id, req.body)
    sendCreated(res, address, 'Address created')
  } catch (error) {
    next(error)
  }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const address = await addressService.updateAddress(user.id, req.params.id, req.body)
    sendSuccess(res, address, 'Address updated')
  } catch (error) {
    next(error)
  }
}

export async function setDefaultAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const address = await addressService.setDefaultAddress(user.id, req.params.id)
    sendSuccess(res, address, 'Default address set')
  } catch (error) {
    next(error)
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    await addressService.deleteAddress(user.id, req.params.id)
    sendNoContent(res)
  } catch (error) {
    next(error)
  }
}
