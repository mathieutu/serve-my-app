#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { srvStub } from './stubs/srv'
import { cmd } from './utils/env'
import { clearConsole, done, error, log, warn } from './utils/logger'
import { mergeToPackageJson } from './utils/packageJson'
import { resolveApp } from './utils/paths'
import { choose, confirm, input } from './utils/prompt'

const createServerFile = async (srvFolder: string, devCmd: string) => {
  if (!(await confirm(`I will create ${srvFolder}/index.js file... Ok with that?`))) {
    return warn('Roger that, I didn\'t do anything, and let you create it yourself.\n' +
      `You'll be able to start the dev server by launching ${cmd(devCmd)}.`)
  }

  const path = resolveApp(srvFolder)

  existsSync(path) || mkdirSync(path, { recursive: true })
  writeFileSync(`${path}/index.js`, srvStub)

  done(`${srvFolder}/index.js file created with stubs.\n` +
    `Launch ${cmd(devCmd)} to start developing your api.`)
}

const addScripts = async (scripts: { [key: string]: string }) => {
  if (!(await confirm('I will add the scripts to package.json... Ok with that?'))) {
    return warn('Roger that, I didn\'t do anything and let you add them yourself:\n' +
      JSON.stringify(scripts, null))
  }

  mergeToPackageJson({ scripts })

  done([
    JSON.stringify(scripts),
    `script${Object.keys(scripts).length > 1 ? 's were' : 'was'}`,
    'added to your package.json.',
  ])
}

const frontOnly = async () => {
  if (!(await confirm('I will add a command to package.json... Ok with that?'))) {
    return warn('Roger that, I didn\'t add anything.')
  }

  const cmdName = await input('Name of the command?', 'sma')

  const srcFolder = await input('Path of the application folder (built files)?', 'build')

  const scripts = {
    [cmdName]: `serve-my-app --src=${srcFolder}`,
  }

  mergeToPackageJson({ scripts })

  done(`${JSON.stringify(scripts)} scripts was added to your package.json.
  Launch ${cmd(cmdName)} to serve your build files.`)
}

const apiOnly = async () => {
  const srvFolder = await input('Path of the server folder?', 'srv')

  const devCmd = await input('Name of the dev command?', 'api:watch')
  const prodCmd = await input('Name of the prod command?', 'api')

  const scripts = {
    [devCmd]: `serve-my-app --srv=${srvFolder} --watch`,
    [prodCmd]: `serve-my-app --srv=${srvFolder}`,
  }

  log()
  await addScripts(scripts)
  log()
  await createServerFile(srvFolder, devCmd)
}

const apiAndFront = async () => {
  const srcFolder = await input('Path of the application folder (built files)?', 'build')
  const srvFolder = await input('Path of the server folder?', 'srv')

  const devCmd = await input('Name of the dev command?', 'sma:watch')
  const prodCmd = await input('Name of the prod command?', 'sma')

  const scripts = {
    [devCmd]: `serve-my-app --srv=${srvFolder} --proxify --watch`,
    [prodCmd]: `serve-my-app --srv=${srvFolder} --src=${srcFolder}`,
  }
  log()
  await addScripts(scripts)
  log()
  await createServerFile(srvFolder, devCmd)
}

const manually = () => {
  warn('Nothing here for now. You can see the full usage of ServeMyApp here: \n' +
    'https://github.com/mathieutu/serve-my-app#Configuration')
}

const choices = [
  { name: 'I only want to serve my frontend code in production.', value: frontOnly },
  { name: 'I only want to add some api routes.', value: apiOnly },
  { name: 'I want to serve both my frontend code and add some api routes.', value: apiAndFront },
  { name: 'I want to manually configure ServeMyApp.', value: manually },
]

const run = async () => {
  try {
    clearConsole()
    const choice = await choose('What do you want to do with ServeMyApp?', choices)

    await choice()
    log()

    done('ServeMyApp is correctly initialized.')

  } catch (e) {
    e ? error(e) : warn('Killing ServeMyApp initialization.')
    process.exitCode = 1
  }

  log()
}

run()
