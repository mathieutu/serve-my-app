#!/usr/bin/env node

import * as minimist from 'minimist'
import { run } from './run'
import { env } from './utils/env'
import { hasKey, parse } from './utils/misc'
import { resolveApp } from './utils/paths'
import { watch } from './watch'

const DEFAULT_OPTIONS = {
  serve: true,
  prod: env('NODE_ENV') === 'production',
  delay: false,
  host: env('HOST', '0.0.0.0'),
  port: env('PORT', 3001),
  https: env('HTTPS', false),
  proxify: true,
  srv: 'srv',
  src: 'build',
  watch: false,
}

export type Config = typeof DEFAULT_OPTIONS

const getCommandParameters = () => minimist(process.argv.slice(2))

const argv = getCommandParameters()

const isAValidOption = (key: string) => hasKey(DEFAULT_OPTIONS, key)
const parseArgs = (args: Config, key: string) => ({ ...args, [key]: parse(argv[key]) })

const args: Config = Object.keys(argv)
  .filter(isAValidOption)
  .reduce(parseArgs, DEFAULT_OPTIONS)

const prepareConfig = () => {
  const { srv, src, ...rest } = args

  return {
    srv: resolveApp(srv),
    src: resolveApp(src),
    ...rest,
  }
}

const config = prepareConfig()

if (config.watch) {
  watch(config, args)
} else {
  run(config)
}
