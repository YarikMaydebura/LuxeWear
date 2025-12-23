import { Request, Response, NextFunction } from 'express'
import { orderService } from '../services/order.service'
import { sendSuccess, sendCreated } from '../utils/api-response'
import { AuthenticatedRequest } from '../types'
import { ApiError } from '../utils/api-error'

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const orders = await orderService.getUserOrders(user.id)
    sendSuccess(res, orders)
  } catch (error) {
    next(error)
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const order = await orderService.getOrderById(user.id, req.params.id)
    sendSuccess(res, order)
  } catch (error) {
    next(error)
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const order = await orderService.createOrder(user.id, req.body)
    sendCreated(res, order, 'Order created successfully')
  } catch (error) {
    next(error)
  }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as AuthenticatedRequest).user
    if (!user) throw ApiError.unauthorized()

    const order = await orderService.cancelOrder(user.id, req.params.id)
    sendSuccess(res, order, 'Order cancelled successfully')
  } catch (error) {
    next(error)
  }
}
