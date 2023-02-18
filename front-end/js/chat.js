const myform = document.getElementById('myform');
const message_input = document.querySelector('.message');
const message_div = document.getElementById('message_div');
const group_form = document.getElementById('group_form');
let token = localStorage.getItem('token');
const createGroupBtn = document.getElementById('createGroupBtn');
const participants_div = document.getElementById('participants_div');
const add_member_searchbar = document.getElementById('add_member_searchbar');
const show_member_searchbar = document.getElementById('show_member_searchbar');
const show_member_div = document.getElementById('show_member_div');

// if (!localStorage.getItem('messages')) {
//     localStorage.setItem('messages', JSON.stringify([]));
// }
localStorage.setItem("gId", "");
document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    // setInterval(() => {
    //     getMessages();
    // }, 1000);
    getGroups();
})
// document.addEventListener('DOMContentLoaded', function (e) {
//     setInterval(async () => {
//         try {
//             getMessages();
//             // const users = await axios.get('http://13.231.254.75:4000/online-user');
//             // joined_div.replaceChildren();
//             // for (let i = 0; i < users.data.length; i++) {
//             //     const div = document.createElement('div');
//             //     div.classList.add('text-center', 'p-0');
//             //     let content = `<span class="badge fw-normal bg-secondary">${users.data[i].name} joined</span>`;
//             //     div.innerHTML = content;
//             //     joined_div.append(div);
//             // }

//             message_div.replaceChildren();
//             let messages = JSON.parse(localStorage.getItem('messages'));
//             for (let i = 0; i < messages.length; i++) {
//                 const div = document.createElement('div');
//                 let time = convertTime(messages[i].createdAt);
//                 if (messages[i].user.name == localStorage.getItem('username')) {
//                     div.classList.add('d-flex', 'p-0', 'w-100', 'justify-content-end', 'pe-2')
//                     div.innerHTML =
//                         `<span class="wrap bg-primary text-white my-2 pb-0 rounded">
//                 ${messages[i].message}
//                 <div class="p-0 m-0 d-flex justify-content-end"><span class="p-0 m-0 fw-bold">${time}</span></div>
//                 </span>`
//                 }
//                 else {
//                     div.classList.add('d-flex', 'justify-content-start', 'p-0', 'w-100', 'mt-2');
//                     div.innerHTML =
//                         `<span class="wrap bg-light rounded pb-0">
//                 <div class="p-0 fw-bold"><span class="p-0">${messages[i].user.name}</span></div>
//                 ${messages[i].message} 
//                 <div class="p-0 m-0 d-flex justify-content-end"><span class="p-0 m-0 fw-bold">${time}</span></div>
//                 </span>`
//                 }
//                 message_div.append(div);
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }, 100);
// })

myform.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        if (message_input.value != '') {
            await axios.post('http://13.231.254.75:4000/send-message', { message: message_input.value, gId: localStorage.getItem('gId') }, { headers: { Authorization: token } });
            await updateLS();
            getMessages();
            updateScroll();
            message_input.value = '';
        }
    } catch (err) {
        console.log(err);
    }
})

group_form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const groupname = group_form.children[1];
    let temp_arr = participants_div.children;
    let participants_list = [];
    let flag = false;
    for (let i = 0; i < temp_arr.length; i++) {
        if (temp_arr[i].children[1].checked) {
            participants_list.push(temp_arr[i].children[1].value);
            flag = true;
        }
    }
    if (flag && groupname.value != '') {
        const group = await axios.post('http://13.231.254.75:4000/create-group', { groupname: groupname.value, participants: participants_list }, { headers: { Authorization: token } });
        document.getElementById('create_group_div').classList.toggle("hide");
        getGroups();
        groupname.value = '';
        for (let i = 0; i < temp_arr.length; i++) {
            if (temp_arr[i].children[1].checked) {
                temp_arr[i].children[1].checked = false;
            }
        }
        localStorage.setItem(group.data.group_details.id, JSON.stringify([]));
    }
    else if (!flag) {
        alert('Please select atleast one member for the group');
    }
    else {
        alert('Please enter a name for the group');
    }
})

