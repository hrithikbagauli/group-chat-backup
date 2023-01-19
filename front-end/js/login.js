const myform = document.getElementById('myform')
const password = document.getElementById('password');
const email = document.getElementById('email');
const alert_div = document.getElementById('alert_div');

myform.addEventListener('submit', function (e) {
    e.preventDefault();

    if (password.value == '' || email.value == '') {
        alert_div.innerHTML = 'Please enter all the fields!'
        alert_div.classList.add('alert-danger');
        alert_div.style.display = 'block';
        setTimeout(() => {
            alert_div.style.display = 'none';
            alert_div.classList.remove('alert-danger');
        }, 3000);
    }
    else {
        axios.post('http://localhost:4000/user-login', { password: password.value, email: email.value })
            .then(res => {
                alert_div.innerHTML = res.data.message;
                alert_div.classList.add('alert-success');
                alert_div.style.display = 'block';
                setTimeout(() => {
                    alert_div.style.display = 'none';
                    alert_div.classList.remove('alert-success');
                }, 2000);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('username', res.data.username);
                window.location.href = "file:///C:/Users/hrith/Desktop/Practice/front-end/html/expense_tracker.html";
            })
            .catch(err => {
                alert_div.innerHTML = err.response.data.message;
                alert_div.classList.add('alert-danger');
                alert_div.style.display = 'block';
                setTimeout(() => {
                    alert_div.style.display = 'none';
                    alert_div.classList.remove('alert-danger');
                }, 2000);
            });
    }

})