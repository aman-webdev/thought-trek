const validateEmail = (email: string) => {
    const exp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   return exp.test(email)
}

export default validateEmail