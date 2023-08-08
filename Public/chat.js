const chatContainer = document.getElementById("chatContainer");
const messageContainer = document.getElementById("messages");
const chatBox = document.getElementById("inputMessage");
const sendMessage = document.getElementById("sendMessage");

let i = 0;

window.addEventListener("DOMContentLoaded",()=>{
    getMessage()
})

setInterval(() => {
    getMessage()
}, 1000);

async function getMessage(){
    try{
        const token = localStorage.getItem("token");                                  
        let lsArray = JSON.parse(localStorage.getItem("lsMessage"));
        let id;
        if(lsArray){
             id = lsArray[lsArray.length-1].id;
        }else{
            id = -1;
        }
        const res = await axios.get(`http://localhost:3000/getmessages?id=${id}`,{
            headers:{
                "authorization":token
            }
        });
        let mergeArray;
        if(lsArray && res.data.length){
             mergeArray = [...lsArray,...res.data];
            localStorage.setItem("lsMessage",JSON.stringify(mergeArray)) 
        }else if(res.data.length){
            localStorage.setItem("lsMessage",JSON.stringify(res.data))
        }
        lsArray = JSON.parse(localStorage.getItem("lsMessage"));
        if(lsArray.length>10){
            let limitedLsArray = [];
            for(let j =lsArray.length-10;j<lsArray.length;j++){
                limitedLsArray.push(lsArray[j])
            }
            localStorage.setItem("lsMessage",JSON.stringify(limitedLsArray))
        }
         lsArray = JSON.parse(localStorage.getItem("lsMessage"))
    messageContainer.innerHTML = '';
    i = 0
    if(lsArray){
        for(let j =0;j<lsArray.length;j++){
            showMessagesOnScreen(lsArray[j].id,lsArray[j].name,lsArray[j].message);
           }
    } 
    }catch(err){
        // console.log(err)
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
        const messageData = {
            id:res.data.postedMessage.id,
            message:res.data.postedMessage.message,
            name:res.data.name
        }
        const localStorageArray = JSON.parse(localStorage.getItem("lsMessage"));
        if(localStorageArray){
        localStorageArray.push(messageData);
        localStorage.setItem("lsMessage",JSON.stringify(localStorageArray))
        }else{
            const lsMessage = [];
            lsMessage.push(messageData);
            localStorage.setItem("lsMessage",JSON.stringify(lsMessage))
        }
        showMessagesOnScreen(res.data.postedMessage.id,"You",res.data.postedMessage.message)
        chatBox.value = '';
    } catch (err) {
        console.log(err)
    }
})


function showMessagesOnScreen(id,name,message){
    if (i % 2 === 0) {
        messageContainer.innerHTML += `<div id= ${id} class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#d7ffd7; border-radius:23px;">
                        <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;">  <span style="color: #39420c; font-weight: bold;">${name}:</span>  ${message} </div>
                    </div>`
    } else {
        messageContainer.innerHTML += `<div id= ${id} class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#e3e1e1; border-radius:23px;">
                    <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;"> <span style="color: #39420c; font-weight: bold;">${name}:</span>  ${message}</div>
                </div>`
    }
    i++
}

