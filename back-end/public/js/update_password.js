const myform = document.getElementById('myform');
const new_password = document.getElementById('password');

myform.addEventListener('submit', function(e){
    e.preventDefault();
    axios.post('http://localhost:4000/password/update-password', {new_password: new_password.value})
    .then(res=>{
        alert('Password updated successfully!');
        new_password.value = '';
        // window.location.href = 'file:\\\C:\Users\hrith\Desktop\Practice\front-end\html\login.html';
    })
    .catch(err=>console.log(err));
})