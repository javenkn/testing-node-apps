// Testing Pure Functions
import cases from 'jest-in-case'
import {isPasswordAllowed} from '../auth'

cases(
  'isPasswordAllowed: valid passwords',
  options => {
    expect(isPasswordAllowed(options.password)).toBe(true)
  },
  {
    'valid password': {password: '!aBc123'},
  },
)

cases(
  'isPasswordAllowed: invalid passwords',
  options => {
    expect(isPasswordAllowed(options.password)).toBe(false)
  },
  {
    'not long enough': {password: 'a2C!'},
    'no letters': {password: '123456!'},
    'no numbers': {password: 'ABCdef!'},
    'no uppercase letters': {password: 'abc123!'},
    'no lowercase letters': {password: 'ABC123!'},
    'no non-alphanumeric characters': {password: 'ABCdef123'},
  },
)
