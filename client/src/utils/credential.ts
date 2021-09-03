import Cookies from 'universal-cookie'

export const getToken = (): string => {
  const cookies = new Cookies()

  return cookies.get('token')
}

export const setToken = (token: string): void => {
  const cookies = new Cookies()
  const expires = new Date()

  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000)
  cookies.set('token', token, { path: '/', expires })
}

export const removeToken = (): void => {
  const cookies = new Cookies()

  cookies.remove('token', { path: '/' })
}
