$(document).ready(function () {
	var table = $("#data-table").DataTable({
		paging: true,
		lengthChange: true,
		searching: true,
		ordering: true,
		info: true,
		autoWidth: true,
		aaSorting: [["1", "asc"]],
		/* "order": [], */
		columnDefs: [
			{
				/* "targets": [0,-1], */
				targets: [0, -1],
				orderable: false,
			},
		],
	});

	function filter(source, customFilterColumn) {
		var count = 0;
		var tableid = source.split(" ")[0];

		$(source).each(function (k) {
			if ($(this).text() !== "") {
				if (++count == 1) {
					$(tableid).parents("div.row:first").before('<div class="row"><div id="filtercontent"></div></div>');
				}

				var i = $(this).index();

				var select = $('<select id="filer_' + i + '" class="form-control"><option value="">All</option></select>')
					.insertBefore("#filtercontent")

					.on("change", function () {
						var val = $(this).val();

						table
							.column(i)
							.search(val ? "^" + $(this).val() + "$" : val, true, false)
							.draw();
					});

				// Get the Status values a specific way since the status is a anchor/image
				if ($(this).hasClass(customFilterColumn)) {
					var dataFilterColumn = [];

					/* ### IS THERE A BETTER/SIMPLER WAY TO GET A UNIQUE ARRAY OF <TD> data-filter ATTRIBUTES? ### */
					table
						.column(i)
						.nodes()
						.to$()
						.each(function (d, j) {
							var thisStatus = $(j).attr("data-filter");
							if ($.inArray(thisStatus, dataFilterColumn) === -1) dataFilterColumn.push(thisStatus);
						});

					dataFilterColumn.sort();

					$.each(dataFilterColumn, function (i, item) {
						select.append('<option value="' + item + '">' + item + "</option>");
					});
				}
				// All other non-Status columns (like the example)
				else {
					table
						.column(i)
						.data()
						.unique()
						.sort()
						.each(function (d, j) {
							select.append('<option value="' + d + '">' + d + "</option>");
						});
				}
				$("#filer_" + i).wrapAll('<div class="col-sm-2 form-group"></div>');
				$("<label>" + $(this).text() + "</label>").insertBefore("#filer_" + i);
			}
		});
		$(tableid + "_wrapper").removeClass("form-inline");
	}

	filter("#data-table thead th.filterable", "customFilterColumn");

	$(".btn-status").click(function () {
		var id = $(this).val();
		var status = parseInt($(this).attr("status"));
		$(this).toggleClass("status-enabled");
		$(this).toggleClass("status-disabled");
		if (status == 0) {
			$(this).html("Enabled");
			$(this).attr("status", "1");
			$(this).parent().attr("data-filter", "Enabled");
		} else {
			$(this).html("Disabled");
			$(this).attr("status", "0");
			$(this).parent().attr("data-filter", "Disabled");
		}

		table.rows().invalidate().draw();
	});
});
