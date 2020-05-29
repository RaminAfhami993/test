$(document).ready(function () {
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

    $('tbody tr:last').after(`
        <tr elementId="${data._id}" index="${Number($('tbody tr:last td')[0].innerHTML)}">
            <td>${Number($('tbody tr:last td')[0].innerHTML) + 1}</td>
            <td>${data.name}</td>
            <td>${data.phoneNumber}</td>
            <td>
                <span class="material-icons text-danger" onclick="deleteRow()">
                    delete_forever
                </span>
                <span class="material-icons text-warning" onclick="makeRowEditable(this)">
                    create
                </span>
            </td>
        </tr>
    `);
};


const makeRowEditable = (element) => {

    console.log(element.parentNode.parentNode.getAttribute('index'));

    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);

    TDs[1].innerHTML = `<input type="text" previousValue="${TDs[1].innerHTML}" value="${TDs[1].innerHTML}">`
    TDs[2].innerHTML = `<input type="text" previousValue="${TDs[2].innerHTML}" value="${TDs[2].innerHTML}">`
    TDs[3].innerHTML = `<button type="button" class="btn btn-primary" onclick="editElement()">Send</button> 
    <button type="button" class="btn btn-danger" onclick="cancelEdit(this)">Cancel</button>`
};


const cancelEdit = (element) => {    

    console.log(element.parentNode.parentNode.getAttribute('index'));
    
    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);
    const inputs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) input`);
    
    TDs[1].innerHTML = inputs[0].getAttribute('previousValue');
    TDs[2].innerHTML = inputs[1].getAttribute('previousValue');;
    TDs[3].innerHTML = `
        <span class="material-icons text-danger" onclick="deleteRow()">
            delete_forever
        </span>
        <span class="material-icons text-warning" onclick="makeRowEditable(this)">
            create
        </span>
    `

}