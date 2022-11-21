import { Address } from 'ton'

const ZERO_ADDRESS: Address = new Address(0, Buffer.alloc(32))

export function readAddress (value: string | undefined): Address {
  return value !== undefined ? Address.parse(value) : ZERO_ADDRESS
}

export function readInt (value: string | undefined, defaultValue: number = 0): number {
  return value !== undefined ? parseInt(value) : defaultValue
}

export function readString (value: string | undefined, defaultValue: string = ''): string {
  return value ?? defaultValue
}

export function readBoolean (value: string | undefined, defaultValue: boolean = true): boolean {
  return value !== undefined ? value === 'true' : defaultValue
}
