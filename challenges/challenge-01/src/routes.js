import { Database } from "./database.js"
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from "./utils/build-route-path.js";
import { getBrazilianDate } from "./utils/get-brazilian-dates.js";

const database = new Database

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body || {}

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({
          error: 'title and description are required'
        }))
      }

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: getBrazilianDate(),
        updated_at: getBrazilianDate()
      }

      database.insert('tasks', tasks)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const table = database.select('tasks', search ? {
        title: search,
        description: search
      }: null)

      return res.writeHead(201).end(JSON.stringify(table))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const searchTask = database.select('tasks', { id })
      const { title, description } = req.body || {}

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({
          error: 'title and description are required'
        }))
      }

      if (searchTask.length === 0) {
        return res.writeHead(400).end(JSON.stringify({
          error: 'id doesnt exist'
        }))
      }
      database.update('tasks', id, req.body)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const searchTask = database.select('tasks', { id })

      if (searchTask.length === 0) {
        return res.writeHead(400).end(JSON.stringify({
          error: 'id doesnt exist'
        }))
      }
      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const searchTask = database.select('tasks', { id })

      if (searchTask.length === 0) {
        return res.writeHead(400).end(JSON.stringify({
          error: 'id doesnt exist'
        }))
      }
      database.complete('tasks', id)

      return res.writeHead(204).end()
    }
  },
]