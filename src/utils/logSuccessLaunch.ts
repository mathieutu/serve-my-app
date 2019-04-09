import chalk from 'chalk'
import { ExpressEndpoints } from 'express-list-endpoints'
import { existsSync } from 'fs'
import { Config } from '../cli'
import { cmd } from './env'
import { clearConsole, done, log } from './logger'
import routesTable from './routesTable'

type Attributes = {
  urls: { local: string, network: string },
  routes: ExpressEndpoints,
  config: Config,
}

const logSrc = (path: string) => {
  log(['  🎉', chalk.bold('Your application is up!'), 'The files in', path, 'will be served.'])

  if (!existsSync(path)) {
    log(['  ⚠️', 'The folder currently does not exist.',
      `Run ${cmd('build')} to generate it`,
      '(depends on your build process/framework).'])
  }
}

const logProxy = () => {
  log(['  ⚙  Your api is proxified,',
    chalk.bold('you can use relative routes paths in your frontend code!'),
    '\n',
    'You can now start your application dev server',
    `(often by launching ${cmd('start')} or ${cmd('serve')} depending of your frontend framework.)`,
  ])
}

const logRoutes = (routes: ExpressEndpoints, watch: boolean) => {
  log()
  if (routes.length) {
    return log('  🔀 Api routes found:\n' + routesTable(routes))
  }

  log(['  🔀 No api routes found', watch ? '(yet?)' : ''])
}

function logServer(urls: Attributes['urls']) {
  log(
    '  ♻️  Server running at:\n' +
    `    - Local:   ${chalk.cyan(urls.local)}\n` +
    `    - Network: ${chalk.cyan(urls.network)}\n`,
  )
}

export const logSuccessLaunch = ({ urls, routes, config }: Attributes) => {
  clearConsole()
  done('\n', Date().toString())

  logServer(urls)

  if (config.src) {
    logSrc(config.src)
  }

  if (config.proxify) {
    logProxy()
  }

  if (config.srv) {
    logRoutes(routes, config.watch)
  }

  log()
}
