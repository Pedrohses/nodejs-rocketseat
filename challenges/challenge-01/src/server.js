import http from 'http';
import { routes } from './routes.js';
import { json } from './middlewares/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })
  
  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query): {}

    return route.handler(req, res)
  }
  
  res.end()
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});