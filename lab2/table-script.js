const table = document.querySelector(".table")
const colorPicker = document.getElementById("color-picker")

const getRandomColor = () => {
    const randomRGB = () => Math.floor(Math.random() * 256)
    return `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`
}

const createColorPicker = () => {
    const picker = document.createElement("input")
    picker.setAttribute("id", `color-picker`)
    picker.setAttribute("type", `color`)

}

const createDoubleClickHandler = (cb1, cb2) => {
    let clicked = false;
    return event => {
        if (event.detail === 1) {
            clicked = true
            setTimeout(() => clicked && cb1(event), 200)
        } else if (event.detail === 2) {
            clicked = false
            cb2(event)
        }
    }
}

for (let i = 1; i <= 36; i++) {
    const cell = document.createElement("div")
    cell.classList.add("table-cell")
    cell.setAttribute("id", `cell-${i}`)
    cell.textContent = i

    if (i === 5) {
        cell.addEventListener("mouseover", () => {
            cell.style.backgroundColor = getRandomColor()
        })
    }

    table.appendChild(cell)
}

table.addEventListener("click", createDoubleClickHandler(
    event => event.target.id === "cell-5" && (event.target.style.backgroundColor = colorPicker.value),
    event => event.target.id === "cell-5" && (table.style.backgroundColor = colorPicker.value),
))
