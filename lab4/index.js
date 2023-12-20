const http = require('http')
const fs = require('fs')
const { addMessageListener } = require('./messageListener')

const port = 5000

const sendFile = filename => response => fs.createReadStream(`${__dirname}/${filename}`, 'utf8').pipe(response)

const router = {
	'/': sendFile('client/index.html'),
	'/styles.css': sendFile('/client/styles.css'),
	'/script.js': sendFile('/client/script.js'),
}

const server = http.createServer((req, res) => {
	const requestHandler = router[req.url]
	
	if (!requestHandler) {
		res.writeHead(500)
		return res.end()
	}

	requestHandler(res)
})

addMessageListener(server)

server.listen(port, () => {
	console.log(`Server is listening at the port: ${port}`)
});
