const products = [];
const table = $('<table id="table" class="table"></table>');
const modal = $('#myModal');

const CASH_FEE = 1;
const DEBIT_CARD_FEE = 1.05;
const CREDIT_CARD_FEE = 1.10;
const CHECK_FEE = 1.20;

const installmentsMap = {
    "1": 1,
    "3": 1.20,
    "6": 1.45,
    "12": 1.70
}

let userName;
let count = 1;
let payMethod = null;

$('#accept-name').click(function() {
    const nameValidationMessage = $('#name-validation-message');
    userName = $('#user-name').val();
    if (isNameValid(userName)) {
        nameValidationMessage.html(`<p class="welcome-message">Hola ${userName}, Bienvenidx</p>`);
        $('.app-actions').show();
    } else {
        nameValidationMessage.html(`<p class="error-message">Ingrese su nombre por favor</p>`);
    }
});

function isNameValid(userName) {
    if (userName.trim() === '') {
        return false;
    } else {
        return true;
    }
}

$('.app-actions button').click(function() {
    let optionsButton = $(this).data('options-button');
    executeAction(optionsButton);
});

function executeAction(optionsButton) {
    switch (optionsButton) {
        case 'buy':
            let wait = $(`<p class="wait-message">Espera, ${userName} ya serás atendidx.</p>`);
            if ($('.wait-message').length === 0) {
                $('#message-container').append(wait);
                setTimeout(() => {
                    wait.hide();
                    $('#product-container').show();
                    drawTable();
                }, 1500);
            }
            break;
        case 'debt':
            alert('su deuda actual no esta disponible');
            break;
        case 'unfollow':
            alert('opcion invalida, ya vendiste tu alma al diablo Muajajaja LTA');
            break;
        case 'help':
            alert('todos los operadores se encuentran ocupados');
            break;
        case 'exit':
            alert('gracias por usar nuestro servicio');
            break;
    }
}

function addProduct() {
    let nameProduct = $('#product').val();
    let price = $('#price').val();
    let newId = count++;
    let newProduct = {
        name: nameProduct,
        price: price,
        id: newId
    };
    if (nameProduct.length === 0 || price.length === 0) {
        alert('completa los inputs');
    } else {
        products.push(newProduct);
        tableProducts();
    }
}

$('#accept-product').on("click", addProduct);

function drawTable() {
    let headboard = $('<th scope="row">Producto</th><th>Precio</th><th></th>');
    table.append(headboard);
    let tableContainer = $('#table-container')
    tableContainer.append(table);
}

function getSubtotal() {
    let amount = 0;
    for (let i = 0; i < products.length; i++) {
        amount += parseFloat(products[i].price);
    }
    return amount;
}

function clearTable() {
    $('.product-row').remove();
    $('.button-pay').remove()
}

function tableProducts() {
    clearTable();
    for (let i = 0; i < products.length; i++) {
        let name = products[i].name;
        let price = products[i].price;
        let tdName = `<td data-index="${products[i].id}"> ${ name }</td>`;
        let tdPrice = `<td> ${ price } </td>`;
        let btnDelete = $(`<td><button type="button" class="btn btn-sm btn-danger">X</button></td>`);
        btnDelete.on("click", function() {
            deleteProduct(i);
        });
        let row = $('<tr class="product-row"></tr>');
        row.append(tdName);
        row.append(tdPrice);
        row.append(btnDelete);
        table.append(row);
    }
    let amount = getSubtotal();
    let tdSubtotal = $(`<td><i><strong>SUBTOTAL: ARS </strong></i>${ amount }</td><td></td><td></td>`);
    let row = $('<tr class="product-row"></tr>');
    row.append(tdSubtotal);
    table.append(row);
    pay();
}

function deleteProduct(index) {
    products.splice(index, 1);
    clearTable();
    tableProducts();
}

function pay() {
    if (products.length > 0) {
        let button = $('<div class="form-group"><button class="button-pay btn btn-success">Pagar</button></div>');
        $('.pay').append(button);
        $('.button-pay').on("click", function() {
            modal.modal('show');
        });
    }
}

$('.pay-method-buttons>button').on('click', function() {
    payMethod = $(this).data('pay-method');
    let stringPayment = $(this).text();
    let paymentInformation = $('.payment-information').find('span');
    paymentInformation.html(stringPayment)
    $('.payment-information').show();
    if (payMethod === 'credit-card') {
        $('.installments').show();
    } else {
        $('.installments').hide();
    }
    $('#confirm-payment').show();
});

$('#confirm-payment').on('click', function() {
    let subtotal = getSubtotal();
    switch (payMethod) {
        case 'cash':
            subtotal *= CASH_FEE
            break;
        case 'debit-card':
            subtotal *= DEBIT_CARD_FEE
            break;
        case 'credit-card':
            let selectedInstalment = $('input[type=radio][name=instalment-type]:checked').val();
            subtotal *= CREDIT_CARD_FEE * installmentsMap[selectedInstalment]
            break;
        case 'check':
            subtotal *= CHECK_FEE
            break;
    }
    let total = $("#total").html(`TOTAL A PAGAR: ${subtotal.toFixed(2)}`);
    let sale = {
        'name': userName,
        'products': products,
        'total': total
    }

    saveSale(sale);
})

function getSales() {
    const sales = localStorage.getItem('ada-sales');
    if (sales) {
        return JSON.parse(sales);
    }
    return [];
}

function saveSale(sale) {
    let sales = getSales();
    sales.push(sale);
    localStorage.setItem('ada-sales', JSON.stringify(sales));
}