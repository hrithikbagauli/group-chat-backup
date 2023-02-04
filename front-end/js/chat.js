const myform = document.getElementById('myform');
const message_input = document.querySelector('.message');
const message_div = document.getElementById('message_div');
const group_form = document.getElementById('group_form');
let token = localStorage.getItem('token');
const createGroupBtn = document.getElementById('createGroupBtn');
const participants_div = document.getElementById('participants_div');

// if (!localStorage.getItem('messages')) {
//     localStorage.setItem('messages', JSON.stringify([]));
// }
localStorage.setItem("gId", "");
document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    setInterval(() => {
        getMessages();
    }, 1000);
    getGroups();
})
// document.addEventListener('DOMContentLoaded', function (e) {
//     setInterval(async () => {
//         try {
//             getMessages();
//             // const users = await axios.get('http://localhost:4000/online-user');
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
            await axios.post('http://localhost:4000/send-message', { message: message_input.value, gId: localStorage.getItem('gId') }, { headers: { Authorization: token } });
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
        await axios.post('http://localhost:4000/create-group', { groupname: groupname.value, participants: participants_list }, { headers: { Authorization: token } });
        document.getElementById('create_group_div').classList.toggle("hide");
        getGroups();
        groupname.value = '';
        for (let i = 0; i < temp_arr.length; i++) {
            if (temp_arr[i].children[1].checked) {
                temp_arr[i].children[1].checked = false;
            }
        }
    }
    else if (!flag) {
        alert('Please select atleast one member for the group');
    }
    else {
        alert('Please enter a name for the group');
    }
})

participants_div.addEventListener('click', function (e) {
    if (e.target.classList.contains('group_participants')) {
        e.target.children[1].checked = !e.target.children[1].checked;
    }
})

createGroupBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    participants_div.replaceChildren();
    const users = await axios.get('http://localhost:4000/users', { headers: { Authorization: token } });
    for (let i = 0; i < users.data.length; i++) {
        const div = document.createElement('div');
        div.classList.add('group_participants', 'd-flex', 'justify-content-between');
        div.innerHTML =
            `<label for="${users.data[i].id}">${users.data[i].name}</label>
        <input type="checkbox" class="me-2" id="${users.data[i].id}" name="${users.data[i].name}" value="${users.data[i].id}">`
        participants_div.append(div);
    }
    document.getElementById('create_group_div').classList.toggle("hide");
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
//         const result = await axios.get(`http://localhost:4000/get-messages?id=${last_message_id}&gid=${gid}`, { headers: { Authorization: token } });
//         if (result.data.length > 0) {
//             let new_messages = old_messages.concat(result.data);
//             localStorage.setItem('messages', JSON.stringify(new_messages));
//         }
//         // console.log(JSON.parse(localStorage.getItem('messages')));
//     } catch (err) {
//         console.log(err);
//     }
// }

async function getMessages() {
    const messages = await axios.get(`http://localhost:4000/get-messages?gId=${localStorage.getItem("gId")}`, { headers: { Authorization: token } });

    message_div.replaceChildren();
    for (let i = 0; i < messages.data.length; i++) {
        const div = document.createElement('div');
        let time = convertTime(messages.data[i].createdAt);
        if (messages.data[i].user.name == localStorage.getItem('username')) {
            div.classList.add('d-flex', 'p-0', 'w-100', 'justify-content-end', 'pe-2')
            div.innerHTML =
                `<span class="wrap bg-primary text-white my-2 pb-0 rounded">
                ${messages.data[i].message}
                <div class="p-0 m-0 d-flex justify-content-end"><span class="p-0 m-0 fw-bold">${time}</span></div>
                </span>`
        }
        else {
            div.classList.add('d-flex', 'justify-content-start', 'p-0', 'w-100', 'mt-2');
            div.innerHTML =
                `<span class="wrap bg-light rounded pb-0">
                <div class="p-0 fw-bold"><span class="p-0">${messages.data[i].user.name}</span></div>
                ${messages.data[i].message} 
                <div class="p-0 m-0 d-flex justify-content-end"><span class="p-0 m-0 fw-bold">${time}</span></div>
                </span>`
        }
        message_div.append(div);
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

async function getGroups() {
    const groups = await axios.get('http://localhost:4000/groups', { headers: { Authorization: token } });
    const chat_div = document.getElementById('chat_div');
    let current = null;
    chat_div.replaceChildren();
    for (let i = 0; i < groups.data.length; i++) {
        const div = document.createElement('div');
        div.classList.add('chat_item');
        div.id = groups.data[i].id;
        div.innerHTML = `<img src="../css/images/group.png" class="chat_item_img">${groups.data[i].name}`
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
            getMessages();
        })
    }
}