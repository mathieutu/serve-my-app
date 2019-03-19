export interface PackageJSON extends Object {
  name: string
  version?: string
  description?: string
  keywords?: string[]
  homepage?: string
  bugs?: string | Bugs
  license?: string
  author?: string | Author
  contributors?: string[] | Author[]
  files?: string[]
  main?: string
  bin?: string | BinMap
  man?: string | string[]
  directories?: Directories
  repository?: string | Repository
  scripts?: ScriptsMap
  config?: Config
  dependencies?: DependencyMap
  devDependencies?: DependencyMap
  peerDependencies?: DependencyMap
  optionalDependencies?: DependencyMap
  bundledDependencies?: string[]
  engines?: Engines
  os?: string[]
  cpu?: string[]
  preferGlobal?: boolean
  private?: boolean
  publishConfig?: PublishConfig
  [key: string]: any
}

interface Author {
  name: string
  email?: string
  homepage?: string
}

interface BinMap {
  [commandName: string]: string
}

interface Bugs {
  email: string
  url: string
}

interface Config {
  name?: string
  config?: Object
}

interface DependencyMap {
  [dependencyName: string]: string
}

interface Directories {
  lib?: string
  bin?: string
  man?: string
  doc?: string
  example?: string
}

interface Engines {
  node?: string
  npm?: string
  yarn?: string
}

interface PublishConfig {
  registry?: string
}

interface Repository {
  type: string
  url: string
}

interface ScriptsMap {
  [scriptName: string]: string
}
