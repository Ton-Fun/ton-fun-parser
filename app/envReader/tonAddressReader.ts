import { Address } from 'ton'

export const ZERO_ADDRESS: Address = new Address(0, Buffer.alloc(32))

export function tonAddressReader (value: string | undefined, defaultValue: Address = ZERO_ADDRESS): Address {
  return value !== undefined ? Address.parse(value) : defaultValue
}
