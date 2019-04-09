import chalk from 'chalk'
import * as nodemon from 'nodemon'
import * as path from 'path'
import { Config } from './cli'
import { removeProxyFromPackageJson } from './utils/packageJson'

export const watch = (config: Config, args: Partial<Config>) => {
  return new Promise((resolve) => {
    nodemon({
      exec: `node ${path.resolve(__dirname, 'cli')} ${getFlatArgs({
        ...args,
        watch: false,
        delay: true,
      })}`,
      watch: [config.srv],
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
      removeProxyFromPackageJson()
      process.exit()
    })
  })
}

const getFlatArgs = (args: Partial<Config>) =>
  Object.keys(args).map((option) => {
    const value = args[option as keyof Config]
    return `--${option}${value !== true ? `=${value}` : ''}`
  }).join(' ')
