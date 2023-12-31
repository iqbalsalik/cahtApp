const messageContainer = document.getElementById("messages");
const chatBox = document.getElementById("inputMessage");
const sendMessage = document.getElementById("sendMessage");
const createGroupBtn = document.getElementById("createGroup");
const listGroup = document.getElementById("listGroup");
const memeberList = document.getElementById("memberList");
const groupName = document.getElementById("groupName");
const leftSegment = document.getElementById("leftSegment");
const memberEmail = document.getElementById("memberEmail");
const editMember = document.getElementById("editMember");
const imageInput = document.getElementById('imageInput');
const selectedImage = document.getElementById('selectedImage');
const sendImageBtn = document.getElementById('sendImageBtn');

const token = localStorage.getItem("token")
let i = 0;

const socket = io("http://localhost:5000", {
    extraHeaders: {
        Authorization: token
    }
})

async function getAllGroups(data) {
    try {
        listGroup.innerHTML = ''
        for (let j = 0; j < data.length; j++) {
            if (data[j].admin) {
                listGroup.innerHTML += `<li class="list-group-item" id = "${data[j].group.id}" onclick="selectedGroup(${data[j].group.id},'${data[j].group.groupName}',event)">${data[j].group.groupName}  <button class="btn-sm btn-primary textSm" onclick="deleteGroup(${data[j].group.id})">Delete</button>  <button class="btn-sm btn-primary textSm" onclick="addMemberBtn(${data[j].group.id})"><i class="bi bi-plus"></i>  <i class="bi bi-person"></i></button</li>`
            } else {
                listGroup.innerHTML += `<li class="list-group-item" id = "${data[j].group.id}" onclick="selectedGroup(${data[j].group.id},'${data[j].group.groupName}',event)">${data[j].group.groupName} <button class="btn-sm btn-primary textSm" onclick="leaveGroup(${data[j].group.id})">Leave Group</button></li>`
            }
        }
    } catch (err) {
        alert(err.response.data)
    }
}

socket.on("leftChat", data => {
    showMessagesOnScreen(null, data, "Left Chat", null)
})

window.addEventListener("DOMContentLoaded", () => {
    socket.emit("getGroups")
})
socket.on("allGroups", data => {
    getAllGroups(data)
})

socket.on("messageRecieved", data => {
    showMessagesOnScreen(data.id, data.name, data.message, null)
})

sendMessage.addEventListener("click", (e) => {
    e.preventDefault();
    const groupId = groupName.firstChild.id;
    if (!groupId) {
        return alert("Select a group first!")
    }
    const message = chatBox.value;
    showMessagesOnScreen(null, "You", message, null)
    socket.emit("messageSent", message, groupId);
    chatBox.value = '';
})

function addMemberBtn(id) {
    try {
        editMember.innerHTML = ` <form>
            <div class="form-group">
                <label for="memberEmail">Add Members</label>
                <input type="email" class="form-control" id = "memberEmail" aria-describedby="emailHelp"
                    placeholder="Enter email">
            </div>

            <!-- SUBMIT BUTTON-->
            <button type="submit" class="btn btn-dark textSm" onclick = "addMember(event,'${id}')">Add Member</button>
    </form>`
    } catch (err) {
        console.log(err)
    }
}

async function makeAdmin(adminId, groupId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/makeadmin", {
            adminId: adminId,
            groupId: groupId
        }, {
            headers: {
                "authorization": token
            }
        })
        alert(res.data);
        const childElement = document.getElementById(`${adminId}${groupId}`);
        const parentElement = childElement.parentNode;
        parentElement.removeChild(childElement)
    } catch (err) {
        alert(err.response.data)
        console.log(err)
    }
}

socket.on("chatJoined", data => {
    showMessagesOnScreen(null, data, "Joined the Chat!!", null)
})


