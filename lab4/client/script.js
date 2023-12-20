const socket = io()

const nicknameInput = document.getElementById('nickname-input')
const formLable = document.querySelector('.form-lable')
const loginForm = document.querySelector('.login-container')
const chat = document.querySelector('.main')
const messageList = document.querySelector('.messages-container')
const messageInput = document.getElementById('message-input')
const userName = document.querySelector('.name')

const addMessage = message => {
    const messageWrapper = document.createElement('li')
    messageWrapper.classList.add('message')
    messageWrapper.innerHTML = `
        <div class="message-name">${message.sender}</div>
        <div class="message-value">${message.content}</div>
    `
    messageList.appendChild(messageWrapper)
}

const verifyNickname = () => {
    const name = nicknameInput.value.trim()
    
    if (name === '') return

    socket.emit('verifyNickname', name, response => {
        if (!response.result) {
            return (formLable.textContent = 'Sorry nickname already in use, try another one')
        }

        loginForm.style.display = 'none'
        chat.style.display = 'flex'
        
        userName.textContent = name

        response.history.forEach(addMessage)

        socket.on('message', addMessage)
    })
}

const sendMessage = () => {
    const message = messageInput.value.trim()

    if (message !== '') {
        socket.emit('message', message)
        messageInput.value = ''
    }
}

