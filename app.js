const express = require("express")
const app = express()
const path = require("path")

const { port } = require("./src/database/config.json")

app.get("/", async function(req, res) {
    res.sendFile(path.join(__dirname + "/src/web/index.html"))
})

app.use(express.static(path.join(__dirname, "src")))

app.listen(port || 3000, () => {
    console.log(`App listening on Port ${port || 3000}!`)
})