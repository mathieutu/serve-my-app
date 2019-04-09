import chalk from 'chalk'
import { ExpressEndpoints } from 'express-list-endpoints'
import { cmd } from './env'
import { clearConsole, done, log } from './logger'
import routesTable from './routesTable'

type Attributes = {
  urls: { local: string, network: string },
  routes: ExpressEndpoints,
  isInProduction: boolean,
  shouldServeApp: boolean,
}

export const logSuccessLaunch = ({ urls, routes, isInProduction, shouldServeApp }: Attributes) => {
  clearConsole()
  done('\n', Date().toString())

  log(
    '  ♻️  Server running at:\n' +
    `    - Local:   ${chalk.cyan(urls.local)}\n` +
    `    - Network: ${chalk.cyan(urls.network)}\n`,
  )

  const devMessage = () => {
    log([
      `  ⚙  You're in ${chalk.bold('development')} mode.`,
      `To start the application, run ${cmd('start')}.`,
      '\n',
    ])

    if (shouldServeApp) {
      return log([
        '  🎉 Your application will be served,',
        chalk.bold('you can use relative routes paths in your code!'),
      ])
    }

    log([
      '  ⚠️  Your application will not be served,',
      chalk.yellow('you cannot use relative routes paths in your code!'),
    ])
  }
  const prodMessage = () => {
    log([
      `  📦 You're in ${chalk.bold('production')} mode.`,
      `To build the application, run ${cmd('build')}.`,
      '\n',
    ])
    if (shouldServeApp) {
      return log(['  🎉', chalk.bold('Your application is served!')])
    }

    log(['  ⚠️ ', chalk.yellow('Your application is not served!')])
  }

  if (isInProduction) {
    prodMessage()
  } else {
    devMessage()
  }

  log()
  if (routes.length) {
    log('  🔀 Api routes found:\n' + routesTable(routes))
  } else {
    log(['  🔀 No api routes found', isInProduction ? '' : '(yet?)'])
  }
  log()
}
