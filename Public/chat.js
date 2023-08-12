const chatContainer = document.getElementById("chatContainer");
const messageContainer = document.getElementById("messages");
const chatBox = document.getElementById("inputMessage");
const sendMessage = document.getElementById("sendMessage");
const createGroupBtn = document.getElementById("createGroup");
const listGroup = document.getElementById("listGroup");
const memeberList = document.getElementById("memberList");
const groupName = document.getElementById("groupName");
const editGroupContainer = document.getElementById("editGroupContainer");
const leftSegment = document.getElementById("leftSegment");
const submit = document.getElementById("groupSubmit");
const memberEmail = document.getElementById("memberEmail");
const listGroupNewlyAdded = document.getElementById("listGroupNewlyAdded");
const editMember = document.getElementById("editMember");

let i = 0;

window.addEventListener("DOMContentLoaded", getAllGroups)

function addMemberBtn(id) {
    try {
        editMember.innerHTML = ` <form>
            <div class="form-group">
                <label for="memberEmail">Add Members</label>
                <input type="email" class="form-control" id = "memberEmail" aria-describedby="emailHelp"
                    placeholder="Enter email">
            </div>

            <!-- SUBMIT BUTTON-->
            <button type="submit" class="btn btn-dark" onclick = "addMember(event,'${id}')">Add Member</button>
    </form>`
    } catch (err) {
        console.log(err)
    }
}

setInterval(() => {
    getMessage()
    getAllGroups()
}, 1000);

sendMessage.addEventListener("click", async e => {
    try {
        const groupId = groupName.firstChild.id;
        if (!groupId) {
            return alert("Select a group first!")
        }
        const message = chatBox.value;
        const token = localStorage.getItem("token")
        const res = await axios.post("http://43.205.113.68:3000/messagesent", { message: message, groupId: groupId }, {
            headers: {
                "authorization": token
            }
        })
        console.log(res)
        const messageData = {
            id: res.data.postedMessage.id,
            message: res.data.postedMessage.message,
            name: res.data.name
        }
        const localStorageArray = JSON.parse(localStorage.getItem(groupName.firstChild.innerText));
        if (localStorageArray) {
            localStorageArray.push(messageData);
            localStorage.setItem(groupName.firstChild.innerText, JSON.stringify(localStorageArray))
        } else {
            const lsMessage = [];
            lsMessage.push(messageData);
            localStorage.setItem(groupName.firstChild.innerText, JSON.stringify(lsMessage))
        }
        showMessagesOnScreen(res.data.postedMessage.id, res.data.name, res.data.postedMessage.message)
        chatBox.value = '';
    } catch (err) {
        console.log(err)
    }
})

createGroupBtn.addEventListener("click", async (e) => {
    try {
        e.preventDefault();
        window.location.href = "/creategroup"
    } catch (err) {
        console.log(err)
    }
})

//UTIL FUNCTIONS

async function removeMember(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://43.205.113.68:3000/removemember/${id}`, {
            headers: {
                "authorization": token
            }
        })
        alert(res.data);
        const childNode = document.getElementById(id)
        memeberList.removeChild(childNode)
    } catch (err) {
        console.log(err)
    }
}

async function makeAdmin(adminId,groupId){
    try{
        const token = localStorage.getItem("token");
       const res =  await axios.post("http://43.205.113.68:3000/makeadmin",{
            adminId:adminId,
            groupId: groupId
        },{
            headers:{
                "authorization": token
            }
        })
        console.log(res)
        alert(res.data);
        const childElement = document.getElementById(`${adminId}${groupId}`);
        const parentElement = childElement.parentNode;
        parentElement.removeChild(childElement)

    }catch(err){
        alert(err.response.data)
        console.log(err)
    }
}

async function selectedGroup(id, name) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://43.205.113.68:3000/memberchat/${id}`, {
            headers: {
                "authorization": token
            }
        })
        groupName.innerHTML = `<h2 class="my-3 text-center" id= "${id}">${name}</h2>`;
        getMessage()
        memeberList.innerHTML = "";
        if(res.data.admin){
            for (let j = 0; j < res.data.userArray.length; j++) {
                if (!res.data.userArray[j].isAdmin) {
                    memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.userArray[j].user.id}">${res.data.userArray[j].user.name} <button class="btn-sm btn-primary" onclick="removeMember(${res.data.userArray[j].user.id})">remove</button> <button class="btn-sm btn-primary" id="${res.data.userArray[j].user.id}${id}" onclick="makeAdmin(${res.data.userArray[j].user.id},'${id}')">Admin</button></li>`
                }else{
                    memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.userArray[j].user.id}">${res.data.userArray[j].user.name} <button class="btn-sm btn-primary" onclick="removeMember(${res.data.userArray[j].user.id})">remove</button>`
                }
            }
        } else {
            for (let j = 0; j < res.data.userArray.length; j++) {
                memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.userArray[j].user.id}">${res.data.userArray[j].user.name} </li>`
            }
        }
    } catch (err) {
        console.log(err)
    }
}

