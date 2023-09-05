const form = document.getElementById("form")
const loginBtn = document.getElementById("loginBtn")
const testBtn = document.getElementById("test")
const loginContainer = document.getElementById("loginContainer")
const selectionsContainer = document.getElementById("selectionsContainer")
const logoutBtn = document.getElementById("logoutBtn")

form.addEventListener("submit", () => {
    alert("Login successful!")  
})

testBtn.addEventListener("click", () => {
    loginContainer.style.display = "none"
    selectionsContainer.style.display = "flex"
})

logoutBtn.addEventListener("click", () => {
    loginContainer.style.display = "flex"
    selectionsContainer.style.display = "none"
})