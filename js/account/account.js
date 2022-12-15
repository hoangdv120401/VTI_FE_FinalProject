
function onClickEmployee() {
    $(".main").load("employee/viewListEmployee.html", function () {
        buildEmployeeTable();
    });
}
function showSuccessAlert(content) {
    document.getElementById("content").innerHTML = content;
    $("#alert-success").fadeTo(2000, 500).slideUp(500, function () {
        $("#alert-success").slideUp(500);
    })
}
function buildEmployeeTable() {
    $('tbody').empty();
    // resetSearchEm();
    // resetPageEm();
    resetCheckBoxEm();
    // resetSortEm();
    getListEmployee();
}
var employees = [];
// phân trang
var currentPage = 1;
var size = 4;

// sắp xếp
var sortFieldEm = "id";
var isAsc = false;

var departmentList = [];
var headers = {
    "Authorization": "Basic " + btoa(storage.getItem("USERNAME")+ ":" + storage.getItem("PASSWORD"))
}
function getListEmployee() {
    var url = "http://localhost:8080/api/v1/accounts";
    url += "?page=" + currentPage + "&size=" + size;
    var searchEm = (document.getElementById("contentSearchEm") == null ? "" : document.getElementById("contentSearchEm").value);
    url += "&search.contains=" + searchEm;
    url += "&sort=" + sortFieldEm + "," + (isAsc ? "asc" : "desc");
    $.ajax({
        url: url,
        type: 'GET',
        // data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            employees = [];
            employees = data.content;
            fillEmployeeTable();
            pageEmployeeTable(data.totalPages);
            renderSortUIEm();
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status);
            if(jqXHR.status == 403){
                window.location.href == "http://127.0.0.1:5500/html/forbidden.html";
            }
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");

        }
    });

}
function fillEmployeeTable() {
    employees.forEach(function (item, index) {
        $('tbody').append(
            '<tr>'
            + '<td><input type="checkbox" id="check-' + index + '" name="checkItem"  onclick="onClickCheckItem()"></td>'
            + '<td>' + item.username + '</td>'
            + '<td>' + item.fullName + '</td>'
            + '<td>' + item.role + '</td>'
            + '<td>' + (item.department == null ? "null" : item.department.name) + '</td>' +
            '<td>' +
            '<a class= "edit" title = "Edit" data-toggle="tooltip" onclick="openUpdateEmModal(' + item.id + ')"><i class="material-icons">&#xE254;</i></a >' +
            '<a class="delete" title="Delete" data-toggle="tooltip" onclick="openConfirmDeleteEm(' + item.id + ')"><i class="material-icons">&#xE872;</i></a>' +
            '</td>' +
            '</tr>'
        )
    });
}
//tìm kiếm
function handleSearchEm() {
    buildEmployeeTable();
}
// phân trang
function pageEmployeeTable(totalPage) {
    var str = "";
    if (totalPage > 1 && currentPage > 1) {
        str += '<li class="page-item">' +
            '<a class="page-link" href="#" onclick="prevPageEm()">Previous</a>' +
            '</li>';
    }
    for (i = 0; i < totalPage; i++) {
        str += '<li class="page-item ' + (currentPage == (i + 1) ? "active" : "") + '" ><a class="page-link" href="#" onclick="changePageEm(' + (i + 1) + ')">' + (i + 1) + '</a></li>';
    }
    if (totalPage > 1 && currentPage < totalPage) {
        str += '<li class="page-item"><a class="page-link" href="#" onclick="nextPageEm()">Next</a></li>';
    }
    $('#pagination').empty();
    $('#pagination').append(str);
}
// phân trang
function changePageEm(pageIndex) {
    resetCheckBoxEm();
    if (currentPage == pageIndex) {
        return;
    }
    currentPage = pageIndex;
    buildEmployeeTable();
}
// phân trang
function prevPageEm() {
    resetCheckBoxEm();
    changePageEm(currentPage - 1);
}
// phân trang
function nextPageEm() {
    resetCheckBoxEm();
    changePageEm(currentPage + 1);
}
function showModal() {
    $("#myModal").modal("show");
}
function hideModal() {
    $("#myModal").modal("hide");
}
function openAddModal() {
    resetValidateUsernameEm();
    resetModalEm();
    renderSelectDeptEm();
    showModal();
}
function addEmployee() {
    var password = "123456";
    var username = document.getElementById("username").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var role = document.getElementById("role").value;
    var departmentId = document.getElementById("departmentId").value;
    resetValidateInputEm("valUsernameEm");
    if(username === ""){
        valdidateInputEm("This field cannot be blank", "valUsernameEm");
        return;
    }
    resetValidateInputEm("valid-firstName");
    if(firstName === ""){
        valdidateInputEm("This field cannot be blank", "valid-firstName");
        return;
    }
    resetValidateInputEm("valid-lastName");
    if(lastName === ""){
        valdidateInputEm("This field cannot be blank", "valid-lastName");
        return;
    }
    resetValidateInputEm("valid-department");
    if(departmentId === ""){
        valdidateInputEm("Please choose a department", "valid-department");
        return;
    }
    var account = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
        departmentId: departmentId
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts',
        type: 'POST',
        data: JSON.stringify(account),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            hideModal();

            // Do something with the result
            showSuccessAlert("Thêm mới tài khoản: " + data.username + " thành công");
            resetPageEm();
            resetCheckBoxEm();
            resetSortEm();
            resetSearchEm();
            buildEmployeeTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 400) {
                validateUsernameEm("username is existed!!!");
            }
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function valdidateInputEm(str, id){
    document.getElementById(id).innerHTML = str;
    document.getElementById(id).style.display = "block";
    
}
function resetValidateInputEm(id){
    document.getElementById(id).style.display = "none";
}
// mở cập nhật modal
function openUpdateEmModal(id) {
    renderSelectDeptEm();
    fillSelectDeptEm();
    renderAccUpdate(id);
    showModal();
}
function renderAccUpdate(id) {
    $.ajax({
        url: "http://localhost:8080/api/v1/accounts/" + id,
        type: 'GET',
        // data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            document.getElementById("id").value = data.id;
            document.getElementById("username").value = data.username;
            document.getElementById("firstName").value = data.firstName;
            document.getElementById("lastName").value = data.lastName;
            document.getElementById("role").value = data.role;
            data.department === null ? document.getElementById("departmentId").value = "" : document.getElementById("departmentId").value = data.department.id;
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");

        }
    });

}
// cập nhật tài khoản
function updateEmployee() {
    var id = document.getElementById("id").value;
    var password = "123456";
    var username = document.getElementById("username").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var role = document.getElementById("role").value;
    var departmentId = document.getElementById("departmentId").value;
    resetValidateInputEm("valUsernameEm");
    if(username === ""){
        valdidateInputEm("This field cannot be blank", "valUsernameEm");
        return;
    }
    resetValidateInputEm("valid-firstName");
    if(firstName === ""){
        valdidateInputEm("This field cannot be blank", "valid-firstName");
        return;
    }
    resetValidateInputEm("valid-lastName");
    if(lastName === ""){
        valdidateInputEm("This field cannot be blank", "valid-lastName");
        return;
    }
    resetValidateInputEm("valid-department");
    if(departmentId === ""){
        valdidateInputEm("Please choose a department", "valid-department");
        return;
    }
    var account = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
        departmentId: departmentId
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/' + id,
        type: 'PUT',
        data: JSON.stringify(account),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            hideModal();

            // Do something with the result
            showSuccessAlert("Cập nhật tài khoản: " + data.username + " thành công");
            resetPageEm();
            resetCheckBoxEm();
            resetSortEm();
            resetSearchEm();
            buildEmployeeTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}
