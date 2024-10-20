$(document).ready(function () {
  // Show current date on console
  console.log(new Date());

  function formatRupiah(value) {
    return "Rp. " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Initialize DataTables
  var table = $("#myDatabase").DataTable({
    columnDefs: [
      { visible: false, targets: 0 }, // Hide the `id` column (index 0)
    ],
    processing: true,
    serverSide: true,
    ajax: {
      url: "/data",
      type: "GET",
      data: function (d) {
        d.page = Math.ceil(d.start / d.length) + 1;
        d.per_page = d.length;
      },
    },
    columns: [
      { data: "id", title: "id" }, // Hidden column
      { data: "nama_pengguna", title: "Nama Pengguna" },
      { data: "nama_barang", title: "Nama Barang" },
      { data: "kode", title: "Kode" },
      { data: "quantity", title: "Quantity" },
      { data: "berat", title: "Berat" },
      {
        data: "harga",
        title: "Harga",
        render: function (data, type, row) {
          return formatRupiah(data); // Format it on the client-side
        },
      },
      { data: "shipping_status", title: "Shipping Status" },
      { data: "payment_status", title: "Payment Status" },
      {
        data: null,
        title: "Action",
        orderable: false,
        render: function (data, type, row) {
          return `
            <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
          `;
        },
      },
    ],
  });

  // Show the delete modal when the delete button is clicked
  $(document).off("click", ".delete-btn").on("click", ".delete-btn", function () {
    var id = $(this).data("id"); // Get the ID from the clicked button
    rowToDelete = table.row($(this).closest("tr")); // Get the corresponding row
    $("#row-delete-yes").data("id", id); // Set the ID for the confirmation button
    $("#datatable-delete-modal").modal("show"); // Show the delete modal
  });

  // Handle delete confirmation
  $("#row-delete-yes").on("click", function () {
    var id = $(this).data("id"); // Get the ID from the confirmation button

    // Make an AJAX request to delete the product
    $.ajax({
      type: "POST",
      url: "/delete_product/" + id,
      success: function () {
        // Remove the row from DataTable and redraw
        rowToDelete.remove().draw();

        // Hide the delete modal and show success modal
        $("#datatable-delete-modal").modal("hide");
        $("#success-delete-modal").modal("show");
      },
      error: function (xhr, status, error) {
        console.error("Error deleting product:", error);
      },
    });
  });

  // Hide delete success modal on "OK" button click
  $("#success-ok").on("click", function () {
    $("#success-delete-modal").modal("hide"); // Hide the success modal
  });

  // Handle edit button click to show edit form modal

  $(document).off("click", ".edit-btn").on("click", ".edit-btn", function () {
    var id = $(this).data("id"); // Capture the ID

    $.ajax({
      url: "/get_product/" + id,
      type: "GET",
      success: function (data) {
        if (data) {
          // Pre-fill form fields
          $("#product-id").val(data.id); // Make sure this hidden input is set
          $("#namapengguna-edit").val(data.nama_pengguna);
          $("#namabarang-edit").val(data.nama_barang);
          $("#kode-edit").val(data.kode);
          $("#quantity-edit").val(data.quantity);
          $("#berat-edit").val(data.berat);
          $("#harga-edit").val(data.harga);
          $("#shippingstatus-edit").val(data.shipping_status);
          $("#paymentstatus-edit").val(data.payment_status);

          // Show the edit modal
          $("#datatable-edit-form").modal("show");
        } else {
          alert("Product data not found.");
        }
      },
      error: function (xhr) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.error("Error:", response.message || response);
        } catch (e) {
          console.error("Error fetching product:", xhr.responseText);
        }
      },
    });
  });

  $("#editProductForm").on("submit", function (e) {
    e.preventDefault(); // Prevent page refresh

    var formData = $(this).serialize(); // Serialize form data

    $.ajax({
      url: "/update_product",
      type: "POST",
      data: formData,
      success: function (response) {
        // Close the edit form modal
        $("#datatable-edit-form").modal("hide");

        // Reload the DataTable to reflect changes
        table.ajax.reload(null, false); // Reload without resetting pagination

        // Show the success modal
        $("#success-edit-modal").modal("show");
      },
      error: function (xhr) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.error("Error:", response.message || response);
        } catch (e) {
          console.error("Error fetching product:", xhr.responseText);
        }
      },
    });
  });

  // Initialize tabs and set up click events for tab actions
  initTabs("#myTab", table);
  initTabs("#myTab2", table);
  initTabs("#myTab3", table);
  initTabs(".child-tab", table);

  setTabClickEvents("#home-tab, #deliver-tab, #payment-tab", clearSearch);
  setTabClickEvents("#deliverchild1-tab", () => columnSearch(7, ""));
  setTabClickEvents("#deliverchild2-tab", () => columnSearch(7, "delivered"));
  setTabClickEvents("#deliverchild3-tab", () => columnSearch(7, "pending"));
  setTabClickEvents("#deliverchild4-tab", () => columnSearch(7, "canceled"));
  setTabClickEvents("#deliverchild5-tab", () => columnSearch(7, "on process"));
  setTabClickEvents("#paymentchild1-tab", () => columnSearch(8, ""));
  setTabClickEvents("#paymentchild2-tab", () => columnSearch(8, "paymented"));
  setTabClickEvents("#paymentchild3-tab", () => columnSearch(8, "pending"));
  setTabClickEvents("#paymentchild4-tab", () => columnSearch(8, "canceled"));
  setTabClickEvents("#paymentchild5-tab", () => columnSearch(8, "on process"));

  // Handle dark mode toggle
  const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    loadToggleSetting();
    checkbox.addEventListener("change", function () {
      $("body, canvas, .form-text").toggleClass("dark");
      saveToggleSetting();
    });
  }
});

