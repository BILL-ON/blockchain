export const stringToHex = (str) => {
  return Array.from(new TextEncoder().encode(str))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