participants_div.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('group_participants')) {
        e.target.children[1].checked = !e.target.children[1].checked;
    }
})

add_member_div.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('group_participants2')) {
        e.target.children[1].checked = !e.target.children[1].checked;
    }
})

createGroupBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    participants_div.replaceChildren();
    const users = await axios.get('http://13.231.254.75:4000/users', { headers: { Authorization: token } });
    if (users.data.length > 0) {
        for (let i = 0; i < users.data.length; i++) {
            const div = document.createElement('div');
            div.classList.add('group_participants', 'd-flex', 'justify-content-between');
            div.innerHTML =
                `<label for="${users.data[i].id}">${users.data[i].name}</label>
            <input type="checkbox" class="me-2" id="${users.data[i].id}" name="${users.data[i].name}" value="${users.data[i].id}">`
            participants_div.append(div);
        }
    }
    else {
        const div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-center', 'fw-bold', 'align-items-center', 'm-0', 'h-100');
        div.innerHTML = `<span>NO USERS YET</span>`
        participants_div.append(div);
    }
    document.getElementById('create_group_div').classList.toggle("hide");
    if (!document.getElementById('add_member_parentdiv').classList.contains("hide")) {
        document.getElementById('add_member_parentdiv').classList.toggle("hide");
    }
    if (!document.getElementById('show_member_parentdiv').classList.toggle("hide")) {
        document.getElementById('show_member_parentdiv').classList.toggle("hide");
    }
})

// async function getMessages(gid) {
//     try {
//         let last_message_id;
//         let old_messages = JSON.parse(localStorage.getItem('messages'));
//         if (old_messages.length > 0) {
//             last_message_id = old_messages[old_messages.length - 1].id;
//         }
//         if (old_messages.length > 10) {
//             for (let i = 0; i < old_messages.length / 2; i++) {
//                 old_messages.shift();
//                 localStorage.setItem('messages', JSON.stringify(old_messages));
//             }
//         }
//         const result = await axios.get(`http://13.231.254.75:4000/get-messages?id=${last_message_id}&gid=${gid}`, { headers: { Authorization: token } });
//         if (result.data.length > 0) {
//             let new_messages = old_messages.concat(result.data);
//             localStorage.setItem('messages', JSON.stringify(new_messages));
//         }
//         // console.log(JSON.parse(localStorage.getItem('messages')));
//     } catch (err) {
//         console.log(err);
//     }
// }

