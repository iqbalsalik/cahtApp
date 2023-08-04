const userEmail = document.getElementById("userEmail");
const userName = document.getElementById("userName");
const userPhone = document.getElementById("userPhoneNumber");
const userPass = document.getElementById("userPassword");
const submit = document.getElementById("submit");

submit.addEventListener("click",async (e)=>{
    e.preventDefault()
    try{
        const userDetails = {
            name: userName.value,
            email: userEmail.value,
            phone: userPhone.value,
            password: userPass.value
        }
        await axios.post("http://localhost:3000/signUp",userDetails);
        userName.value = '';
        userEmail.value = '';
        userPass.value = '';
        userPhone.value = '';
    }catch(err){
        document.write(`<h2>${err.response.data}</h2>`)
    }
})