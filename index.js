const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')


const GoogleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//configurações
const docID = '1mhtiHZfxnnp26vuDgemNLxkkdDBJFuQxNUL5cS4XqB0'
const worksheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
     response.render('home')
})

app.post('/', async (request, response) => {
try{
const doc = new GoogleSpreadSheet(docID)
await promisify(doc.useServiceAccountAuth)(credentials)
const info = await promisify(doc.getInfo) ()
const worksheet = info.worksheets[worksheetIndex]
await promisify(worksheet.addRow)({
      name: request.body.name,
      email: request.body.email,
      issueType: request.body.issueType,
      howToReproduce: request.body.howToReproduce,
      expectedOutput: request.body.expectedOutput,
      receivedOutput: request.body.receivedOutput,
      userAgent: request.body.userAgent,
      userDate: request.body.userDate
       })

   response.render('sucesso')
}catch(err){
  response.render('falha')
  console.log(err)
}
})

app.listen(3000, (err) => {
     if(err){
          console.log('Aconteceu um erro!', err)
     } else {
          console.log('Bugtracker rodando na porta http://localhost:3000')
     }
})