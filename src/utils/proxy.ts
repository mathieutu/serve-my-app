import { writeFileSync } from 'fs'
import { resolveApp } from './paths'

const filePath = resolveApp('package.json')

export const addToPackageJson = (proxy: string) => {
  const packageJson = { ...require(filePath), proxy }

  writeFileSync(filePath, JSON.stringify(packageJson, null, 2))
}

export const removeFromPackageJson = () => {
  const { proxy, ...packageJson } = require(filePath)

  writeFileSync(filePath, JSON.stringify(packageJson, null, 2))
}
