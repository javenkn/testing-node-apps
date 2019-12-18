// Testing Pure Functions

import {isPasswordAllowed} from '../auth'

describe('isPasswordAllowed allows passwords based on the requirements', () => {
  const validPasswords = ['!aBc123']
  const invalidPasswords = [
    'a2c!',
    '123456!',
    'ABCdef!',
    'abc123!',
    'ABC123!',
    'ABCdef123',
  ]

  validPasswords.forEach(password => {
    test(`${password} is valid`, () => {
      expect(isPasswordAllowed(password)).toBe(true)
    })
  })

  invalidPasswords.forEach(password => {
    test(`${password} is invalid`, () => {
      expect(isPasswordAllowed(password)).toBe(false)
    })
  })
})