// lưu account
function save() {
    var id = document.getElementById("id").value;
    if (id == null || id == "") {
        addEmployee();
    } else {
        updateEmployee();
    }

}
// mở confirm delete
function openConfirmDeleteEm(id) {
    var index = employees.findIndex(x => x.id == id);
    var result = confirm("do you want to delete " + employees[index].username + " ?");
    if (result) {
        deleteEmployee(id);
    }
}
// xóa tài khoản
function deleteEmployee(id) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/' + id,
        type: 'DELETE',
        contentType: "application/json",
        dataType: "json",
        headers: headers,// du lieu tra ve
        success: function (data, textStatus, xhr) {
            // var name = data.name;
            // // Do something with the result
            showSuccessAlert("Xóa thành công tài khoản " + data.username);
            resetPageEm();
            resetCheckBoxEm();
            resetSortEm();
            resetSearchEm();
            buildEmployeeTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
// xóa nhiều tài khoản cùng lúc
function deleteAllAccounts() {
    var ids = [];
    var i = 0;
    var usernames = [];
    while (true) {
        var checkBoxItem = document.getElementById("check-" + i);
        if (checkBoxItem != undefined || checkBoxItem != null) {
            if (checkBoxItem.checked) {
                ids.push(employees[i].id);
                usernames.push(employees[i].username)
            }
            i++;
        } else {
            break;
        }
    }
    var result = confirm("want to delete " + usernames);
    if (result) {
        // call api
        $.ajax({
            url: 'http://localhost:8080/api/v1/accounts?ids=' + ids,
            type: 'DELETE',
            contentType: "application/json",
            dataType: "json",
            headers: headers,// du lieu tra ve
            success: function (data, textStatus, xhr) {
                usernames = []
                data.forEach(function (item) {
                    usernames.push(item.username);
                })
                // Do something with the result
                showSuccessAlert("Xóa thành công tài khoản: " + usernames);
                resetPageEm();
                resetCheckBoxEm();
                resetSortEm();
                resetSearchEm();
                buildEmployeeTable();

            },
            error(jqXHR, textStatus, errorThrown) {
                // alert("error");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
}
function onClickDelAllAcc() {
    var checkAllAcc = document.getElementById("check-all");
    var i = 0;
    if (checkAllAcc.checked) {
        while (true) {
            var checkBoxItem = document.getElementById("check-" + i);
            if (checkBoxItem != undefined || checkBoxItem != null) {
                checkBoxItem.checked = true;
                i++;
            } else {
                break;
            }
        }
    } else {
        while (true) {
            var checkBoxItem = document.getElementById("check-" + i);
            if (checkBoxItem != undefined || checkBoxItem != null) {
                checkBoxItem.checked = false;
                i++;
            } else {
                break;
            }
        }
    }
}
// onclick delete item
function onClickCheckItem() {
    var checkAllAcc = document.getElementById("check-all");
    var i = 0;
    while (true) {
        var checkBoxItem = document.getElementById("check-" + i);
        if (checkBoxItem != undefined || checkBoxItem != null) {
            if (checkBoxItem.checked == false) {
                checkAllAcc.checked = false;
                return;
            }
            i++;
        } else {
            break;
        }
    }
    checkAllAcc.checked = true;
}
// sort
function sortByFieldEm(field) {
    if (field == sortFieldEm) {
        isAsc = !isAsc;
    } else {
        sortFieldEm = field;
        isAsc = true;
    }
    buildEmployeeTable();
}
// render sort ui
function renderSortUIEm() {
    var sortClass = (isAsc ? "fa-sort-asc" : "fa-sort-desc");
    switch (sortFieldEm) {
        case 'username':
            changeIconRenderEm('heading-username', sortClass);
            changeIconRenderEm('heading-fullName', "fa-sort");
            changeIconRenderEm('heading-role', "fa-sort");
            changeIconRenderEm('heading-departmentId', "fa-sort");
            break;
        case 'fullName':
            changeIconRenderEm('heading-username', "fa-sort");
            changeIconRenderEm('heading-fullName', sortClass);
            changeIconRenderEm('heading-role', "fa-sort");
            changeIconRenderEm('heading-departmentId', "fa-sort");
            break;
        case 'role':
            changeIconRenderEm('heading-username', "fa-sort");
            changeIconRenderEm('heading-fullName', "fa-sort");
            changeIconRenderEm('heading-role', sortClass);
            changeIconRenderEm('heading-departmentId', "fa-sort");
            break;
        case 'departmentId':
            changeIconRenderEm('heading-username', "fa-sort");
            changeIconRenderEm('heading-fullName', "fa-sort");
            changeIconRenderEm('heading-role', "fa-sort");
            changeIconRenderEm('heading-departmentId', sortClass);
            break;
        default:
            changeIconRenderEm('heading-username', "fa-sort");
            changeIconRenderEm('heading-fullName', "fa-sort");
            changeIconRenderEm('heading-role', "fa-sort");
            changeIconRenderEm('heading-departmentId', "fa-sort");
            break;
    }
}
function changeIconRenderEm(idIcon, sortClass) {
    $(document).ready(() => {
        document.getElementById(idIcon).classList.remove("fa-sort", "fa-sort-desc", "fa-sort-asc");
        document.getElementById(idIcon).classList.add(sortClass);
    });
}

function resetPageEm() {
    currentPage = 1;
    size = 4;
}
function resetCheckBoxEm() {
    document.getElementById("check-all").checked = false;
}
function resetModalEm() {
    document.getElementById("id").value = "";
    document.getElementById("username").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("role").value = "EMPLOYEE";
    document.getElementById("departmentId").value = "";
    resetValidateInputEm("valUsernameEm");
    resetValidateInputEm("valid-firstName");
    resetValidateInputEm("valid-lastName");
    resetValidateInputEm("valid-department");
}
function resetSortEm() {
    sortFieldEm = "id";
    isAsc = false;
}
function resetSearchEm() {
    document.getElementById("contentSearchEm").value = "";
}
function resetValidateUsernameEm() {
    $("#valUsernameEm").css("display", "none");
}
function renderSelectDeptEm() {
    $.ajax({
        url: "http://localhost:8080/api/v1/departments",
        type: 'GET',
        // data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            departmentList = [];
            departmentList = data.content;
            // departments = data.content;
            fillSelectDeptEm();
            // fillEmployeeTable();
            // pageEmployeeTable(data.totalPages);
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");

        }
    });
}
function fillSelectDeptEm() {
    $('#departmentId').empty();
    $('#departmentId').append('<option value="">Select one Depaerment</option>');
    departmentList.forEach(function (item) {
        $('#departmentId').append(
            '<option value="' + item.id + '">' + item.name + '</option>'
        )
    });
}
function handleEnterEventEm(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        // Ensure it is only this code that runs
        handleSearchEm();
    }
}
function validateUsernameEm(str) {
    $("#valUsernameEm").html(str);
    $("#valUsernameEm").css("display", "block");
}
