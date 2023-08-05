const userEmail = document.getElementById("userEmail");
const userPass = document.getElementById("userPassword");
const submit = document.getElementById("submit");
const signUp = document.getElementById("signUpBtn");

submit.addEventListener("click", async (e) => {
    e.preventDefault()
    try {
        const userDetails = {
            email: userEmail.value,
            password: userPass.value
        }
        const response = await axios.post("http://localhost:3000/login", userDetails);
        alert(response.data)
        userEmail.value = '';
        userPass.value = '';
    } catch (err) {
        alert(err.response.data);
        userEmail.value = '';
        userPass.value = '';
    }
})

signUp.addEventListener("click",(e)=>{
    e.preventDefault()
    window.location.href = '/signUp';
})