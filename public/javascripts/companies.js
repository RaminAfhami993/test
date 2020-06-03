// reload page when user pres back in browser
window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || 
                           ( typeof window.performance != "undefined" && 
                                window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      // Handle page restore.
      window.location.reload();
    }
});

$(document).ready(function () {
    //Use this inside your document ready jQuery 
    $('#addCompany').click(function () {
        $.ajax({
            type: "POST",
            url: "/api/company",
            data: {
                name: $("#companyName").val(),
                phoneNumber: $("#companyPhoneNumber").val(),
            },
            success: function (res) {
                addThisRowToCompaniesTable(res);
            },
            error: function (err) {
                displayDangerAlert(err.responseText);
            }
        });
    });
});



const displayDangerAlert = (message) => {
    $('#errMessage').html(message.slice(1, message.length - 1));
    $('#dangerAlert').css('display', 'block');
    $('#dangerAlert').fadeOut(3000);
};


const addThisRowToCompaniesTable = (data) => {

    $("#addNewCompanyModal").modal('hide');
    $("#companyName").val("");
    $("#companyPhoneNumber").val("");

    $('tbody').append(`
        <tr elementId="${data._id}" index="${$('tbody tr:last td')[0]? Number($('tbody tr:last td')[0].innerHTML) : 0}">
            <td>${$('tbody tr:last td')[0]? Number($('tbody tr:last td')[0].innerHTML) : 1}</td>
            <td>${data.name}</td>
            <td>${data.phoneNumber}</td>
            <td>
                <span class="material-icons text-danger" onclick="deleteRow(this)">
                    delete_forever
                </span>
                <span class="material-icons text-warning" onclick="makeRowEditable(this)">
                    create
                </span>
                <a href="http://localhost:3000/api/product/${data._id}">
                    <span class="material-icons text-success">
                        read_more
                    </span>
                </a>
            </td>
        </tr>
    `);
};


const makeRowEditable = (element) => {

    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);

    TDs[1].innerHTML = `<input type="text" id="editCompanyName" previousValue="${TDs[1].innerHTML}" value="${TDs[1].innerHTML}">`
    TDs[2].innerHTML = `<input type="text" id="editCompanyPhoneNumber" previousValue="${TDs[2].innerHTML}" value="${TDs[2].innerHTML}">`
    TDs[3].innerHTML = `<button type="button" class="btn btn-primary" onclick="editElement(this)">Send</button> 
    <button type="button" class="btn btn-danger" onclick="cancelEdit(this)">Cancel</button>`
};


const cancelEdit = (element) => {    
    
    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);
    const inputs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) input`);
    
    TDs[1].innerHTML = inputs[0].getAttribute('previousValue');
    TDs[2].innerHTML = inputs[1].getAttribute('previousValue');
    TDs[3].innerHTML = `
        <span class="material-icons text-danger" onclick="deleteRow(this)">
            delete_forever
        </span>
        <span class="material-icons text-warning" onclick="makeRowEditable(this)">
            create
        </span>
        <a href="http://localhost:3000/api/product/${[element.parentNode.parentNode.getAttribute('elementId')]}">
            <span class="material-icons text-success">
                read_more
            </span>
        </a>
    `
}


const editElement = (element) => {
    $.ajax({
        type: "PUT",
        url: "/api/company",
        data: {
            companyId: element.parentNode.parentNode.getAttribute('elementId'),
            name: $("#editCompanyName").val(),
            phoneNumber: $("#editCompanyPhoneNumber").val(),
        },
        success: function (res) {
            updateRow(res, element);
        },
        error: function (err) {
            console.log(err);

            displayBodyDangerAlert(err.responseText);
        }
    });
};


const updateRow = (newData, element) => {
    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);
    
    TDs[1].innerHTML = newData.name;
    TDs[2].innerHTML = newData.phoneNumber;
    TDs[3].innerHTML = `
        <span class="material-icons text-danger" onclick="deleteRow(this)">
            delete_forever
        </span>
        <span class="material-icons text-warning" onclick="makeRowEditable(this)">
            create
        </span>
        <a href="http://localhost:3000/api/product/${[element.parentNode.parentNode.getAttribute('elementId')]}">
            <span class="material-icons text-success">
                read_more
            </span>
        </a>
    `
};

const displayBodyDangerAlert = (message) => {
    $('body>#dangerAlert #errMessage').html(message.slice(1, message.length - 1));
    $('body>#dangerAlert').css('display', 'block');
    $('body>#dangerAlert').fadeOut(3000);
};

const deleteRow = (element) => {

    const ELEMENT_ID = element.parentNode.parentNode.getAttribute('elementId');

    $.ajax({
        type: "DELETE",
        url: `/api/company/${ELEMENT_ID}`,
        success: function (res) {            
            displayBodySuccessAlert("Company deleted successfully");
            updateCompaniesTable(res);
        },
        error: function (err) {
            displayBodyDangerAlert(err.responseText);
        }
    });
};


const displayBodySuccessAlert = (message) => {
    $('body>#successAlert #errMessage').html(message);
    $('body>#successAlert').css('display', 'block');
    $('body>#successAlert').fadeOut(3000);
};

const updateCompaniesTable = (data) => {
    $('tbody').html("");

    for (let i = 0; i < data.length; i++) {
        $('tbody').append(`
            <tr elementId="${data[i]._id}" index="${i}">
                <td>${i + 1}</td>
                <td>${data[i].name}</td>
                <td>${data[i].phoneNumber}</td>
                <td>
                    <span class="material-icons text-danger" onclick="deleteRow(this)">
                        delete_forever
                    </span>
                    <span class="material-icons text-warning" onclick="makeRowEditable(this)">
                        create
                    </span>
                    <a href="http://localhost:3000/api/product/${data[i]._id}">
                    <span class="material-icons text-success">
                        read_more
                    </span>
                </a>
                </td>
            </tr>
        `);
    };
};