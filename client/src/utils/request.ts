import axios from 'axios'
import { getToken } from './credential'

type HTTPMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export const request = async (
  method: HTTPMethod,
  url: string,
  params: any = {},
  options: any = {},
): Promise<any> => {
  const requestBody = {
    method,
    url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    ...options,
  }

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    requestBody.data = params
  } else {
    requestBody.params = params
  }

  if (getToken()) requestBody.headers['x-access-token'] = getToken()

  try {
    const response = await axios(requestBody)
    return response.data
  } catch (error: any) {
    return error.response.data
  }
}
