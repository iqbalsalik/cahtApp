const addMember = document.getElementById("addMember");
const memberEmail = document.getElementById("memberEmail");
const listGroup = document.getElementById("listGroup");
const submit = document.getElementById("groupSubmit");
const grupName = document.getElementById("groupName");

const grupMemberList = [];

addMember.addEventListener("click",(e)=>{
    try{
        e.preventDefault();
        const member = memberEmail.value;
        listGroup.innerHTML+=`<li class="list-group-item ">${member}</li>`
        grupMemberList.push(member);
        memberEmail.value = "";
    }catch(err){
        console.log(err)
    }
})

submit.addEventListener("click", async (e)=>{
    try{
        e.preventDefault();
        const nameOfTheGroup = grupName.value;
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/creategroup",{
            memberList: grupMemberList,
            grupName:nameOfTheGroup

        },{
            headers:{
                "authorization": token
            }
        })
        window.location.href = "/chat"
    }catch(err){
        console.log(err)
    }
})



