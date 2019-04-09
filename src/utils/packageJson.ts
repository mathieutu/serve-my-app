import * as deepMerge from 'deepmerge'
import { writeFileSync } from 'fs'
import { PackageJSON } from '../../typings/package-json'
import { resolveApp } from './paths'

const filePath = resolveApp('package.json')

const writePackageJson = (packageJson: PackageJSON) => {
  writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n')
}

const getPackageJson = (): PackageJSON => require(filePath)

export const mergeToPackageJson = (objectToMerge: Partial<PackageJSON>) => {
  const packageJson = deepMerge(getPackageJson(), objectToMerge)

  writePackageJson(packageJson)
}

export const removeProxyFromPackageJson = () => {
  const { proxy, ...packageJson } = require(filePath)

  writePackageJson(packageJson)
}
