type DecimalLike = {
  toNumber: () => number
}

const isDecimalLike = (value: unknown): value is DecimalLike => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toNumber' in value &&
    typeof value.toNumber === 'function'
  )
}

export const toNumberFromDatabase = (value: unknown): number => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'string') return Number(value)
  if (isDecimalLike(value)) return value.toNumber()

  return Number(value)
}
