const chatContainer = document.getElementById("chatContainer");

window.addEventListener("DOMContentLoaded",()=>{
    for(let i =0;i<5;i++){
        if(i%2 ===0){
            chatContainer.innerHTML+=`<div id= expId class="row" style = "width:100%; margin-left:2px; background-color:#d7ffd7;">
                <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;"> expName</div>
                <div class="col-auto" style="font-size: larger; color: black;"> &#8377 expAmount</div>
            </div>`
        }else{
            chatContainer.innerHTML+=`<div id= expId1 class="row" style = "width:100%; margin-left:2px; background-color:#e3e1e1;">
            <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;"> expName</div>
            <div class="col-auto" style="font-size: larger; color: black;"> &#8377 expAmount</div>
        </div>`
        }
    }
})

