export type ErrorCode = { code: number; message: string }

export const ERROR_CODE = {
  // 200
  SUCCESS: {
    code: 20001,
    message: 'Success',
  },
  // 401
  INVALID_CREDENTIALS: {
    code: 40101,
    message: 'Sorry, your credentials are incorrect.',
  },
  INVALID_TOKEN: {
    code: 40102,
    message: 'Invalid token.',
  },
  EXPIRED_TOKEN: {
    code: 40103,
    message: 'Expired token.',
  },
  MISSING_TOKEN: {
    code: 40104,
    message: 'Login is required.',
  },
  // 403
  PERMISSION_DENIED: {
    code: 40301,
    message: 'Permission denied.',
  },
  // 404
  PAGE_NOT_FOUND: {
    code: 40401,
    message: 'Sorry, that page does not exist.',
  },
  RECORD_NOT_FOUND: {
    code: 40402,
    message: 'Sorry, that record does not exist.',
  },
  // 422
  INVALID: {
    code: 42201,
    message: 'Invalid data.',
  },
  // 500
  INTERNAL_ERROR: {
    code: 50001,
    message: 'Internal error.',
  },
}
