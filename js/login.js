// var modal = document.getElementById('id01');

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }
$(function () {
    var isRememberMe = storage.getRememberMe();
    document.getElementById("isRememberMe").checked = isRememberMe;
    document.getElementById('id01').style.display  = 'block';
    resetLogin();

});
function login(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if(username === "" || password === ""){
        loginFail();
    }

    var loginRequest = {
        username: username,
        password: password
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/auth/login',
        type: 'POST',
        data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        success: function (data, textStatus, xhr) {
            var isRememberMe = document.getElementById("isRememberMe").checked;
            storage.saveRememberMe(isRememberMe)

            storage.setItem("ID", data.id);
            storage.setItem("USERNAME", data.username);
            storage.setItem("PASSWORD", password);
            storage.setItem("FIRSTNAME", data.firstName);
            storage.setItem("LASTNAME", data.lastName);
            storage.setItem("ROLE", data.role);
            window.location.replace("http://127.0.0.1:5500/html/program.html");
        },
        error(jqXHR, textStatus, errorThrown) {
            if(jqXHR?.status === 500){
                console.log("login fail");
                loginFail();
            }
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");

        }
    });
}
function resetLogin(){
    document.getElementById("username").value = "";
    document.getElementById("password").value ="";
}
// const resetLogin = () =>{
//     v x
// }
function loginFail(){
    document.getElementById("username").style.border = "solid 1px red";;
    document.getElementById("password").style.border = "solid 1px red";;
    document.getElementById("valid-login").style.display = "block";
}
function handleEnter(event){
    if(event.keyCode === 13){
        event.preventDefault();
        login();
    }
}
function register(){
    window.location.href ="http://127.0.0.1:5500/html/register.html";
}