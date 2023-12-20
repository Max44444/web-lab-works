const addMessageListener = server => {
    const io = require('socket.io')(server)

    const chatHistory = []
    const connectedUsers = {}

    const isNicknameAvailable = name => !Object.values(connectedUsers).includes(name)

    io.on('connection', socket => {
        socket.on('verifyNickname', (name, callback) => {
            if (isNicknameAvailable(name)) {
                console.log(name)
                console.log(connectedUsers);
                connectedUsers[socket.id] = name
                return callback({ result: true, history: chatHistory })
            }
            return callback({ result: false })
        })

        socket.on('message', message => {
            const ditailedMessage = {
                sender: connectedUsers[socket.id],
                content: message
            }

            chatHistory.push(ditailedMessage)
            io.emit('message', ditailedMessage)
        })

        socket.on('disconnect', () => {
            delete connectedUsers[socket.id]
        })
    })
}

module.exports = { addMessageListener }