import { Config } from './cli'
import { expressServer } from './express'
import { findServerUrl } from './utils/findServerUrl'
import { logSuccessLaunch } from './utils/logSuccessLaunch'
import { mergeToPackageJson } from './utils/packageJson'
import { load } from './utils/paths'

export const run = (args: Config) => {

  const run = async (resolve: any) => {
    const {
      port,
      localUrl,
      networkUrl,
      localUrlForTerminal,
    } = await findServerUrl(args)

    const shouldServeApp = args.serve
    const isInProduction = args.prod
    const shouldAddProxy = args.proxify

    const routes = await expressServer({
      port,
      isInProduction,
      shouldServeApp,
      buildPath: args.src,
      routes: load(args.srv),
    })

    if (shouldServeApp && !isInProduction && shouldAddProxy) {
      mergeToPackageJson({ proxy: localUrl })
    }

    logSuccessLaunch({
      routes,
      isInProduction,
      shouldServeApp,
      urls: { local: localUrlForTerminal, network: networkUrl },
    })

    resolve()
  }

  return new Promise((resolve) => {
    if (args.delay) {
      setTimeout(() => run(resolve), 300)
    } else {
      run(resolve)
    }
  })
}
