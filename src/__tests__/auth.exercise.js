// Testing Authentication API Routes

import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import {loginForm} from 'utils/generate'
import startServer from '../start'

let server

beforeAll(async () => {
  server = await startServer({port: 8000})
})

afterAll(() => server.close())

beforeEach(() => resetDb())

test('auth flow', async () => {
  const {username, password} = loginForm()

  const registerResponse = await axios.post(
    'http://localhost:8000/api/auth/register',
    {
      username,
      password,
    },
  )
  expect(registerResponse.data.user).toEqual({
    id: expect.any(String),
    username,
    token: expect.any(String),
  })

  const loginResponse = await axios.post(
    'http://localhost:8000/api/auth/login',
    {
      username,
      password,
    },
  )
  expect(loginResponse.data.user).toEqual(registerResponse.data.user)

  const userResponse = await axios.get('http://localhost:8000/api/auth/me', {
    headers: {
      Authorization: `Bearer ${loginResponse.data.user.token}`,
    },
  })
  expect(userResponse.data.user).toEqual(loginResponse.data.user)
})
