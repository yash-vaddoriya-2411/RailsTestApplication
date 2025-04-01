document.addEventListener("DOMContentLoaded", function () {
    const invoiceField = document.querySelector("textarea[name='invoice[number]']");
    const submitBtn = document.querySelector("#submit-btn");

    invoiceField.addEventListener("input", function () {
        const invoiceValue = invoiceField.value.trim();
        const pattern = /^(\d+[\s,]*)+$/; // Allows only numbers, spaces, and commas

        if (!pattern.test(invoiceValue)) {
            invoiceField.setCustomValidity("Only numbers separated by spaces or commas are allowed.");
        } else {
            invoiceField.setCustomValidity(""); // Valid input
        }
    });

    submitBtn.addEventListener("click", function (event) {
        if (!invoiceField.checkValidity()) {
            event.preventDefault(); // Prevent form submission if invalid
            alert(invoiceField.validationMessage);
        }
    });
});