// Function to initialize tabs and manage their states
function initTabs(tabSelector, table) {
  $(tabSelector + " a").on("click", function (e) {
    e.preventDefault();
    $(this)
      .tab("show")
      .siblings()
      .removeClass("active")
      .end()
      .addClass("active");

    // Activate child tabs when parent tab changes
    if ($(this).closest(".parent-tab").length) {
      var parentTabId = $(this).attr("href");
      $(parentTabId).find(".child-tab a.active").tab("show");
    }

    // Reset status column filter when switching tabs
    if ($(this).closest(".parent-tab").length || this.id !== "child2-tab") {
      table.column(2).search("").draw();
    }
  });

  $("#export-excel").click(function () {
    window.location.href = "/export_excel";
  });
}

// Function to set up click events for tabs
function setTabClickEvents(selector, callback) {
  $(selector).click(callback);
}

// Function to clear DataTable search filters
function clearSearch() {
  $("#myDatabase").DataTable().search("").columns().search("").draw();
}

// Function to search a specific column in DataTable
function columnSearch(columnIndex, searchTerm) {
  $("#myDatabase").DataTable().column(columnIndex).search(searchTerm).draw();
}

// Function to load and apply the saved toggle setting from localStorage
function loadToggleSetting() {
  const isChecked = JSON.parse(localStorage.getItem("isChecked"));
  if (isChecked) {
    document.getElementById("checkbox").checked = isChecked;
    $("body, form-text").addClass("dark");
  }
}

// Function to save the toggle setting to localStorage
function saveToggleSetting() {
  localStorage.setItem(
    "isChecked",
    JSON.stringify(document.getElementById("checkbox").checked)
  );
}

//Calculator Function
let expression = ""; // Store the calculator expression
let targetInput = null; // Reference to the input field being edited

// Toggle the visibility of the shared calculator
function toggleCalculator(input) {
  targetInput = input; // Store the input field reference
  const calculatorPopup = document.getElementById("shared-calculator");
  calculatorPopup.style.display =
    calculatorPopup.style.display === "none" ? "block" : "none";
}

// Append value to the expression and update the display
function appendValue(value, event) {
  event.preventDefault(); // Prevent form submission
  expression += value;
  updateDisplay();
}

// Update the calculator display and the target input field
function updateDisplay() {
  document.getElementById("calculator-display").textContent = expression || "0";
  if (targetInput) {
    targetInput.value = expression; // Sync with the input field
  }
}

// Clear the calculator input and update the display
function clearCalculator(event) {
  event.preventDefault(); // Prevent form submission
  expression = "";
  updateDisplay();
}

// Calculate the result, update the target input field, and close the calculator
function calculateResult(event) {
  event.preventDefault(); // Prevent form submission
  try {
    const result = math.evaluate(expression); // Safely evaluate the expression
    expression = result.toString(); // Store the result as the new expression
    updateDisplay(); // Sync with input field and display
    toggleCalculator(targetInput); // Close the calculator
  } catch (error) {
    alert("Invalid Expression");
    clearCalculator(event);
  }
}

// Allow manual input in both Add and Edit forms
document.querySelectorAll("#harga, #harga-edit").forEach((input) => {
  input.addEventListener("input", (e) => {
    expression = e.target.value; // Update the expression
    updateDisplay();
  });
});