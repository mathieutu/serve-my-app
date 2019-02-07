import { writeFileSync } from 'fs'
import { resolveApp } from './paths'

const filePath = resolveApp('package.json')

const writeToFile = (filePath: string, packageJson: object) => {
  writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n')
}

export const addToPackageJson = (proxy: string) => {
  const packageJson = { ...require(filePath), proxy }

  writeToFile(filePath, packageJson)
}

export const removeFromPackageJson = () => {
  const { proxy, ...packageJson } = require(filePath)

  writeToFile(filePath, packageJson)
}
