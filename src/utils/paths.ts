import { existsSync, realpathSync } from 'fs'
import { extname, resolve } from 'path'

const appDirectory = realpathSync(process.cwd())
export const resolveApp = (relativePath: string) => resolve(appDirectory, relativePath)

export const moduleIsAvailable = (path: string) => {
  try {
    require.resolve(path)
    return true
  } catch (e) {
    return false
  }
}

const getTypescriptConfig = (path: string) => {
  const configPath = path + '/tsconfig.json'
  if (existsSync(configPath)) {
    return { project: configPath }
  }

  return {
    compilerOptions: {
      module: 'commonjs',
    },
  }
}

const isTypescriptFile = (path: string) => {
  require.extensions['.ts'] = () => {}

  const isTypescript = extname(require.resolve(path)).startsWith('.ts')

  delete require.extensions['.ts']

  return isTypescript
}

export const load = (path: string) => {
  if (isTypescriptFile(path)) {
    require('ts-node').register(getTypescriptConfig(path))
  }

  const empty = () => {}

  if (!moduleIsAvailable(path)) {
    return empty
  }

  const module = require(path)
  return module.default || module || empty
}
