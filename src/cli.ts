#!/usr/bin/env node

import * as minimist from 'minimist'
import { run } from './run'
import { env } from './utils/env'
import { hasKey, parse } from './utils/misc'
import { watch } from './watch'

export type Config = {
  srv: string | false;
  src: string | false;
  watch: boolean;
  proxify: boolean;
  host: string;
  port: number;
  https: boolean;
  delay: boolean;
}

const cli = async () => {
  const DEFAULT_OPTIONS: Config = {
    srv: false,
    src: false,
    watch: false,
    proxify: false,
    host: env('HOST', '0.0.0.0'),
    port: env('PORT', 3001),
    https: env('HTTPS', false),
    delay: false,
  }

  const getCommandParameters = () => minimist(process.argv.slice(2))

  const argv = getCommandParameters()

  const isAValidOption = (key: string) => hasKey(DEFAULT_OPTIONS, key)
  const parseArgs = (args: Config, key: string) => ({ ...args, [key]: parse(argv[key]) })

  const args: Config = Object.keys(argv)
    .filter(isAValidOption)
    .reduce(parseArgs, DEFAULT_OPTIONS)

  const pathOrFalse = (path: string | boolean): string | false => {
    return path && typeof path === 'string' ? path : false
  }

  const prepareConfig = () => {
    const { srv, src, ...rest } = args

    return {
      srv: pathOrFalse(srv),
      src: pathOrFalse(src),
      ...rest,
    }
  }

  const config: Config = prepareConfig()

  if (config.watch) {
    return await watch(config)
  }

  await run(config)
}

cli()
