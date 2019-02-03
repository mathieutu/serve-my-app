import * as history from 'connect-history-api-fallback'
import * as express from 'express'
import * as listEndpoints from 'express-list-endpoints'

type Attributes = {
  port: number,
  buildPath: string,
  shouldServeApp: boolean
  isInProduction: boolean,
  routes: (app: express.Express) => void,
}
export const expressServer =  ({
    port,
    buildPath,
    shouldServeApp,
    isInProduction,
    routes,
}: Attributes): Promise<listEndpoints.ExpressEndpoints> => new Promise((resolve, reject) => {
  const app = express()

  if (shouldServeApp && isInProduction) {
    app.use(history())
    app.use(express.static(buildPath))
  }

  routes(app)

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
