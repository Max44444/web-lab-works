const signInButton = document.getElementById("sign-in-btn")
const signUpButton = document.getElementById("sign-up-btn")

const registerButton = document.getElementById("register-btn")
const backToLoginButton = document.getElementById("back-to-login-btn")

const editButton = document.getElementById("edit-btn")
const deleteButton = document.getElementById("delete-btn")
const logoutButton = document.getElementById("logout-btn")
const getAllUsersButton = document.getElementById("get-users-btn")

const confirmEditButton = document.getElementById("confirm-edit-btn")
const cancelButton = document.getElementById("cancel-btn")
const closeButton = document.getElementById("close-btn")

const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form")

const loginEmail = document.querySelector("#login-email input")
const loginPassword = document.querySelector("#login-password input")

const email = document.querySelector("#email input")
const password = document.querySelector("#password input")
const nameField = document.querySelector("#name input")
const group = document.querySelector("#group input")
const variant = document.querySelector("#variant input")
const phone = document.querySelector("#phone input")

const editEmail = document.querySelector("#edit-email input")
const editPassword = document.querySelector("#edit-password input")
const editName = document.querySelector("#edit-name input")
const editGroup = document.querySelector("#edit-group input")
const editVariant = document.querySelector("#edit-variant input")
const editPhone = document.querySelector("#edit-phone input")

const userInfoEmail = document.querySelector("#user-info-email span")
const userInfoName = document.querySelector("#user-info-name span")
const userInfoGroup = document.querySelector("#user-info-group span")
const userInfoVariant = document.querySelector("#user-info-variant span")
const userInfoPhone = document.querySelector("#user-info-phone span")

const userInfo = document.querySelector(".user-info")
const editForm = document.getElementById("edit-form")
const userList = document.getElementById("user-list")

const userListItems = document.getElementById("user-list-items")


const permisssionDeniedMessage = document.getElementById("permission-denied-message")

const forms = [loginForm, registerForm, userInfo, editForm, userList]

const serverURL = "http://localhost:8080/user"

const show = element => element.style.display = "block"
const hide = element => element.style.display = "none"
const display = element => {
    forms.forEach(form => {
        if (form === element) {
            show(form)
        } else {
            hide(form)
        }
    })
}
const hasToken = () => !!localStorage.getItem("token")

registerButton.addEventListener("click", () => display(registerForm))

backToLoginButton.addEventListener("click", () => display(loginForm))

signInButton.addEventListener("click", () => {
    fetch(`${serverURL}/login`, {
        method: "POST",
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(response => {
        localStorage.setItem("token", response.token)
        window.location.reload()
    })
    .catch(error => {
        console.error(error)
        permisssionDeniedMessage.style.display = "block"
    })
})

signUpButton.addEventListener("click", () => {
    fetch(`${serverURL}/register`, {
        method: "POST",
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            name: nameField.value,
            group: group.value,
            variant: variant.value,
            phone: phone.value,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(response => {
        localStorage.setItem("token", response.token)
        window.location.reload()
    })
    .catch(error => {
        console.error(error)
        permisssionDeniedMessage.style.display = "block"
    })
})

const updateUserDetailsFromResponse = response => {
    userInfoEmail.textContent = response.username
    userInfoName.textContent = response.name
    userInfoGroup.textContent = response.group
    userInfoVariant.textContent = response.variant
    userInfoPhone.textContent = response.phone
}

const addLoadUsersButton = () => {
    fetch(`${serverURL}/role`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(roles => {
        if (roles.includes("ADMIN")) {
            show(getAllUsersButton)
        }
    })
}

if (hasToken()) {
    hide(loginForm)
    hide(registerForm)
    show(userInfo)
    fetch(`${serverURL}/me`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(response => {
        updateUserDetailsFromResponse(response)
        addLoadUsersButton()
    })
    .catch(() => {
        localStorage.removeItem("token")
        window.location.reload()
    })
}

deleteButton.addEventListener("click", () => {
    if (hasToken) {        
        fetch(`${serverURL}/delete`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(() => {
            display(loginForm)
            localStorage.removeItem("token")
            window.location.reload()
        })
    }
})

editButton.addEventListener("click", () => {
    display(editForm)
    editEmail.value = userInfoEmail.textContent
    editName.value = userInfoName.textContent
    editGroup.value = userInfoGroup.textContent
    editVariant.value = userInfoVariant.textContent
    editPhone.value = userInfoPhone.textContent
})

cancelButton.addEventListener("click", () => display(userInfo))

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.reload()
})

confirmEditButton.addEventListener("click", () => {
    fetch(`${serverURL}/update`, {
        method: "PUT",
        body: JSON.stringify({
            email: editEmail.value,
            password: editPassword.value,
            name: editName.value,
            group: editGroup.value,
            variant: editVariant.value,
            phone: editPhone.value,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(response => {
        updateUserDetailsFromResponse(response)
        display(userInfo)
    })
    .catch(error => {
        console.error(error)
        permisssionDeniedMessage.style.display = "block"
    })
})

getAllUsersButton.addEventListener("click", () => {
    fetch(`${serverURL}/requestall`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(response => {
        userListItems.innerHTML = ""
        response.forEach(user => {
            const tableRow = document.createElement("tr")
            tableRow.innerHTML = `
                <td scope="row">${user.username}</td>
                <td scope="row">${user.name}</td>
                <td scope="row">${user.group}</td>
                <td scope="row">${user.variant}</td>
                <td scope="row">${user.phone}</td>
            `
            userListItems.appendChild(tableRow)
        })
        display(userList)
    })
})

closeButton.addEventListener("click", () => display(userInfo))
