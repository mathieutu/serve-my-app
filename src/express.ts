import * as history from 'connect-history-api-fallback'
import * as express from 'express'
import * as listEndpoints from 'express-list-endpoints'

type Attributes = {
  port: number,
  appToServe: string | false
  routes: ((app: express.Express) => void) | false,
}
export const expressServer =  ({
    port,
    appToServe,
    routes,
}: Attributes): Promise<listEndpoints.ExpressEndpoints> => new Promise((resolve, reject) => {
  const app = express()

  if (appToServe) {
    app.use(history())
    app.use(express.static(appToServe))
  }

  if (routes) {
    routes(app)
  }

  app.listen(port, (err: Error) => {
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
