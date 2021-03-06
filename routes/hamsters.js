const getDatabase = require("../database.js")
const db = getDatabase()

const express = require('express')
const router = express.Router()

////GET
router.get('/', async (req, res) => {
	const hamstersRef = db.collection('hamsters')
	const snapshot = await hamstersRef.get()

	if( snapshot.empty ) {
		res.send([])
		return
	}

	let items = []
	snapshot.forEach(doc => {
		const data = doc.data()
		data.id = doc.id
		items.push( data )
	})
	res.status(200).send(items)
})

////GET /random
router.get('/random', async (req, res) => {
	const hamsterRef = db.collection('hamsters');
  const snapshot = await hamsterRef.get();
  if (snapshot.empty) {
    res.send([])
		return
  }

  items = []

  snapshot.forEach(doc => {
      const data = doc.data()
      data.id = doc.id
      items.push(data)
  })

  const randomIndex = Math.floor(Math.random() * items.length)
  res.status(200).send(items[randomIndex])
})


////GET /:id
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('hamsters').doc(id).get()

	if( !docRef.exists ) {
		res.status(404).send('This hamster does not exist')
		return
	}

	const data = docRef.data()
	res.status(200).send(data)
})



////POST
router.post('/', async (req, res) => {
	const object = req.body

	if( !isHamstersObject(object) ) {
		res.status(400).send("Object is not defined")
		return
	}

	const docRef = await db.collection('hamsters').add(object)
	const newId = docRef.id
	const newObject = {id: newId}
	res.status(200).send(newObject)
})

////PUT /:id
router.put('/:id', async (req, res) => {
	const object = req.body
	const id = req.params.id

  const docRef = await db.collection('hamsters').doc(id).get()
	if( !docRef.exists ) {
		res.status(404).send('This hamster does not exist')
		return
	}
	else if (Object.keys(object).length === 0) {
		res.status(400).send('Bad Request!')
		return
	}
	await db.collection('hamsters').doc(id).set(object, { merge: true })
	res.sendStatus(200)
})

////DELETE /:id
router.delete('/:id', async (req, res) => {
	const id = req.params.id

	if( !id ) {
		res.sendStatus(400)
		return
	}
	const docRef = await db.collection('hamsters').doc(id).get()
	if( !docRef.exists ) {
		res.status(404).send('This hamster does not exist')
		return
	}
	await db.collection('hamsters').doc(id).delete()
	res.sendStatus(200)
})




function isHamstersObject(maybeObject) {
	if( !maybeObject )
		return false
	else if( !maybeObject.name || !maybeObject.favFood || !maybeObject.loves || !maybeObject.imgName)
	return false
  else if (Number(maybeObject.age) < 0)
		return false
	else if (Number(maybeObject.wins) < 0)
			return false
	else if (Number(maybeObject.defeats) < 0)
			return false
	else if (Number(maybeObject.games) < 0)
			return false

	return true
}

function isChangeObject(maybeObject) {
	if( !maybeObject )
		return false

	return true
}

module.exports = router
