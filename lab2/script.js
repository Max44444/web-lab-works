const validationMapping = {
    "name": /[A-Za-zА-Яа-яі]+ [A-Za-zА-Яа-яі]\.[A-Za-zА-Яа-яі]\./,
    "faculty": /[A-Za-zА-Яа-яі]{4}/,
    "date": /(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[012]).(19|20)\d{2}/,
    "address": /м\. \d{6}/,
    "email": /[A-Za-z]+@[A-Za-z]+\.com/
}

const modalWindow = document.querySelector(".modal")

document.querySelector(".submit-btn").addEventListener("click", event => {
    event.preventDefault()

    for (const [fieldName, reg] of Object.entries(validationMapping)) {
        const inputField = document.querySelector(`#${fieldName} > input`)
        inputField.classList.remove("error")

        if (!reg.test(inputField.value)) {
            inputField.classList.add("error")
        } else {
            document.querySelector(`#modal-${fieldName} > span`).textContent = inputField.value
        }
    }

    if (!document.querySelector(".error")) {
        modalWindow.style.display = 'block'
    }
})

modalWindow.addEventListener("click", () => {
    modalWindow.style.display = 'none'
})