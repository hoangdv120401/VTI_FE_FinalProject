
$(function () {
    if(!isLogin()){
        window.location.replace("http://127.0.0.1:5500/html/login.html");
    }
    $(".header").load("header.html", function(){
        document.getElementById("fullName").innerHTML = storage.getItem("FIRSTNAME") + " " + storage.getItem("LASTNAME");
        if(storage.getItem("ROLE") == "MANAGER" || storage.getItem("ROLE") == "EMPLOYEE"){
            document.getElementById("viewListEm").style.display = "none";
            document.getElementById("viewListDept").style.display = "none"
        }
    });
    $(".main").load("home.html");
    $(".footer").load("footer.html");
   
})
function onClickNavHome() {
    $(".main").load("home.html");
}
function isLogin(){
    if(storage.getItem("ID")){
        return true;
    }
    return false;
}
function logout(){

    storage.removeItem("ID");
    storage.removeItem("USERNAME");
    storage.removeItem("PASSWORD");
    storage.removeItem("FIRSTNAME");
    storage.removeItem("LASTNAME");
    storage.removeItem("ROLE");
    window.location.replace("http://127.0.0.1:5500/html/login.html");
}