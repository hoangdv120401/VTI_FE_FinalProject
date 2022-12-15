function registerAccount() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("psw").value;
    var rep_password = document.getElementById("psw-repeat").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    if (password !== rep_password) {
        showValidPassword();
        return;
    }
    var registerRequest = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    }
    resetValidPassword();
    $.ajax({
        url: 'http://localhost:8080/api/v1/auth/register',
        type: 'POST',
        data: JSON.stringify(registerRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        success: function (data, textStatus, xhr) {
            showSuccess("Đăng ký thành công tài khoản: " + data.username);
            resetValidUsername();
            resetFormRegister();
            
        },
        error(jqXHR, textStatus, errorThrown) {
            if(jqXHR.status == 400){
                showValidUsername();
            }
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");

        }
    });
}
function showSuccess(content) {
    document.getElementById("content").innerHTML = content;
    $("#alert-success").fadeTo(2000, 500).slideUp(500, function () {
        $("#alert-success").slideUp(500);
    })
}
function showValidPassword() {
    $(".valid-psw").css('display', 'block');
}
function resetValidPassword() {
    $(".valid-psw").css('display', 'none');
}
function resetFormRegister() {
    document.getElementById("username").value = "";
    document.getElementById("psw").value = "";
    document.getElementById("psw-repeat").value ="";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value ="";
}
function showValidUsername(){
    $("#valid-username").css('display', 'block');
}
function resetValidUsername() {
    $("#valid-username").css('display', 'none');
}
function backToLogin(){
    window.location.replace("http://127.0.0.1:5500/html/login.html");
}
