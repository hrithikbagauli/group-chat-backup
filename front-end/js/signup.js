const myform = document.getElementById('myform')
const inputs = document.querySelectorAll('input');
const alert_div = document.getElementById('alert_div');

myform.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = inputs[0];
    const email = inputs[1];
    const phone = inputs[2];
    const password = inputs[3];
    let flag = false;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value == '') {
            alert_div.classList.add('alert-danger');
            alert_div.innerHTML = 'Please enter all the fields!';
            alert_div.classList.toggle('hide');
            setTimeout(() => {
                alert_div.classList.toggle('hide');
                alert_div.classList.remove('alert-danger');
            }, 2000);
            flag = true;
            break;
        }
    }
    if (!flag && password.value.length >= 6 && phone.value.length == 10) {
        axios.post('http://13.231.254.75:4000/user-signup', { name: username.value, password: password.value, email: email.value, phone: phone.value })
            .then(() => {
                alert_div.innerHTML = 'Account created successfully!'
                alert_div.classList.add('alert-success');
                alert_div.classList.toggle('hide');
                setTimeout(() => {
                    alert_div.classList.toggle('hide');
                    alert_div.classList.remove('alert-success');
                    window.location.href = "../html/index.html";
                }, 1000);
            })
            .catch((res) => {
                console.log(res)
                alert_div.innerHTML = 'This user already exists!'
                alert_div.classList.add('alert-danger');
                alert_div.classList.toggle('hide');
                setTimeout(() => {
                    alert_div.classList.toggle('hide');
                    alert_div.classList.remove('alert-danger');
                }, 2000);
            });
    }
})