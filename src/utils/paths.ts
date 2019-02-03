import { realpathSync } from 'fs'
import { resolve } from 'path'

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

export const load = (path: string) => {
  const empty = () => {}

  if (!moduleIsAvailable(path)) {
    return empty
  }

  const module = require(path)
  return module.default || module || empty
}
