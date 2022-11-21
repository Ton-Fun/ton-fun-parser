export type Reader = (value: string | undefined, defaultValue: any) => any

interface ReaderMap {
  [key: string]: Reader
}

export interface AnyMap {
  [key: string]: any
}

export const defaultReaders: ReaderMap = {
  Boolean: (value: string | undefined, defaultValue: boolean = true): boolean => {
    return value !== undefined ? value === 'true' : defaultValue
  },
  Number: (value: string | undefined, defaultValue: number = 0): number => {
    return value !== undefined ? parseFloat(value) : defaultValue
  },
  String: (value: string | undefined, defaultValue: string = ''): string => {
    return value ?? defaultValue
  }
}

export function readEnvironment<T> (environment: AnyMap, defaults: T & AnyMap, readers: ReaderMap): T & AnyMap {
  const result: AnyMap = {}
  for (const key in defaults) {
    const environmentValue: string | undefined = environment[key]
    const defaultValue: any = defaults[key]
    const type: string = defaultValue.constructor.name
    const reader: Reader = readers[type]
    result[key] = reader !== undefined ? reader(environmentValue, defaultValue) : defaultValue
  }
  return result as T & AnyMap
}
