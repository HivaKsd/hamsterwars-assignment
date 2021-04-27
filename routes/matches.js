const getDatabase = require("../database.js")
const db = getDatabase()

const express = require('express')
const router = express.Router()

////GET
router.get('/', async (req, res) => {
	const docRef = db.collection('matches')
	const snapshot = await docRef.get()

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



////GET /:id
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('matches').doc(id).get()

	if( !docRef.exists ) {
		res.status(404).send('This match does not exist')
		return
	}

	const data = docRef.data()
	res.status(200).send(data)
})



////POST
router.post('/', async (req, res) => {
	const object = req.body

	if( !isMatchObject(object) ) {
		res.sendStatus(400)
		return
	}

	const docRef = await db.collection('matches').add(object)
	res.sendStatus(200)
})


////DELETE
router.delete('/:id', async (req, res) => {
	const id = req.params.id

	if( !id ) {
		res.sendStatus(400)
		return
	}
	const docRef = await db.collection('matches').doc(id).get()
	if( !docRef.exists ) {
		res.status(404).send('This match does not exist')
		return
	}
	await db.collection('matches').doc(id).delete()
	res.sendStatus(200)
})



function isMatchObject(maybeObject) {
	if( !maybeObject )
		return false
	else if( !maybeObject.winnerId || !maybeObject.loserId )
		return false

	return true
}

function isChangeObject(maybeObject) {
	if( !maybeObject )
		return false

	return true
}

module.exports = router
