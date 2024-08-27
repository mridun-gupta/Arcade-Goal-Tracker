/* popUp() Logic */
function popUp(ImgSrc) {
    const imageContainer = document.getElementById("imageContainer");
    const popUpDiv = document.getElementById("popUp");

    imageContainer.src = ImgSrc;
    popUpDiv.style.display = "flex";
}

/* dismissPopUp() Logic */
function dismissPopUp() {
    const popUpDiv = document.getElementById("popUp");

    popUpDiv.style.display = "none";
}


function PopulateTable() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const inStock = [];
            const outOfStock = [];

            data.forEach(item => {
                if (item.stock !== undefined && item.stock === 0) {
                    item.hours = "Sold Out";
                    outOfStock.push(item);
                } else {
                    inStock.push(item);
                }
            });

            const sortedData = inStock.sort((a, b) => {
                const hourA = parseInt(a.hours);
                const hourB = parseInt(b.hours);
                return hourA - hourB;
            }).concat(outOfStock);

            console.log(sortedData);

            appendDataToTable(sortedData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function appendDataToTable(dataArray) {
    const tableBody = document.getElementById('table-body');

    dataArray.forEach((data, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img onclick="popUp(this.src)" src="${data.imageURL}"></td>
            <td>${data.name}</td>
            <td>${data.hours}</td>
            <td>
                <button class="decrement">-</button>
                <input type="number" value="0" min="0" step="1">
                <button class="increment">+</button>
            </td>
        `;

        tableBody.appendChild(row);

        const decrementButton = row.querySelector('.decrement');
        const incrementButton = row.querySelector('.increment');
        const inputField = row.querySelector('input[type="number"]');

        decrementButton.addEventListener('click', () => {
            let currentValue = parseInt(inputField.value);
            if (currentValue > 0) {
                inputField.value = currentValue - 1;
            }
        });

        incrementButton.addEventListener('click', () => {
            let currentValue = parseInt(inputField.value);
            inputField.value = currentValue + 1;
        });


    });
}


function logTableData() {
    const currentTicketValue = document.getElementById('currentTicket').value;
    console.log(`Current Ticket Value: ${currentTicketValue}`);

    const tableRows = document.querySelectorAll('#table-body tr');
    let totalTicketsSum = 0;

    tableRows.forEach((row, index) => {
        const inputField = row.querySelector('input[type="number"]');
        const inputValue = parseInt(inputField.value);

        if (inputValue > 0) {
            const name = row.querySelector('td:nth-child(3)').textContent;
            const tickets = parseInt(row.querySelector('td:nth-child(4)').textContent);
            const totalTickets = tickets * inputValue;
            totalTicketsSum += totalTickets;
            console.log(`Row ${index + 1}: Name: ${name}, Total Tickets: ${totalTickets}, Quantity: ${inputValue}`);
        }
    });

    console.log(`Total Tickets from all rows: ${totalTicketsSum}`);


    const totalHours = document.getElementById('total');
    const hourPerDay = document.getElementById('per-day');
    const infoDiv = document.getElementById('info-div');
    const infoText = document.getElementById('info-text');

    const currentDate = new Date();
    const targetDate = new Date('August 31, 2024');
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (totalTicketsSum-currentTicketValue < 0) {
        infoDiv.style.display = 'block';
        infoText.textContent = 'You have enough tickets'
        
    }
    infoDiv.style.display = 'block';
    totalHours.textContent = totalTicketsSum - currentTicketValue;
    hourPerDay.textContent = ((totalTicketsSum - currentTicketValue) / daysLeft).toFixed(2);
}

document.addEventListener("DOMContentLoaded", function() {
    PopulateTable();
});