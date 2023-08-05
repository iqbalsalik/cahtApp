const userEmail = document.getElementById("userEmail");
const userName = document.getElementById("userName");
const userPhone = document.getElementById("userPhoneNumber");
const userPass = document.getElementById("userPassword");
const submit = document.getElementById("submit");

submit.addEventListener("click", async (e) => {
    e.preventDefault()
    try {
        const userDetails = {
            name: userName.value,
            email: userEmail.value,
            phone: userPhone.value,
            password: userPass.value
        }
        const response = await axios.post("http://localhost:3000/signUp", userDetails);
        alert(response.data)
        userName.value = '';
        userEmail.value = '';
        userPass.value = '';
        userPhone.value = '';
    } catch (err) {
        alert(err.response.data);
        userName.value = '';
        userEmail.value = '';
        userPass.value = '';
        userPhone.value = '';
    }
})