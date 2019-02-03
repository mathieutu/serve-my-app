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

const argv = minimist(process.argv.slice(2))

const args: Partial<Config> = Object.keys(argv).reduce((result, key) =>
  hasKey(DEFAULT_OPTIONS, key) ? { ...result, [key]: parse(argv[key]) } : result, {})

const prepareConfig = () => {
  const {
    srv,
    src,
    ...rest
  } = {
    ...DEFAULT_OPTIONS,
    ...args,
  }

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
