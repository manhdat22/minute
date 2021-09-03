import { Request } from 'express'
import morgan from 'morgan'
import { URL } from 'url'

const requestFormat = `
Started :method ":url" for :remote-addr at :date
Parameters: :params
`

const responseFormat = `
Completed :status in :response-time[1] ms
`

morgan.token('params', (req: Request, res) => {
  if (req.method === 'GET') {
    const params: { [k: string]: string } = {}

    new URL(
      req.protocol + '://' + req.get('host') + req.originalUrl,
    ).searchParams.forEach((v, k) => (params[k] = v))

    return JSON.stringify(params)
  }
  return JSON.stringify(req.body)
})

export const morganLogger = () => {
  return [morgan(requestFormat, { immediate: true }), morgan(responseFormat)]
}
