const chatContainer = document.getElementById("chatContainer");
const messageContainer = document.getElementById("messages");
const chatBox = document.getElementById("inputMessage");
const sendMessage = document.getElementById("sendMessage");

let i = 0;

// window.addEventListener("DOMContentLoaded",async()=>{
//    getMessage()
// })

setInterval(() => {
    getMessage()
}, 1000);

async function getMessage(){
    try{
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/getmessages",{
            headers:{
                "authorization": token
            }
        });
        while(i<res.data.length){
            if (i % 2 === 0) {
                messageContainer.innerHTML += `<div id= ${res.data[i].id} class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#d7ffd7; border-radius:23px;">
                                <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;">  <span style="color: #39420c; font-weight: bold;">${res.data[i].name}:</span>  ${res.data[i].message} </div>
                            </div>`
            } else {
                messageContainer.innerHTML += `<div id= ${res.data[i].id} class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#e3e1e1; border-radius:23px;">
                            <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;"> <span style="color: #39420c; font-weight: bold;">${res.data[i].name}:</span>  ${res.data[i].message}</div>
                        </div>`
            }
            i++;
        }
    }catch(err){
        console.log(err)
    }
}

sendMessage.addEventListener("click", async e => {
    try {
        const message = chatBox.value;
        const token = localStorage.getItem("token")
        const res = await axios.post("http://localhost:3000/messagesent", { message: message }, {
            headers: {
                "authorization": token
            }
        })
        // if (i % 2 === 0) {
        //     messageContainer.innerHTML += `<div id= ${res.data.id} class="row" style = "width:100%; margin-left:2px; background-color:#d7ffd7; border-radius:23px;">
        //                     <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;">  <span style="color: #39420c; font-weight: bold;">You:</span>        ${res.data.message} </div>
        //                 </div>`
        // } else {
        //     messageContainer.innerHTML += `<div id= ${res.data.id} class="row" style = "width:100%; margin-left:2px; background-color:#e3e1e1; border-radius:23px;">
        //                 <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;"> <span style="color: #39420c; font-weight: bold;">You:</span>       ${res.data.message}</div>
        //             </div>`
        // }
        chatBox.value = '';
    } catch (err) {
        console.log(err)
    }
})

