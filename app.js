const express = require("express")
const app = express()

const { port } = require("./src/database/config.json")

app.get("/", async function(req, res) {
    res.send("HelloWorld")
})

app.listen(port || 3000, () => {
    console.log(`App listening on Port ${port || 3000}!`)
})