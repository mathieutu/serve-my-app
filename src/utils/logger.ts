import chalk from 'chalk'
import * as readline from 'readline'
import { wrapInArray } from './misc'

const format = (label: string, msg: string) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? (label ? `${label} ` : '') + line
      : line.padStart(chalk.reset(label).length)
  }).join('\n')
}

const chalkTag = (msg: string) => msg ? chalk.bgBlackBright.white.dim(` ${msg} `) : ''

const prepareMsg = (msg: any) => wrapInArray(msg).join(' ')

export const log = (msg: any = '', tag: string = '', prefix: string = '', type: 'log' | 'warn' | 'error' = 'log') => {
  console[type](format(prefix + chalkTag(tag), prepareMsg(msg)))
}

export const info = (msg: any, tag?: string) => log(msg, tag, chalk.bgBlue.black(' INFO '))
export const done = (msg: any, tag?: string) => log(msg, tag, chalk.bgGreen.black(' DONE '))
export const warn = (msg: any, tag?: string) => log(
  chalk.yellow((prepareMsg(msg))),
  tag,
  chalk.bgYellow.black(' WARN '),
  'warn',
)

export const error = (msg: any, tag?: string) => {
  log(
    chalk.red((prepareMsg(msg))),
    tag,
    chalk.bgRed(' ERROR '),
    'error',
  )

  if (msg instanceof Error) {
    log(chalk.red((prepareMsg(msg.stack))), undefined, undefined, 'error')
  }
}

export const dump = <T>(e: T): T => {
  console.debug(e)
  return e
}

export const dd = <T>(e: T): never => {
  dump(e)
  return process.exit()
}

export const clearConsole = (title?: string) => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows as number)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}
