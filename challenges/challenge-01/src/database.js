import fs from 'node:fs/promises'
import { getBrazilianDate } from "./utils/get-brazilian-dates.js";

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1) {
      throw new Error ('Task not found')
    }

    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
      updated_at: getBrazilianDate()
    }
    
    this.#persist()

    return this.#database[table][rowIndex]
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1) {
      throw new Error ('Task not found')
    }

    this.#database[table].splice(rowIndex, 1)

    this.#persist()
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1) {
      throw new Error ('Task not found')
    }

    this.#database[table][rowIndex].completed_at = 'complete'
    this.#database[table][rowIndex].updated_at = getBrazilianDate()

    return this.#database[table][rowIndex]
  }
}