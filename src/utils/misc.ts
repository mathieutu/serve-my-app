export const coalesce = (...args: any[]): any | void => {
  for (const key in args) {
    if (args[key] !== undefined) {
      return args[key]
    }
  }

  // return undefined
}

type ObjectKey = string | number | symbol

export const hasKey = <O extends object>(obj: O, key: ObjectKey): key is keyof O => key in obj

export const getIn = <O extends object>
(obj: O, key: ObjectKey, defaultValue: any = null) => {
  return hasKey(obj, key) ? obj[key] : defaultValue
}

export type Maybe<T> = T | void

export const isDefined = <T>(x: Maybe<T>): x is T => {
  return x !== undefined && x !== null
}

export const isUndefined = <T>(x: Maybe<T>): x is void => {
  return x === undefined || x === null
}

export const parse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

export const objectMap = <T extends {[key: string]: any}>
(obj: T, mapFn: (value: any, key: keyof T) => any): { [key: string]: any } => {
  return Object.keys(obj).reduce((result, key) => ({ ...result, [key]: mapFn(obj[key], key) }), {})
}

export const wrapInArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value]
