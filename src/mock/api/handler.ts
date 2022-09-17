import { rest } from 'msw'

export const handlers = [
  rest.get('https://631347b3b466aa9b03965cfe.mockapi.io/todos', (req, res, ctx) => {

    // successful response
    return res(ctx.status(200), ctx.json([
        { id: 1, content: 'Xabi Alonzo',  isCompleted: true },
        { id: 2, content: 'Lionel Messi', isCompleted: true },
        { id: 3, content: 'Lionel Love',  isCompleted: true },
        { id: 4, content: 'Lionel Poe', isCompleted: true },
        { id: 5, content: 'Lionel Gink',  isCompleted: true },
    ]), ctx.delay(30))
  })
]