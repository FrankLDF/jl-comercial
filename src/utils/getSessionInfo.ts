export const getSessionInfo = () => {
  const userStored = localStorage.getItem('sessionUser')
  try {
    return userStored ? JSON.parse(userStored) : null
  } catch (error) {
    console.error('Error parsing sessionUser:', error)
    return null
  }
}
