$(document).ready(function () {
  // Initialize DataTables
  var table1 = $("#myDataTable").DataTable();
  var table2 = $("#myDatabase").DataTable({
    // Define columns for table2 and setup server-side processing
    columnDefs: [{ orderable: false, targets: -1 }],  // Disable sorting for the last column
    processing: true,  // Show processing indicator
    serverSide: true,  // Enable server-side processing
    ajax: {
      url: "/data",  // URL to fetch data from server
      type: "GET",  // HTTP method
      data: function(d) {
        d.page = Math.ceil(d.start / d.length) + 1;  // Calculate page number
        d.per_page = d.length;  // Set number of rows per page
      }
    },
    columns: [
      { data: "nama_pengguna", title: "Nama Pengguna" },  // Define column for 'nama_pengguna'
      { data: "nama_barang", title: "Nama Barang" },      // Define column for 'nama_barang'
      { data: "kode", title: "Kode" },                    // Define column for 'kode'
      { data: "quantity", title: "Quantity" },            // Define column for 'quantity'
      { data: "berat", title: "Berat" },                  // Define column for 'berat'
      { data: "harga", title: "Harga" },                  // Define column for 'harga'
      { data: null, title: "Action",  // No specific data field for the action column
        orderable: false,  // Disable sorting for the action column
        render: function(data, type, row) {
          // Render edit and delete buttons with data-id attribute
          return `
            <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
          `;
        }
      }
    ]
  });

  // Handle and Show the Edit modal when the edit button is clicked
  $(document).on('click', '.edit-btn', function () {
    var id = $(this).data('id');
        $('#datatable-edit').modal('show');  // Show the edit modal
  });

  // Handle and Show the Delete modal when the delete button is clicked
  $(document).on('click', '.delete-btn', function () {
    var id = $(this).data('id');
    $('#datatable-delete').modal('show');  // Show the delete modal
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
    $(this).tab("show").siblings().removeClass("active").end().addClass("active");

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
