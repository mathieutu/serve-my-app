import chalk from 'chalk'
import { existsSync } from 'fs'
import { coalesce, isUndefined, parse } from './misc'
import { resolveApp } from './paths'

let _hasYarn: boolean | null
export const hasYarn = () => coalesce(_hasYarn, _hasYarn = existsSync(resolveApp('yarn.lock')))

let _hasTypescript: boolean | null
export const hasTypescript = () => coalesce(_hasTypescript, _hasTypescript = existsSync(resolveApp('tsconfig.json')))

export const cmd = (exec: string) => `${chalk.cyan((hasYarn() ? 'yarn ' : 'npm run ') + exec)}`

// @ts-ignore TODO
export const env = <T extends any>(name: string, defaultValue: T = null): T => {
  const value = process.env[name]
  if (isUndefined(value)) {
    return defaultValue
  }

  return coalesce(parse(value), defaultValue)
}
