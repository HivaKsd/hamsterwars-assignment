const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const hamsters = require('./routes/hamsters.js')
const matches = require('./routes/matches.js')

const PORT = process.env.PORT || 1338
const staticFolder = path.join(__dirname, 'static')

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.params);
  next()
})

app.use(express.json())
app.use(cors())
app.use(express.static(staticFolder))

app.use('/hamsters', hamsters)
app.use('/matches', matches)


// Starta servern
app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
})
