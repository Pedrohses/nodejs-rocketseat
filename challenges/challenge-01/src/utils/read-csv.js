import fs from 'fs'
import { parse } from 'csv-parse'

const csvPath = new URL("../../tasks.csv", import.meta.url)

export async function importTasksFromCSV() {

  const readableStream = fs.createReadStream(csvPath.pathname)
  const transfromStream = parse({
    columns: true,
  })
  
  readableStream.pipe(transfromStream)
    .on('data', async (row) => {
      const { title, description } = row
      
      await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        })
      })
    })
    .on('end', () => {
      console.log('✅ Processamento concluído!')
    })
    .on('error', (error) => {
      console.log('❌ Erro:', error.message)
    })
}


importTasksFromCSV()