function showMessagesOnScreen(id, name, message) {
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

async function getMessage() {
    try {
        const groupId = groupName.firstChild.id;
        if (groupId) {
            const token = localStorage.getItem("token");
            let lsArray = JSON.parse(localStorage.getItem(groupName.firstChild.innerText));
            let id;
            if (lsArray) {
                id = lsArray[lsArray.length - 1].id;
            } else {
                id = -1;
            }
            const res = await axios.get(`http://43.205.113.68:3000/getmessages/${groupId}?id=${id}`, {
                headers: {
                    "authorization": token
                }
            });
            let mergeArray;
            if (lsArray && res.data.length) {
                mergeArray = [...lsArray, ...res.data];
                localStorage.setItem(groupName.firstChild.innerText, JSON.stringify(mergeArray))
            } else if (res.data.length) {
                localStorage.setItem(groupName.firstChild.innerText, JSON.stringify(res.data))
            }
            lsArray = JSON.parse(localStorage.getItem(groupName.firstChild.innerText));
           
            if (lsArray) {
                if (lsArray.length > 10) {
                    let limitedLsArray = [];
                    for (let j = lsArray.length - 10; j < lsArray.length; j++) {
                        limitedLsArray.push(lsArray[j])
                    }
                    localStorage.setItem(groupName.firstChild.innerText, JSON.stringify(limitedLsArray))
                }
                lsArray = JSON.parse(localStorage.getItem(groupName.firstChild.innerText))
                messageContainer.innerHTML = '';
                i = 0
                for (let j = 0; j < lsArray.length; j++) {
                    showMessagesOnScreen(lsArray[j].id, lsArray[j].name, lsArray[j].message);
                }
            }
        }

    } catch (err) {
        console.log(err)
    }
}

async function addMember(e, id) {
    try {
        e.preventDefault()
        const token = localStorage.getItem("token");
        const memberEmail = document.getElementById("memberEmail").value;
        const res = await axios.post(`http://43.205.113.68:3000/addMember/${id}`, { memberEmail: memberEmail }, {
            headers: {
                "authorization": token
            }
        })
        alert(res.data.message)
        editMember.innerHTML = "";
        memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.id}">${res.data.name} <button class="btn-sm btn-primary" onclick="removeMember(${res.data.id})">remove</button> <button class="btn-sm btn-primary" id="${res.data.id}${id}" onclick="makeAdmin(${res.data.id},'${id}')">Admin</button></li>`
        
    } catch (err) {
        alert(err.response.data)
    }
}

async function deleteGroup(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://43.205.113.68:3000/deletegroup/${id}`, {
            headers: {
                "authorization": token
            }
        });
        alert(res.data);
        const childNode = document.getElementById(id)
        listGroup.removeChild(childNode)
    } catch (err) {
        console.log(err)
    }
}

async function getAllGroups(){
    try{
        const token = localStorage.getItem("token");
        const groups = await axios.get("http://43.205.113.68:3000/getallgroups", {
            headers: {
                "authorization": token
            }
        })
        listGroup.innerHTML = ''
        for (let j = 0; j < groups.data.groupArray.length; j++) {
            if (groups.data.groupArray[j].isAdmin) {
                listGroup.innerHTML += `<li class="list-group-item" id = "${groups.data.groupArray[j].group.id}" onclick="selectedGroup(${groups.data.groupArray[j].group.id},'${groups.data.groupArray[j].group.groupName}')">${groups.data.groupArray[j].group.groupName}  <button class="btn-sm btn-primary" onclick="deleteGroup(${groups.data.groupArray[j].group.id})">Delete</button>  <button class="btn-sm btn-primary" onclick="addMemberBtn(${groups.data.groupArray[j].group.id})"><i class="bi bi-plus"></i>  Member</button</li>`
            } else {
                listGroup.innerHTML += `<li class="list-group-item" id = "${groups.data.groupArray[j].group.id}" onclick="selectedGroup(${groups.data.groupArray[j].group.id},'${groups.data.groupArray[j].group.groupName}')">${groups.data.groupArray[j].group.groupName} <button class="btn-sm btn-primary" onclick="leaveGroup(${groups.data.groupArray[j].group.id})">Leave Group</button></li>`
            }
    
        }
    }catch(err){
        alert(err.response.data)
    }
}

async function leaveGroup(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://43.205.113.68:3000/leaveGroup/${id}`, {
            headers: {
                "authorization": token
            }
        })
        alert(res.data)
        const childNode = document.getElementById(id);
        listGroup.removeChild(childNode);
        memeberList.innerHTML = "";
    } catch (err) {
        console.log(err)
        alert(err.response.data)
    }
}