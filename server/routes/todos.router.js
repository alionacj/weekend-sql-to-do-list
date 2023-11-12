const router = require('express').Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    console.log('GET request received. Retrieving todos...')
    const sqlQueryText = 
        `
            SELECT * FROM "todos"
            ORDER BY "id";
        `
    pool.query(sqlQueryText)
    .then((dbResult) => {
        console.log(' - Retrieved todos:', dbResult.rows)
        res.send(dbResult.rows)
    })
    .catch((dbError) => {
        console.error('Could not retrieve todos:', dbError)
        res.sendStatus(500)
    })
})
router.post('/', (req, res) => {
    console.log('POST request received. Adding item...')
    console.log(req.body)
    const sqlQueryText =
        `
            INSERT INTO "todos"
            ("text", "isComplete")
            VALUES
            ($1, $2);
        `
    const sqlQueryValues = [req.body.text, req.body.isComplete]
    pool.query(sqlQueryText, sqlQueryValues)
    .then ((dbResult) => {
        console.log(' - Request complete!')
        res.sendStatus(201)
    })
    .catch((dbError) => {
        console.error('Error completing request')
        res.sendStatus(500)
    })
})
router.put('/:id', (req, res) => {
    console.log('PUT request received. Editing item...')
    let itemId = req.params.id
    let timeStamp = req.body.date
    console.log("timestamp:", timeStamp)
    const sqlQueryText = 
        `
            UPDATE "todos"
            SET "isComplete" = $1, "completedAt" = $3
            WHERE "id" = $2;
        `
    const sqlQueryValues = [
        true,
        itemId,
        timeStamp
    ]
    pool.query(sqlQueryText, sqlQueryValues)
    .then((dbResult) => {
        console.log(' - Item edited successfully!')
        res.sendStatus(200)
    })
    .catch((dbError) => {
        console.error('Something bad happened!', dbError)
        res.sendStatus(500)
    })
})
router.delete('/:id', (req, res) => {
    console.log('DELETE request received. Deleting item...')
    let itemId = req.params.id
    const sqlQueryText = 
        `
            DELETE FROM "todos"
            WHERE "id" = $1;
        `
    const sqlQueryValues = [itemId]
    pool.query(sqlQueryText, sqlQueryValues)
    .then((dbResult) => {
        console.log('DELETE request successful!')
        res.sendStatus(200)
    })
    .catch((dbError) => {
        console.error('Something went wrong!', dbError)
    })
})

module.exports = router;
