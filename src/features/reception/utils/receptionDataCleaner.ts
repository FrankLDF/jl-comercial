/**
 * Utility to recursively remove null, undefined, and empty strings from an object.
 * This ensures the backend doesn't receive invalid values for constrained fields.
 */
export const cleanReceptionData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(v => cleanReceptionData(v))
  } else if (data !== null && typeof data === 'object' && !(data instanceof Date)) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => [k, cleanReceptionData(v)])
        .filter(([_, v]) => v !== null && v !== undefined && v !== '')
    )
  }
  return data
}
