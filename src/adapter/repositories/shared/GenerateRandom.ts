export const generateRandomLoginId = () => {
  return Math.random().toString(10).slice(2, 10)
}

export const generateRandomPassword = () => {
  return Math.random().toString(36).slice(2, 10)
}
