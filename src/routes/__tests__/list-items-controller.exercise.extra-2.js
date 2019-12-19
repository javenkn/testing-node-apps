// Testing Controllers

import {
  buildUser,
  buildListItem,
  buildBook,
  buildReq,
  buildRes,
  buildNext,
} from 'utils/generate'
import * as booksDB from '../../db/books'
import * as listItemsDB from '../../db/list-items'
import * as listItemsController from '../list-items-controller'

jest.mock('../../db/books')
jest.mock('../../db/list-items')

beforeEach(() => {
  jest.clearAllMocks()
})

test('getListItem returns the req.listItem', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})

  booksDB.readById.mockResolvedValueOnce(book)

  const req = buildReq({user, listItem})
  const res = buildRes()
  await listItemsController.getListItem(req, res)

  expect(booksDB.readById).toHaveBeenCalledWith(book.id)
  expect(booksDB.readById).toHaveBeenCalledTimes(1)

  expect(res.json).toHaveBeenCalledWith({listItem: {...listItem, book}})
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('createListItem returns a 400 error if no bookId is provided', async () => {
  const req = buildReq()
  const res = buildRes()
  await listItemsController.createListItem(req, res)

  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.status).toHaveBeenCalledTimes(1)

  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No bookId provided",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('setListItem sets the listItem on the request', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  const req = buildReq({user, params: {id: listItem.id}})
  const res = buildRes()
  const next = buildNext()

  await listItemsController.setListItem(req, res, next)

  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)
  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)

  expect(req.listItem).toBe(listItem)

  expect(next).toHaveBeenCalledWith(/** nothing */)
  expect(next).toHaveBeenCalledTimes(1)
})