async function selectedGroup(id, name, e) {
    try {
        if (e.target.id == id) {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:3000/memberchat/${id}`, {
                headers: {
                    "authorization": token
                }
            })
            groupName.innerHTML = `<h2 class="my-3 text-center" id= "${id}">${name}</h2>`;
            memeberList.innerHTML = "";
            if (res.data.admin) {
                for (let j = 0; j < res.data.userArray.length; j++) {
                    if (!res.data.userArray[j].isAdmin) {
                        memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.userArray[j].user.id}">${res.data.userArray[j].user.name} <button class="btn-sm btn-primary textSm" onclick="removeMember(${res.data.userArray[j].user.id},'${id}')"><i class="bi bi-x"></i></button> <button class="btn-sm btn-primary textSm" id="${res.data.userArray[j].user.id}${id}" onclick="makeAdmin(${res.data.userArray[j].user.id},'${id}')">Admin</button></li>`
                    } else {
                        memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.userArray[j].user.id}">${res.data.userArray[j].user.name} <button class="btn-sm btn-primary textSm" onclick="removeMember(${res.data.userArray[j].user.id})"><i class="bi bi-x"></i></button>`
                    }
                }
            } else {
                for (let j = 0; j < res.data.userArray.length; j++) {
                    memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.userArray[j].user.id}">${res.data.userArray[j].user.name} </li>`
                }
            }
            socket.emit("joinRoom", name, id)
            messageContainer.innerHTML = '';
            getMessage()
        }
    } catch (err) {
        console.log(err)
    }
}

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function showMessagesOnScreen(id, name, message, fileUrl) {
    if (fileUrl) {
        if (i % 2 === 0) {
            messageContainer.innerHTML += `<div class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#d7ffd7; border-radius:23px;">
            <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;">
            <span style="color: #39420c; font-weight: bold;">${name}:</span>
            <img src="${fileUrl}" alt="Image"  style = "width: 20rem; margin: 10px; border-radius: 21px;">
            </div>
            </div>`
        } else {
            messageContainer.innerHTML += `<div class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#e3e1e1; border-radius:23px;">
            <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;">
             <span style="color: #39420c; font-weight: bold;">${name}:</span>
            <img src="${fileUrl}" alt="Image"  style = "width: 20rem; margin: 10px; border-radius: 21px;">
            </div>
            </div>`
        }
    } else {
        if (i % 2 === 0) {
            messageContainer.innerHTML += `<div id= ${id} class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#d7ffd7; border-radius:23px;">
                            <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;">  <span style="color: #39420c; font-weight: bold;">${name}:</span> <p> ${message}</p> </div>
                        </div>`
        } else {
            messageContainer.innerHTML += `<div id= ${id} class="row text-break d-flex flex-column align-items-start" style = "width:100%; margin-left:2px; background-color:#e3e1e1; border-radius:23px;">
                        <div class="col-auto mr-auto d-flex" style="font-size: larger; color: black;"> <span style="color: #39420c; font-weight: bold;">${name}:</span>  <p> ${message}</p></div>
                    </div>`
        }
    }
    i++
    scrollToBottom()
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
            const res = await axios.get(`http://localhost:3000/getmessages/${groupId}?id=${id}`, {
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
                i = 0
                for (let j = 0; j < lsArray.length; j++) {
                    showMessagesOnScreen(lsArray[j].id, lsArray[j].name, lsArray[j].message, lsArray[j].fileUrl);
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
        const res = await axios.post(`http://localhost:3000/addMember/${id}`, { memberEmail: memberEmail }, {
            headers: {
                "authorization": token
            }
        })
        alert(res.data.message)
        editMember.innerHTML = "";
        memeberList.innerHTML += `<li class="list-group-item"  id="${res.data.id}">${res.data.name} <button class="btn-sm btn-primary textSm" onclick="removeMember(${res.data.id})"><i class="bi bi-x"></i></button> <button class="btn-sm btn-primary textSm" id="${res.data.id}${id}" onclick="makeAdmin(${res.data.id},'${id}')">Admin</button></li>`
    } catch (err) {
        alert(err.response.data)
    }
}

async function removeMember(id, groupId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://localhost:3000/removemember/${id}?groupId=${groupId}`, {
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

async function deleteGroup(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://localhost:3000/deletegroup/${id}`, {
            headers: {
                "authorization": token
            }
        });
        alert(res.data);
        const childNode = document.getElementById(id)
        listGroup.removeChild(childNode);
        messageContainer.innerHTML = '';
        groupName.innerHTML = `<h3 class="my-3 text-center">Select a group to see messages</h3>`;
        memeberList.innerHTML = "";
    } catch (err) {
        console.log(err)
    }
}

async function leaveGroup(id) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://localhost:3000/leaveGroup/${id}`, {
            headers: {
                "authorization": token
            }
        })
        const childNode = document.getElementById(id);
        listGroup.removeChild(childNode);
        memeberList.innerHTML = "";
        messageContainer.innerHTML = '';
        const name = document.getElementById(id);
        console.log(name)
        groupName.innerHTML = `<h3 class="my-3 text-center">Select a group to see messages</h3>`
        alert(res.data)
    } catch (err) {
        alert(err.response.data)
    }
}

createGroupBtn.addEventListener("click", async (e) => {
    try {
        e.preventDefault();
        window.location.href = "/creategroup"
    } catch (err) {
        console.log(err)
    }
})

imageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            selectedImage.src = e.target.result;
            selectedImage.style.display = 'block';
        };

        reader.readAsDataURL(file);
    }
});

sendImageBtn.addEventListener('click', function () {
    const groupId = groupName.firstChild.id;
    if (!groupId) {
        return alert("Select a group first!")
    }

    const file = imageInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        const fileData = event.target.result;
        socket.emit("uploadFile", { fileName: file.name, fileData });
    };
    reader.readAsArrayBuffer(file);
    showMessagesOnScreen(null, "You", null, selectedImage.src)
    selectedImage.src = '#';
    selectedImage.style.display = 'none';
    imageInput.value = '';
});

socket.on("fileUploaded", fileUrl => {
    showMessagesOnScreen(null, fileUrl.name, null, fileUrl.fileUrl)
})