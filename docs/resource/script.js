$(document).ready(function () {
  // Show current date on console
  console.log(new Date());

  // Initialize DataTables
  var table1 = $("#myDataTable").DataTable();
  var table2 = $("#myDatabase").DataTable({
    columnDefs: [
      { visible: false, targets: 0 }  // Hide the `id` column (index 0)
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
      { data: "id", title: "id" },  // Hidden column
      { data: "nama_pengguna", title: "Nama Pengguna" },
      { data: "nama_barang", title: "Nama Barang" },
      { data: "kode", title: "Kode" },
      { data: "quantity", title: "Quantity" },
      { data: "berat", title: "Berat" },
      { data: "harga", title: "Harga" },
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
  
  // Handle and Show the Edit modal when the edit button is clicked
  $(document).on("click", ".edit-btn", function () {
    var id = $(this).data("id");
    $("#datatable-edit").modal("show"); // Show the edit modal
  });

// Show the delete modal when the delete button is clicked
$(document).on("click", ".delete-btn", function () {
  var id = $(this).data("id"); // Get the ID from the clicked button
  rowToDelete = table2.row($(this).closest("tr")); // Get the corresponding row
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
      }
  });
});

// Hide delete success modal on "OK" button click
$("#success-ok").on("click", function () {
  $("#success-delete-modal").modal("hide"); // Hide the success modal
});

  // Initialize tabs and set up click events for tab actions
  initTabs("#myTab", table1);
  initTabs("#myTab2", table1);
  initTabs("#myTab3", table1);
  initTabs(".child-tab", table1);

  setTabClickEvents("#home-tab, #deliver-tab, #payment-tab", clearSearch);
  setTabClickEvents("#deliverchild1-tab", () => columnSearch(2, ""));
  setTabClickEvents("#deliverchild2-tab", () => columnSearch(2, "delivered"));
  setTabClickEvents("#deliverchild3-tab", () => columnSearch(2, "pending"));
  setTabClickEvents("#deliverchild4-tab", () => columnSearch(2, "canceled"));
  setTabClickEvents("#deliverchild5-tab", () => columnSearch(2, "on process"));
  setTabClickEvents("#paymentchild1-tab", () => columnSearch(3, ""));
  setTabClickEvents("#paymentchild2-tab", () => columnSearch(3, "paymented"));
  setTabClickEvents("#paymentchild3-tab", () => columnSearch(3, "pending"));
  setTabClickEvents("#paymentchild4-tab", () => columnSearch(3, "canceled"));
  setTabClickEvents("#paymentchild5-tab", () => columnSearch(3, "on process"));

  // Handle dark mode toggle
  const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    loadToggleSetting();
    checkbox.addEventListener("change", function () {
      $("body, canvas, form-text").toggleClass("dark");
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
}

// Function to set up click events for tabs
function setTabClickEvents(selector, callback) {
  $(selector).click(callback);
}

// Function to clear DataTable search filters
function clearSearch() {
  $("#myDataTable").DataTable().search("").columns().search("").draw();
}

// Function to search a specific column in DataTable
function columnSearch(columnIndex, searchTerm) {
  $("#myDataTable").DataTable().column(columnIndex).search(searchTerm).draw();
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
