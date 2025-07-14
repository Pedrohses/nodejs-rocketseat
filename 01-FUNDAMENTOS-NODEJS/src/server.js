import http from 'node:http';
import { json } from './middlewares/json.js';

import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  })

  if(route) {
    const routeParams = req.url.match(route.path)

    console.log('URL:', req.url)
    console.log('Route path regex:', route.path)
    console.log('Route params:', routeParams)
    console.log('Route params groups:', routeParams?.groups)

    const { query, ...params } = routeParams.groups

    console.log('Query extracted:', query)
    console.log('Params extracted:', params)

    req.params = params
    req.query = query ? extractQueryParams(query): {}

    console.log('Final req.query:', req.query)

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)