function getMessages() {
    try {
        const group = localStorage.getItem("gId");
        let arr = JSON.parse(localStorage.getItem(group));
        if (arr.length > 10) {
            for (let i = 0; i < arr.length / 2; i++) {
                arr.shift();
                localStorage.setItem(group, JSON.stringify(arr));
            }
        }
        message_div.replaceChildren();
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                const div = document.createElement('div');
                let time = convertTime(arr[i].createdAt);
                if (arr[i].user.name == localStorage.getItem('username')) {
                    div.classList.add('d-flex', 'p-0', 'w-100', 'justify-content-end', 'pe-2')
                    div.innerHTML =
                        `<span class="wrap bg-primary text-white my-2 pb-0 rounded">
            ${arr[i].message}
            <div class="p-0 m-0 d-flex justify-content-end"><span class="p-0 m-0 fw-bold">${time}</span></div>
            </span>`
                }
                else {
                    div.classList.add('d-flex', 'justify-content-start', 'p-0', 'w-100', 'mt-2');
                    div.innerHTML =
                        `<span class="wrap bg-light rounded pb-0">
            <div class="p-0 fw-bold"><span class="p-0">${arr[i].user.name}</span></div>
            ${arr[i].message} 
            <div class="p-0 m-0 d-flex justify-content-end"><span class="p-0 m-0 fw-bold">${time}</span></div>
            </span>`
                }
                message_div.append(div);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function updateLS() {
    let last_message_id;
    let group = localStorage.getItem("gId");
    if (group != "") {
        let arr = JSON.parse(localStorage.getItem(group));
        let messages_arr;
        if (arr.length == 0) {
            last_message_id = 0;
            const messages = await axios.get(`http://13.231.254.75:4000/get-messages?gId=${localStorage.getItem("gId")}&last_message_id=${last_message_id}`, { headers: { Authorization: token } });
            messages_arr = arr.concat(messages.data);
            localStorage.setItem(group, JSON.stringify(messages_arr));
        }
        else {
            last_message_id = arr[arr.length - 1].id;
            const messages = await axios.get(`http://13.231.254.75:4000/get-messages?gId=${localStorage.getItem("gId")}&last_message_id=${last_message_id}`, { headers: { Authorization: token } });
            messages_arr = arr.concat(messages.data);
            localStorage.setItem(group, JSON.stringify(messages_arr));
        }
    }
}

function convertTime(time) {
    let time_indicator = 'am';
    let hour = parseInt(time.slice(11, 13));
    if (hour >= 12 && hour < 24) {
        time_indicator = 'pm';
        if (hour > 12) {
            hour = hour - 12;
        }
    }
    const minutes = time.slice(13, 16);
    return `${hour}${minutes} ${time_indicator}`;
}

function updateScroll() {
    message_div.scrollTop = message_div.scrollHeight;
}

function close_div() {
    document.getElementById('create_group_div').classList.toggle("hide");
}

function close_div2() {
    document.getElementById('add_member_parentdiv').classList.toggle("hide");
}

function close_div3() {
    document.getElementById('show_member_parentdiv').classList.toggle("hide");
}

document.getElementById('add_member_form').addEventListener('submit', async function (e) {
    e.preventDefault();
    let temp_arr = add_member_div.children;
    let participants_list = [];
    let flag = false;
    for (let i = 0; i < temp_arr.length; i++) {
        if (temp_arr[i].children[1].checked) {
            participants_list.push(temp_arr[i].children[1].value);
            flag = true;
        }
    }
    if (flag) {
        try {
            const result = await axios.post('http://13.231.254.75:4000/update-group', { gId: localStorage.getItem("gId"), participants: participants_list }, { headers: { Authorization: token } });
            for (let i = 0; i < temp_arr.length; i++) {
                if (temp_arr[i].children[1].checked) {
                    temp_arr[i].children[1].checked = false;
                }
            }
            document.getElementById('add_member_parentdiv').classList.toggle("hide");
        }
        catch (err) {
            console.log(err);
        }
    }
    else if (!flag) {
        alert('Please select atleast one member');
    }
})

async function addMember() {
    try {
        const add_member_div = document.getElementById('add_member_div');
        document.getElementById('add_member_div').replaceChildren();
        const users = await axios.get(`http://13.231.254.75:4000/non-members?gId=${localStorage.getItem("gId")}`, { headers: { Authorization: token } });
        if (users.data.length > 0) {
            for (let i = 0; i < users.data.length; i++) {
                const div = document.createElement('div');
                div.classList.add('group_participants2', 'd-flex', 'justify-content-between');
                div.innerHTML =
                    `<label for="${users.data[i].id}">${users.data[i].name}</label>
            <input type="checkbox" id="${users.data[i].id}" class="me-2" title="${users.data[i].email}" name="${users.data[i].name}" value="${users.data[i].id}">`
                add_member_div.append(div);
            }
        }
        else {
            const div = document.createElement('div');
            div.classList.add('no_users', 'mt-2');
            div.innerHTML = `<h2 class="text-center">No users to add</h2>`
            add_member_div.append(div);
        }
        document.getElementById('add_member_parentdiv').classList.toggle("hide");
    } catch (err) {
        alert("Access denied! You must be an admin to add members.");
    }
    if (!document.getElementById('show_member_parentdiv').classList.contains("hide")) {
        document.getElementById('show_member_parentdiv').classList.toggle("hide");
    }
    if (!document.getElementById('create_group_div').classList.toggle("hide")) {
        document.getElementById('create_group_div').classList.toggle("hide");
    }
}

async function showMember() {
    document.getElementById('show_member_div').replaceChildren();
    const users = await axios.get(`http://13.231.254.75:4000/members?gId=${localStorage.getItem("gId")}`, { headers: { Authorization: token } });
    const div = document.createElement('div');
    div.classList.add('group_participants2', 'd-flex', 'justify-content-between', 'mt-0', 'members');
    div.innerHTML =
        `<span class="me-2">You</span>
            <span class="options d-flex align-items-center">
        </span>`
    show_member_div.append(div);
    for (let i = 0; i < users.data.length; i++) {
        const div = document.createElement('div');
        div.classList.add('group_participants2', 'd-flex', 'justify-content-between', 'mt-0', 'members');
        div.title = users.data[i].email;
        div.innerHTML =
            `<span class="me-2">${users.data[i].name}</span>
            <span class="options d-flex align-items-center">
            <div class="rounded mx-2">
                <button class="dropdownbtn" type="button" id="dropdownMenuButton"
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src="../css/images/options.png" class="chat_item_img3">
                </button>
                <div class="dropdown-menu" id="${users.data[i].id}" aria-labelledby="dropdownMenuButton">
                    <button class="dropdown-item">Make admin</button>
                    <button class="dropdown-item">Remove member</button>
                </div>
            </div>
        </span>`
        show_member_div.append(div);
        let makeAdmin = (div.children[1].children[0]).children[1].children[0];
        let removeMember = (div.children[1].children[0]).children[1].children[1];
        makeAdmin.addEventListener('click', async function (e) {
            e.preventDefault();
            try {
                await axios.post('http://13.231.254.75:4000/make-admin', { gId: localStorage.getItem("gId"), user: (div.children[1].children[0]).children[1].id }, { headers: { Authorization: token } });
                alert('This user is an admin now!');
            } catch (err) {
                if (err.response.status == '400') {
                    alert('This user is already an admin!');
                }
                else if (err.response.status == '401') {
                    alert('Access denied! You must be an admin to access this feature.');
                }
                else {
                    console.log('Something went wrong');
                }
            }
        })
        removeMember.addEventListener('click', async function (e) {
            e.preventDefault();
            try {
                await axios.post('http://13.231.254.75:4000/remove-user', { gId: localStorage.getItem("gId"), user: (div.children[1].children[0]).children[1].id }, { headers: { Authorization: token } });
                updateUsers();
            } catch (err) {
                alert('Access denied! You must be an admin to access this feature.');
            }
        })
    }
    document.getElementById('show_member_parentdiv').classList.toggle("hide");
    if (!document.getElementById('add_member_parentdiv').classList.contains("hide")) {
        document.getElementById('add_member_parentdiv').classList.toggle("hide");
    }
    if (!document.getElementById('create_group_div').classList.toggle("hide")) {
        document.getElementById('create_group_div').classList.toggle("hide");
    }
}

async function updateUsers() {
    const show_member_div = document.getElementById('show_member_div');
    document.getElementById('show_member_div').replaceChildren();
    const users = await axios.get(`http://13.231.254.75:4000/members?gId=${localStorage.getItem("gId")}`, { headers: { Authorization: token } });
    const div = document.createElement('div');
    div.classList.add('group_participants2', 'd-flex', 'justify-content-between', 'mt-0', 'members');
    div.innerHTML =
        `<span class="me-2">You</span>
            <span class="options d-flex align-items-center">
        </span>`
    show_member_div.append(div);
    for (let i = 0; i < users.data.length; i++) {
        const div = document.createElement('div');
        div.classList.add('group_participants2', 'd-flex', 'justify-content-between', 'mt-0', 'members');
        div.title = users.data[i].email;
        div.innerHTML =
            `<span class="me-2">${users.data[i].name}</span>
            <span class="options d-flex align-items-center">
            <div class="rounded mx-2">
                <button class="dropdownbtn" type="button" id="dropdownMenuButton"
                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src="../css/images/options.png" class="chat_item_img3">
                </button>
                <div class="dropdown-menu" id="${users.data[i].id}" aria-labelledby="dropdownMenuButton">
                    <button class="dropdown-item">Make admin</button>
                    <button class="dropdown-item">Remove member</button>
                </div>
            </div>
        </span>`
        show_member_div.append(div);
    }
}

async function getGroups() {
    const groups = await axios.get('http://13.231.254.75:4000/groups', { headers: { Authorization: token } });
    const chat_div = document.getElementById('chat_div');
    let current = null;
    const group_header = document.getElementById('group_header');
    chat_div.replaceChildren();
    for (let i = 0; i < groups.data.length; i++) {
        if (!localStorage.getItem(groups.data[i].id)) {
            localStorage.setItem(groups.data[i].id, JSON.stringify([]));
        }
        const div = document.createElement('div');
        div.classList.add('chat_item', 'd-flex', 'justify-content-between', 'align-items-center');
        div.id = groups.data[i].id;
        div.name = groups.data[i].name;
        div.innerHTML = `<span><img src="../css/images/group.png" class="chat_item_img">${groups.data[i].name}</span><span class="group_options p-3"><img src="../css/images/options.png" class="chat_item_img3"></span>`
        chat_div.append(div);
        div.addEventListener('click', async function (e) {
            e.preventDefault();
            if (current) {
                current.classList.remove('highlight');
            }
            current = this;
            this.classList.add('highlight');
            myform.parentElement.classList.remove('hide');
            localStorage.setItem("gId", `${div.id}`);
            group_header.replaceChildren();
            group_header.innerHTML =
                `<div class="px-2 py-0 w-100 text-white fw-bold rounded d-flex justify-content-between">
                            <span>
                                <img src="../css/images/group.png" class="chat_item_img2">
                                <span>${div.name}</span>
                            </span>
                            <span class="options d-flex align-items-center">
                                <!-- <img src="../css/images/options.png" class="chat_item_img3"> -->
                                <div class="rounded mx-2">
                                    <button class="dropdownbtn" type="button" id="dropdownMenuButton"
                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src="../css/images/options.png" class="chat_item_img3">
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <button class="dropdown-item text-white" onclick="addMember()">Add members</button>
                                        <button class="dropdown-item text-white" onclick="showMember()">Show members</button>
                                    </div>
                                </div>
                            </span>
                        </div>`
            await updateLS();
            getMessages();
            setInterval(async () => {
                await updateLS();
                getMessages();
            }, 1000);
            if (!document.getElementById('add_member_parentdiv').classList.contains("hide")) {
                document.getElementById('add_member_parentdiv').classList.toggle("hide");
            }
            if (!document.getElementById('show_member_parentdiv').classList.toggle("hide")) {
                document.getElementById('show_member_parentdiv').classList.toggle("hide");
            }
            if (!document.getElementById('create_group_div').classList.toggle("hide")) {
                document.getElementById('create_group_div').classList.toggle("hide");
            }
        })
    }
}

add_member_searchbar.addEventListener('input', function (e) {
    const filter = add_member_searchbar.value.toLowerCase();
    const resultElements = add_member_div.getElementsByTagName("div");
    // console.log(resultElements[0].children[0].textContent)
    for (let i = 0; i < resultElements.length; i++) {
        const result = resultElements[i];
        if (result.children[0].textContent.toLowerCase().indexOf(filter) > -1) {
            result.children[0].style.display = "";
            result.children[1].style.display = "";
        } else {
            result.children[0].style.display = "none";
            result.children[1].style.display = "none";
        }
    }
})

show_member_searchbar.addEventListener('input', function (e) {
    const filter = show_member_searchbar.value.toLowerCase();
    const resultElements = show_member_div.getElementsByClassName("members");
    // console.log(resultElements[0])
    // for(let i=0; i<resultElements.length; i++){
    //     console.log(resultElements[i])
    // }
    // console.log(resultElements.length)
    // console.log(resultElements[0].children[0].textContent)
    for (let i = 1; i < resultElements.length; i++) {
        const result = resultElements[i];
        // console.log(result.children[0])
        // console.log(result.children[1].children[0])
        if (result.children[0].textContent.toLowerCase().indexOf(filter) > -1) {
            result.children[0].style.display = "";
            result.children[1].children[0].style.display = "";
        } else {
            result.children[0].style.display = "none";
            result.children[1].children[0].style.display = "none";
        }
    }
})