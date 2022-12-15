function onClickDepartment() {
    $(".main").load("department/viewListDepartment.html", function () {
        buildDepartmentTable();
    });
}
function buildDepartmentTable() {
    $('#tbody-all-dept').empty();
    getListDepartment();
}
var departments = [];
var currentPage = 1;
var size = 4;

var sortField = "id";
var isAsc = false;

var minCreatedDate = "";
var maxCreatedDate = "";
var headers = {
    "Authorization": "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD"))
}
function getListDepartment() {
    var url = "http://localhost:8080/api/v1/departments";
    url += "?page=" + currentPage + "&size=" + size;
    url += "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");
    var search = (document.getElementById("contentSearchDept") == null ? "" : document.getElementById("contentSearchDept").value);
    url += "&search.contains=" + search;
    url += "&createdDate.greaterThanEqual=" + minCreatedDate + "&createdDate.lessThanEqual=" + maxCreatedDate;
    $.ajax({
        url: url,
        type: 'GET',
        // data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            departments = [];
            // if (status == "error") {
            //     alert("lỗi");
            //     return;
            // }
            departments = data.content;
            fillDepartmentTable();
            pageTable(data.totalPages);
            renderSortUI();
        },
        error(jqXHR, textStatus, errorThrown) {
            // if(jqXHR?.status === 500){
            //     console.log("login fail");
            //     loginFail();
            // }
            // alert("error");
            if(jqXHR.status == 403){
                window.location.href == "http://127.0.0.1:5500/html/forbidden.html";
            }
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");

        }
    });
    // $.get(url, function (data, status) {
    //     departments = [];
    //     if (status == "error") {
    //         alert("lỗi");
    //         return;
    //     }
    //     departments = data.content;
    //     fillDepartmentTable();
    //     paegTable(data.totalPages);
    //     renderSortUI();
    // });

}
function pageTable(page) {
    var str = "";
    if (page > 1 && currentPage > 1) {
        str += '<li class="page-item">' +
            '<a class="page-link" href="#" onclick="prevPage()">Previous</a>' +
            '</li>';
    }
    for (i = 0; i < page; i++) {
        str += '<li class="page-item ' + (currentPage == (i + 1) ? "active" : "") + '" ><a class="page-link" href="#" onclick="changePage(' + (i + 1) + ')">' + (i + 1) + '</a></li>';
    }
    if (page > 1 && currentPage < page) {
        str += '<li class="page-item"><a class="page-link" href="#" onclick="nextPage()">Next</a></li>';
    }
    $('#pagination').empty();
    $('#pagination').append(str);
}
function changePage(pageIndex) {
    if (currentPage == pageIndex) {
        return;
    }
    currentPage = pageIndex;
    buildDepartmentTable();
}
function prevPage() {
    changePage(currentPage - 1);
}
function nextPage() {
    changePage(currentPage + 1);
}
function resetPage() {
    currentPage = 1;
    size = 4;
}
// sort
function sortByField(field) {
    if (field == sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    resetSearch();
    buildDepartmentTable();
}
function resetSort() {
    sortField = "id";
    isAsc = false;
}
// render sort ui
function renderSortUI() {
    var sortClass = (isAsc ? "fa-sort-asc" : "fa-sort-desc");
    switch (sortField) {
        case 'name':
            changeIconRender('heading-name', sortClass);
            changeIconRender('heading-totalMember', "fa-sort");
            changeIconRender('heading-type', "fa-sort");
            changeIconRender('heading-createdDate', "fa-sort");
            break;
        case 'totalMember':
            changeIconRender('heading-name', "fa-sort");
            changeIconRender('heading-totalMember', sortClass);
            changeIconRender('heading-type', "fa-sort");
            changeIconRender('heading-createdDate', "fa-sort");
            break;
        case 'type':
            changeIconRender('heading-name', "fa-sort");
            changeIconRender('heading-totalMember', "fa-sort");
            changeIconRender('heading-type', sortClass);
            changeIconRender('heading-createdDate', "fa-sort");
            break;
        case 'createdDate':
            changeIconRender('heading-name', "fa-sort");
            changeIconRender('heading-totalMember', "fa-sort");
            changeIconRender('heading-type', "fa-sort");
            changeIconRender('heading-createdDate', sortClass);
            break;
        default:
            changeIconRender('heading-name', "fa-sort");
            changeIconRender('heading-totalMember', "fa-sort");
            changeIconRender('heading-type', "fa-sort");
            changeIconRender('heading-createdDate', "fa-sort");
            break;
    }
}
function changeIconRender(idIcon, sortClass) {
    document.getElementById(idIcon).classList.remove("fa-sort", "fa-sort-desc", "fa-sort-asc");
    document.getElementById(idIcon).classList.add(sortClass);
}
function fillDepartmentTable() {
    departments.forEach(function (item, index) {
        $('#tbody-all-dept').append(
            '<tr>'
            + '<td><input type="checkbox" id="check-' + index + '" name="checkItem"  onclick="onClickCheckItem()"></td>'
            + '<td>' + item.name + '</td>'
            + '<td>' + item.totalMember + '</td>'
            + '<td>' + item.type + '</td>'
            + '<td>' + item.createdDate + '</td>' +
            '<td>' +
            '<a class= "edit" title = "Edit" data-toggle="tooltip" onclick="openUpdateDeptModal(' + item.id + ')"><i class="material-icons">&#xE254;</i></a >' +
            '<a class="delete" title="Delete" data-toggle="tooltip" onclick="openConfirmDeleteDept(' + item.id + ')"><i class="material-icons">&#xE872;</i></a>' +
            '</td>' +
            '</tr>'
        )
    });
}
function openDeptAddModal() {
    resetNameValDept();
    resetDeptModal();
    showModal();
    document.getElementById("type").value = "Dev";
}
function resetDeptModal() {
    document.getElementById("name").value = "";
    document.getElementById("type").value = "";
    document.getElementById("validateDeptName").style.display = "none";
}
// luu department
function saveDept() {
    var id = document.getElementById("id").value;
    if (id == null || id == "") {
        addDept();
    } else {
        updateDepatment();
    }
}
// them 
function addDept() {
    var name = document.getElementById("name").value;
    var type = document.getElementById("type").value;
    if (name == null || name.length < 6 || name.length > 50) {
        showMesNameDeptVal();
        return;
    }
    var department = {
        name: name,
        type: type,
        accountList: employeeListSaved
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments',
        type: 'POST',
        data: JSON.stringify(department),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            hideModal();

            // Do something with the result
            showSuccessAlert("Thêm mới phòng ban thành công");
            buildDepartmentTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

        }
    });

}
function showMesNameDeptVal() {
    document.getElementById("validateDeptName").style.display = "block";
    document.getElementById("validateDeptName").innerHTML = "Name Department must be from  6 characters to 50 characters"
}
function resetNameValDept(){
    document.getElementById("validateDeptName").style.display = "none";
}
// update
function openUpdateDeptModal(id) {
    $.ajax({
        url: "http://localhost:8080/api/v1/departments/" + id,
        type: 'GET',
        // data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            resetNameValDept();
            document.getElementById("id").value = data.id;
            document.getElementById("name").value = data.name;
            document.getElementById("type").value = data.type;
            showModal();
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");
        }
    });

}
// update
function updateDepatment() {
    var id = document.getElementById("id").value;
    var name = document.getElementById("name").value;
    var type = document.getElementById("type").value;
    var department = {
        name: name,
        type: type,
        accountList: employeeListSaved
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/' + id,
        type: 'PUT',
        data: JSON.stringify(department),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            hideModal();

            // Do something with the result
            showSuccessAlert("Cập nhật phòng ban thành công");
            buildDepartmentTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
// confirm delete
function openConfirmDeleteDept(id) {
    $.ajax({
        url: "http://localhost:8080/api/v1/departments/" + id,
        type: 'GET',
        // data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            var nameDept = data.name;
            var result = confirm("want to delete " + nameDept);
            if (result) {
                deleteDept(id)
            }
        },
        error(jqXHR, textStatus, errorThrown) {
            // if(jqXHR?.status === 500){
            //     console.log("login fail");
            //     loginFail();
            // }
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");
            return;

        }
    });
    // $.get("http://localhost:8080/api/v1/departments/" + id, function (data, status) {
    //     if (status == "error") {
    //         alert("lỗi");
    //         return;
    //     }
    //     var nameDept = data.name;
    //     var result = confirm("want to delete " + nameDept);
    //     if (result) {
    //         deleteDept(id)
    //     }
    // });
}
// delete theo id
function deleteDept(id) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/' + id,
        type: 'DELETE',
        contentType: "application/json",
        dataType: "json",
        headers: headers,// du lieu tra ve
        success: function (data, textStatus, xhr) {
            var name = data.name;
            // Do something with the result
            showSuccessAlert("Xóa thành công phòng ban " + name);
            resetPage();
            resetSort();
            resteFilter();
            buildDepartmentTable();
        },
        error(jqXHR, textStatus, errorThrown) {
            // alert("error");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}
// delete all item
function deleteAllCheckItem() {
    var ids = [];
    var i = 0;
    var names = [];
    while (true) {
        var checkBoxItem = document.getElementById("check-" + i);
        if (checkBoxItem != undefined || checkBoxItem != null) {
            if (checkBoxItem.checked) {
                ids.push(departments[i].id);
                names.push(departments[i].name)
            }
            i++;
        } else {
            break;
        }
    }
    var result = confirm("want to delete " + names);
    if (result) {
        // call api
        $.ajax({
            url: 'http://localhost:8080/api/v1/departments?ids=' + ids,
            type: 'DELETE',
            contentType: "application/json",
            dataType: "json",
            headers: headers,// du lieu tra ve
            success: function (data, textStatus, xhr) {
                names = []
                data.forEach(function (item) {
                    names.push(item.name);
                })
                // Do something with the result
                showSuccessAlert("Xóa thành công phòng ban " + names);
                resetPage();
                resetSort();
                resetSearch();
                resteFilter();
                buildDepartmentTable();

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
// onclick delete all
function onClickDelAllDept() {
    var checkAllDept = document.getElementById("check-all");
    var i = 0;
    if (checkAllDept.checked) {
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
    var checkAllDept = document.getElementById("check-all");
    var i = 0;
    while (true) {
        var checkBoxItem = document.getElementById("check-" + i);
        if (checkBoxItem != undefined || checkBoxItem != null) {
            if (checkBoxItem.checked == false) {
                checkAllDept.checked = false;
                return;
            }
            i++;
        } else {
            break;
        }
    }
    checkAllDept.checked = true;
}
// search 
function handleSearchDept() {
    resetPage();
    resteFilter();
    buildDepartmentTable();
}
// xu ly enter event
function handleEnterEventDept(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        // Ensure it is only this code that runs
        handleSearchDept();
    }
}
// resetSearch
function resetSearch() {
    document.getElementById("contentSearchDept").value = "";
}
// filter
function changeMinCreatedDate(event) {
    minCreatedDate = event.target.value;
    resetSort();
    resetSearch();
    resetPage();
    buildDepartmentTable();
}
// filter
function changeMaxCreatedDate(event) {
    maxCreatedDate = event.target.value;
    resetSort();
    resetSearch();
    resetPage();
    buildDepartmentTable();
}
function resteFilter() {
    minCreatedDate = "";
    maxCreatedDate = "";
    document.getElementById("minCreatedDate").value = "";
    document.getElementById("maxCreatedDate").value = "";
}
function refreshDeptTable() {
    resetPage();
    resetSearch();
    resetSort();
    resteFilter();
    buildDepartmentTable();
}
function showSuccessAlert(content) {
    document.getElementById("content").innerHTML = content;
    $("#alert-success").fadeTo(2000, 500).slideUp(500, function () {
        $("#alert-success").slideUp(500);
    })
}
function showModal() {
    $('#myModal').modal('show');
}
function hideModal() {
    $('#myModal').modal('hide');
}
var employeeList =[];
var employeeListSaved = [];
function openModalAddAccounts(){
    $('#modalAddAccount').modal('show');
}
function hideModalAddAccounts(){
    $('#modalAddAccount').modal('hide');
}
function onclickAddAccounts(){
    hideModal();
    openModalAddAccounts();
    buildModalTableAddEmployee();
}
function buildModalTableAddEmployee(){
    $("#tbody-modal-add-account").empty();
    buildListEmployee();
}
function buildListEmployee(){
    var url = "http://localhost:8080/api/v1/accounts";
    // url += "?page=" + currentPage + "&size=" + size;
    // var search = document.getElementById("contentSearchEm").value;
    // url += "&search.contains=" + search;
    // url += "&sort=" + sortFieldEm + "," + (isAsc ? "asc" : "desc");
    $.ajax({
        url: url,
        type: 'GET',
        // data: JSON.stringify(loginRequest),
        contentType: "application/json",
        dataType: "json", // du lieu tra ve
        headers: headers,
        success: function (data, textStatus, xhr) {
            employeeList = []
            // employees = [];
            // employees = data.content;
            // fillEmployeeTable();
            // pageEmployeeTable(data.totalPages);
            // renderSortUIEm();
            employeeList = data.content;
            fillEmployeesModal();
            resetCheckBoxAddModal();
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log("lỗi");

        }
    });
}
function fillEmployeesModal(){
    var deptId = document.getElementById("id").value;
    console.log(deptId);
    if(deptId != null){
        console.log(deptId);
        employeeList.forEach(function (item, index) {
            $('#tbody-modal-add-account').append(
                '<tr>'
                + '<td><input type="checkbox" id="checkModalAddEm-' + index + '" name="checkItem"  onclick="ocModalCheckItem()"></td>'
                + '<td>' + item.username + '</td>'
                + '<td>' + item.fullName + '</td>'
                + '<td>' + item.role + '</td>' +
                '</tr>'
            );
            if(item.department.id == deptId){
                console.log(deptId);
                document.getElementById("checkModalAddEm-"+index).checked = true;
            }
        });
        return;
    }
    employeeList.forEach(function (item, index) {
        $('#tbody-modal-add-account').append(
            '<tr>'
            + '<td><input type="checkbox" id="checkModalAddEm-' + index + '" name="checkItem"  onclick="ocModalCheckItem()"></td>'
            + '<td>' + item.username + '</td>'
            + '<td>' + item.fullName + '</td>'
            + '<td>' + item.role + '</td>' +
            '</tr>'
        )
    });
}
function ocModalCheckAll(){
    var checkAllAcc = document.getElementById("check-allAddEmModal");
    var i = 0;
    if (checkAllAcc.checked) {
        while (true) {
            var checkBoxItem = document.getElementById("checkModalAddEm-" + i);
            if (checkBoxItem != undefined || checkBoxItem != null) {
                checkBoxItem.checked = true;
                i++;
            } else {
                break;
            }
        }
    } else {
        while (true) {
            var checkBoxItem = document.getElementById("checkModalAddEm-" + i);
            if (checkBoxItem != undefined || checkBoxItem != null) {
                checkBoxItem.checked = false;
                i++;
            } else {
                break;
            }
        }
    }

}
function ocModalCheckItem(){
    var checkAllAcc = document.getElementById("check-allAddEmModal");
    var i = 0;
    while (true) {
        var checkBoxItem = document.getElementById("checkModalAddEm-" + i);
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
function saveEmModal(){
    employeeListSaved = [];
    var i = 0;
    while (true) {
        var checkBoxItem = document.getElementById("checkModalAddEm-" + i);
        if (checkBoxItem != undefined || checkBoxItem != null) {
            if (checkBoxItem.checked) {
                employeeListSaved.push(employeeList[i]);
            }
            i++;
        } else {
            break;
        }
    }
    console.log(employeeListSaved);
    hideModalAddAccounts();
    showModal();
}
function closeEmModal(){
    employeeListSaved = [];
    console.log(employeeListSaved);
    hideModalAddAccounts();
    showModal();
}
function resetCheckBoxAddModal(){
    document.getElementById("check-allAddEmModal").checked = false;
}