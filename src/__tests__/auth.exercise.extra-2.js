// Testing Authentication API Routes

import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import {loginForm} from 'utils/generate'
import {getData, handleRequestFailure} from 'utils/async'
import startServer from '../start'

let server, api

beforeAll(async () => {
  server = await startServer()
  const baseURL = `http://localhost:${server.address().port}/api`
  api = axios.create({baseURL})
  api.interceptors.response.use(getData, handleRequestFailure)
})

afterAll(() => server.close())

beforeEach(() => resetDb())

test('auth flow', async () => {
  const {username, password} = loginForm()

  const registerResponse = await api.post('auth/register', {
    username,
    password,
  })

  expect(registerResponse.user).toEqual({
    id: expect.any(String),
    username,
    token: expect.any(String),
  })

  const loginResponse = await api.post('auth/login', {
    username,
    password,
  })
  expect(loginResponse.user).toEqual(registerResponse.user)

  const userResponse = await api.get('auth/me', {
    headers: {
      Authorization: `Bearer ${loginResponse.user.token}`,
    },
  })
  expect(userResponse.user).toEqual(loginResponse.user)
})
