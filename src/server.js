import http from 'node:http';
import { json } from '../middlewares/json.js';
import { Database } from '../middlewares/database.js';
import { randomUUID } from 'node:crypto';

const database = new Database();

const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    await json(req, res)

    if(method === 'GET' && url === '/users') {
        const users = database.select('users');

        return res.end(JSON.stringify(users));
    }

    if(method === 'POST' && url === '/users') {
        const { name, email } = req.body;

        const user = {
            id: randomUUID(),
            name,
            email 
        }

        database.insert('users', user);

        return res.writeHead(201).end();
    }

  return res.writeHead(404).end('Hello World');
})

server.listen(3333);