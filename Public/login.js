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
        const response = await axios.post("http://43.205.113.68:3000/login", userDetails);
        localStorage.setItem("token",response.data.token);
        window.location.href = "/chat";
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