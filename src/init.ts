#!/usr/bin/env node

import { cmd } from './utils/env'
import { done } from './utils/logger'
import { mergeToPackageJson } from './utils/packageJson'
import { confirm, input } from './utils/prompt'

const run = async () => {
  if (await confirm('Add commands to package.json?')) {
    const dev = await input('Name of dev command?', 'sma:dev')
    const prod = await input('Name of prod command?', 'sma:prod')

    const scripts = {
      [dev]: 'serve-my-app --watch',
      [prod]: 'serve-my-app --srv=dist --prod',
    }
    mergeToPackageJson({ scripts })
    done(JSON.stringify(scripts) + ' scripts added to your package.json:')
    // done(`serve-my-app is installed. Launch ${cmd('sma:dev')} to start.`)
  }

  // done(`serve-my-app is installed. Launch ${cmd('sma:dev')} to start.`)
}

run()
