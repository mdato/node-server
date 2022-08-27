const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')

const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy })

const app = express()

app.use(express.json())

app.get('/', function (req, res) {

    res.send('Hi man!! from HEROKU!')
})

app.post('/imagen', upload.single('imagen'), async function (req, res) {

    const imagen = req.file

    console.log({ file: req.file })

    const processedImage = sharp(imagen.buffer)

    const resizedImage = processedImage.resize(800, 800, {
        fit: "contain",
        background: "#FFF"
    })

    let resizedImageBuffer

    try {
        resizedImageBuffer = await resizedImage.toBuffer()
    } catch (error) {
        console.log({ error })
    }

    fs.writeFileSync('newfolder/img1.png', resizedImageBuffer)

    console.log(resizedImageBuffer)

    res.send(
        {
            '$content-type': 'image/png',
            '$content': resizedImageBuffer.toString('base64')
        }
    )

})

const PORT = process.env.PORT || 4000


app.listen(PORT, function () {

    console.log("Server listen in port:", PORT)
})

