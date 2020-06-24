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
    $('#addProduct').click(function () {
        
        $.ajax({
            type: "POST",
            url: "/api/product",
            data: {
                title: $("#title").val(),
                type: $("#type").val(),
                productionDate: $("#productionDate").val(),
                company: $("#companyName")[0].getAttribute("companyId")
            },
            success: function (res) {
                addThisRowToProductsTable(res);
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


const addThisRowToProductsTable = (data) => {

    $("#addNewProductModal").modal('hide');
    $("#title").val("");
    $("#type").val("");
    $("#productionDate").val("");

    $('tbody').append(`
        <tr elementId="${data._id}" index="${$('tbody tr:last td')[0]? Number($('tbody tr:last td')[0].innerHTML) : 0}">
            <td>${$('tbody tr:last td')[0]? Number($('tbody tr:last td')[0].innerHTML) : 1}</td>
            <td>${data.title}</td>
            <td>${data.type}</td>
            <td>${data.productionDate}</td>
            <td>
                <span class="material-icons text-danger" onclick="deleteRow(this)">
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

    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);

    TDs[1].innerHTML = `<input type="text" id="editProductTitle" previousValue="${TDs[1].innerHTML}" value="${TDs[1].innerHTML}">`
    TDs[2].innerHTML = `<input type="text" id="editProductType" previousValue="${TDs[2].innerHTML}" value="${TDs[2].innerHTML}">`
    TDs[3].innerHTML = `<input type="date" id="editProductProductionDate" previousValue="${TDs[3].innerHTML}" value="${TDs[3].innerHTML}">`
    TDs[4].innerHTML = `<button type="button" class="btn btn-primary" onclick="editElement(this)">Send</button> 
    <button type="button" class="btn btn-danger" onclick="cancelEdit(this)">Cancel</button>`
};


const cancelEdit = (element) => {    
    
    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);
    const inputs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) input`);
    
    TDs[1].innerHTML = inputs[0].getAttribute('previousValue');
    TDs[2].innerHTML = inputs[1].getAttribute('previousValue');
    TDs[3].innerHTML = inputs[2].getAttribute('previousValue');
    TDs[4].innerHTML = `
        <span class="material-icons text-danger" onclick="deleteRow(this)">
            delete_forever
        </span>
        <span class="material-icons text-warning" onclick="makeRowEditable(this)">
            create
        </span>
    `
}


const editElement = (element) => {
    $.ajax({
        type: "PUT",
        url: "/api/product",
        data: {
            productId: element.parentNode.parentNode.getAttribute('elementId'),
            title: $("#editProductTitle").val(),
            type: $("#editProductType").val(),
            productionDate: $("#editProductProductionDate").val(),
        },
        success: function (res) {
            updateRow(res, element);
        },
        error: function (err) {
            displayBodyDangerAlert(err.responseText);
        }
    });
};


const updateRow = (newData, element) => {
    const TDs = $(`tbody tr:eq(${[element.parentNode.parentNode.getAttribute('index')]}) td`);
    
    TDs[1].innerHTML = newData.title;
    TDs[2].innerHTML = newData.type;
    TDs[3].innerHTML = newData.productionDate;
    TDs[4].innerHTML = `
        <span class="material-icons text-danger" onclick="deleteRow(this)">
            delete_forever
        </span>
        <span class="material-icons text-warning" onclick="makeRowEditable(this)">
            create
        </span>
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
        url: `/api/product/${ELEMENT_ID}`,
        success: function (res) {            
            displayBodySuccessAlert("Product deleted successfully");
            updateProductsTable(res);
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

const updateProductsTable = (data) => {
    $('tbody').html("");

    for (let i = 0; i < data.length; i++) {
        $('tbody').append(`
            <tr elementId="${data[i]._id}" index="${i}">
                <td>${i + 1}</td>
                <td>${data[i].title}</td>
                <td>${data[i].type}</td>
                <td>${data[i].productionDate}</td>
                <td>
                    <span class="material-icons text-danger" onclick="deleteRow(this)">
                        delete_forever
                    </span>
                    <span class="material-icons text-warning" onclick="makeRowEditable(this)">
                        create
                    </span>
                </td>
            </tr>
        `);
    };
};