import chalk from 'chalk'
import * as nodemon from 'nodemon'
import * as path from 'path'
import { Config } from './cli'
import { error } from './utils/logger'
import { resolveApp } from './utils/paths'

const getFlatArgs = (args: Partial<Config>) =>
  Object.entries(args)
    .map(([option, value]) => `--${option}=${value}`)
    .join(' ')

export const watch = (config: Config) => {
  const pathToWatch = config.srv && resolveApp(config.srv)

  if (!pathToWatch) {
    return error('--srv is false, and --watch can\'t be applied in this context.')
  }

  return new Promise((resolve) => {
    nodemon({
      exec: `node ${path.resolve(__dirname, 'cli')} ${getFlatArgs({
        ...config,
        watch: false,
        delay: true,
      })}`,
      watch: [pathToWatch],
      ext: 'js mjs json ts',
    })

    nodemon.on('restart', () => {
      console.log()
      console.log(chalk.bold.green('  ⏳  Express server is restarting...'))
    })

    nodemon.on('crash', () => {
      console.log()
      console.log(chalk.bold.red('  💥  Express server crashed!'))
      console.log(chalk.red('  ❓  Waiting for changes...'))
    })

    nodemon.on('stdout', (...params) => {
      console.log()
      console.log(...params)
    })

    nodemon.on('stderr', (...params) => {
      console.log()
      console.log(chalk.bold.red('  ⚠️  Oops, there is a problem with your code!'))
      console.log(...params)
    })

    nodemon.on('quit', () => {
      resolve()
    })
  })
}
