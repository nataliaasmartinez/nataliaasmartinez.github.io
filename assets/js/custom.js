document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        rate1: Number(document.getElementById("rate1").value),
        rate2: Number(document.getElementById("rate2").value),
        rate3: Number(document.getElementById("rate3").value)
    };

    console.log(data);

    let resultDiv = document.getElementById("formResult");
    resultDiv.innerHTML = `
        <p>Name: ${data.name}</p>
        <p>Surname: ${data.surname}</p>
        <p>Email: ${data.email}</p>
        <p>Phone: ${data.phone}</p>
        <p>Address: ${data.address}</p>
    `;

    const avg = ((data.rate1 + data.rate2 + data.rate3) / 3).toFixed(1);

    let avgColor = "green";
    if (avg < 4) avgColor = "red";
    else if (avg < 7) avgColor = "orange";

    resultDiv.innerHTML += `<p style="color:${avgColor}; font-weight:bold;">
        ${data.name} ${data.surname}: ${avg}
    </p>`;

    const popup = document.getElementById("successPopup");
    popup.classList.add("show");

    setTimeout(() => popup.classList.remove("show"), 3000);
});
