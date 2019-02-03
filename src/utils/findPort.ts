import { getPortPromise } from 'portfinder'

export const findPort = (host: string, port: number) => {
  return getPortPromise({ host, port })
}
