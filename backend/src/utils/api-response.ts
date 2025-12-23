import { Response } from 'express'

interface ApiResponseOptions<T> {
  res: Response
  statusCode?: number
  success?: boolean
  message?: string
  data?: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export function sendResponse<T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  meta,
}: ApiResponseOptions<T>): Response {
  const response: Record<string, unknown> = {
    success,
  }

  if (message) {
    response.message = message
  }

  if (data !== undefined) {
    response.data = data
  }

  if (meta) {
    response.meta = meta
  }

  return res.status(statusCode).json(response)
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  return sendResponse({ res, statusCode, data, message })
}

export function sendCreated<T>(res: Response, data: T, message = 'Created'): Response {
  return sendResponse({ res, statusCode: 201, data, message })
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send()
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response {
  return sendResponse({
    res,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
