/* console.log Markings */
console.log("Contributions made by\n ####\n#    #  #    #  #####   #####     ##    #####  ######  #####    ####     ##    #    #  #####   #   #  ######  ######\n#    #  #    #    #     #    #   #  #     #    #       #    #  #    #   #  #   ##   #  #    #  #   #  #    #       #\n#    #  #    #    #     #    #  #    #    #    ######  #    #  #       #    #  # #  #  #    #   # #   ######  ######\n#    #  #    #    #     #    #  ######    #    #       #    #  #       ######  #  # #  #    #    #         #  #\n#    #  #    #    #     #    #  #    #    #    #       #    #  #    #  #    #  #   ##  #    #    #         #  #\n ####    ####     #     #####   #    #    #    ######  #####    ####   #    #  #    #  #####     #    ######  ######");

/* popUp() Logic */
function popUp(ImgSrc) {
    const imageContainer = document.getElementById("imageContainer");
    const popUpDiv = document.getElementById("popUp");

    imageContainer.src = ImgSrc;
    popUpDiv.style.display = "flex";
}

/* dismissPopUp() Logic */
function dismissPopUp() {
    document.getElementById("popUp").style.display = "none";
}

/* populateTable() Logic */
function populateTable() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const sortedData = data.reduce((acc, item) => {
                (item.stock === 0 ? (item.hours = "SOLD OUT", acc.outOfStock) : acc.inStock).push(item);
                return acc;
            }, { inStock: [], outOfStock: [] });

            sortedData.inStock.sort((a, b) => parseInt(a.hours) - parseInt(b.hours));
            appendDataToTable([...sortedData.inStock, ...sortedData.outOfStock]);
        })
        .catch(error => console.error("Error:", error));
}

function appendDataToTable(dataArray) {
    const tableBody = document.getElementById("table-body");

    dataArray.forEach((data, index) => {
        const descriptionHTML = data.description && data.description !== "undefined"
            ? `<h6><span>DESCRIPTION</span>: ${data.description}</h6>`
            : "";

        const hoursHTML = data.hours === "SOLD OUT"
            ? `<td colspan="2">🎟️${data.hours}</td>`
            : `<td>🎟️${data.hours}</td>`;

        const inputFieldHTML = data.hours === "SOLD OUT"
            ? ""
            : `
                <td>
                    <button class="decrement">-</button>
                    <input type="number" value="0" min="0" step="1">
                    <button class="increment">+</button>
                </td>
            `;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img onclick="popUp(this.src)" src="${data.imageURL}"></td>
            <td>
                <div>
                    <h3>${data.name}</h3>
                    ${descriptionHTML}
                </div>
            </td>
            ${hoursHTML}
            ${inputFieldHTML}
        `;
        tableBody.appendChild(row);

        if (data.hours !== "SOLD OUT") {
            const inputField = row.querySelector("input[type='number']");
            row.querySelector(".decrement").addEventListener("click", () => inputField.value = Math.max(0, parseInt(inputField.value) - 1));
            row.querySelector(".increment").addEventListener("click", () => inputField.value = parseInt(inputField.value) + 1);
        }
    });
}

/* logTableData() Logic */
function logTableData() {
    const currentTicketValue = parseInt(document.getElementById("currentTicket").value);
    const tableRows = document.querySelectorAll("#table-body tr");
    let totalTicketsSum = 0;

    tableRows.forEach((row, index) => {
        const inputField = row.querySelector("input[type='number']");
        if (inputField) {
            const inputValue = parseInt(inputField.value);
            if (inputValue > 0) {
                const ticketsCell = row.querySelector("td:nth-child(4)");
                if (ticketsCell) {
                    const tickets = parseInt(ticketsCell.textContent.replace("🎟️", ""));
                    totalTicketsSum += tickets * inputValue;
                    console.log(`Row ${index + 1}: Name: ${row.querySelector("td:nth-child(3)").textContent.trim()}, Total Tickets: ${tickets * inputValue}, Quantity: ${inputValue}`);
                }
            }
        }
    });

    console.log(`Aggregate Total of Tickets across your Selection: ${totalTicketsSum}`);

    const daysLeft = Math.ceil((new Date("August 31, 2024").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const remainingTickets = totalTicketsSum - currentTicketValue;
    const hoursPerDay = (remainingTickets / daysLeft).toFixed(2);

    const infoText = remainingTickets <= 0
        ? "You've got enough tickets."
        : `You need to complete ${remainingTickets} tickets over the next ${daysLeft} days, which averages out to ${hoursPerDay} tickets per day.`;

    document.getElementById("info-div").style.display = "block";
    document.getElementById("info-text").textContent = infoText;
    document.getElementById("total").textContent = remainingTickets;
    document.getElementById("per-day").textContent = hoursPerDay;
}

document.addEventListener("DOMContentLoaded", populateTable);