import * as history from 'connect-history-api-fallback'
import * as express from 'express'
import * as listEndpoints from 'express-list-endpoints'
import { createServer } from 'http'
import { ApiFunction } from './index'
import { log } from './utils/logger'

type Attributes = {
  port: number,
  appToServe: string | false,
  routes: ApiFunction | false,
}

type Response = Promise<listEndpoints.ExpressEndpoints>

export const expressServer = ({ port, appToServe, routes }: Attributes): Response =>
  new Promise((resolve, reject) => {
    const app = express()
    const server = createServer(app)

    if (appToServe) {
      app.use(history())
      app.use(express.static(appToServe))
    }

    if (routes) {
      routes(app, server)
    }

    server.listen(port, (err: Error) => {
      if (err) {
        reject(err)
      } else {
        resolve(getAppEndpoints(app))
      }
    })
  })

function getAppEndpoints(app: express.Express): listEndpoints.ExpressEndpoints {
  try {
    return listEndpoints(app)
  } catch (e) {
    return []
  }
}
