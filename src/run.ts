import { Config } from './cli'
import { expressServer } from './express'
import { findServerUrl } from './utils/findServerUrl'
import { logSuccessLaunch } from './utils/logSuccessLaunch'
import { mergeToPackageJson } from './utils/packageJson'
import { load, resolveApp } from './utils/paths'

export const run = (args: Config) => {

  const run = async (resolve: any) => {
    const {
      port,
      localUrl,
      networkUrl,
      localUrlForTerminal,
    } = await findServerUrl(args)

    const shouldAddProxy = args.proxify

    const routes = await expressServer({
      port,
      appToServe: args.src && resolveApp(args.src),
      routes: args.srv && load(resolveApp(args.srv)),
    })

    if (shouldAddProxy) {
      // TODO Only for CreateReactApp for now
      mergeToPackageJson({ proxy: localUrl })
    }

    logSuccessLaunch({
      routes,
      config: args,
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
