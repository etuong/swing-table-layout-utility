// https://github.com/imdurgeshpal/JavaScript-Add-Remove-Rows-Columns-in-HTML-Table

var table = document.getElementById("tableData");
var addButton = document.getElementById('addRowColumn');
var deleteButton = document.getElementById('deleteRowColumn');
var selectedRow = 0;
var selectedColumn = 0;
var selectedColumnIndex = 0;
var toggleRow = null;
var toggleColumn = null;
var columnLength = 0;
var rowLength = 0;
var firstSelected = null;
var secondSelected = null;
var mergeHappenning = false;
var isMerging = false;

addButton.style.display = "none";
deleteButton.style.display = "none";
document.getElementById('file-input').style.display = "none";

const tableLocation = {
	COLUMN: 'column',
	ROW: 'row',
	CELL: 'cell',
}

function onLoadMethod() {
	// Initially load four rows and three columns  
	createTable(undefined, 5, 4);
}

function createTable(data, rowLength, columnLength) {
	// Clean slate for the table
	table.innerHTML = "";

	for (r = 0; r < rowLength; r++) {
		row = table.insertRow(r);
		for (c = 0; c < columnLength; c++) {
			if (r == 0 && c == 0) {
				row.insertCell(c);
			} else if (r == 0) {
				row.insertCell(c).innerHTML = returnTemplate(tableLocation.COLUMN, c);
			} else if (c == 0) {
				row.insertCell(c).innerHTML = returnTemplate(tableLocation.ROW, r);
			} else {
				if (data === undefined) {
					var x = row.insertCell(c);
					x.innerHTML = returnTemplate(tableLocation.CELL, "");
				} else if (typeof data[r][c] !== 'undefined') {
					var x = row.insertCell(c);
					x.rowSpan = data[r][c].rowSpan;
					x.colSpan = data[r][c].colSpan;
					x.innerHTML = returnTemplate(tableLocation.CELL, data[r][c].value);
				}
			}
		}
	}
}

function returnTemplate(selectedLocation, value) {
	// Row, column, and cell template

	switch (selectedLocation) {
		case tableLocation.COLUMN:
			return "<button class='btn btn-block btn-row' onClick='selectColumn(this)'>Column " + value + " </button>";
		case tableLocation.ROW:
			return "<button class='btn btn-md btn-row' onClick='selectRow(this)'>Row " + value + "</button>";
		case tableLocation.CELL:
			return "<input type='text' class='form-control' onclick='mergeInProcess(this.parentNode)' value ='" + value + "' >";
	}
}

function selectRow(e) {
	rowLength = table.rows.length;
	columnLength = table.rows[0].cells.length;
	selectedRow = e.parentNode.parentNode;

	// Clear any selected column
	for (i = 1; i < rowLength; i++) {
		if (toggleColumn != null)
			table.rows[i].cells[toggleColumn].classList.remove("selectedElement");
	}

	if (toggleRow == selectedRow) { // Row is reselected, deselect row
		for (c = 1; c < columnLength; c++) {
			selectedRow.cells[c].classList.remove("selectedElement");
		}
		toggleRow = null;
		selectedRow = 0;
	} else { // A different row is selected
		for (c = 1; c < columnLength; c++) {
			selectedRow.cells[c].className = 'selectedElement';
			if (toggleRow != null)
				toggleRow.cells[c].classList.remove("selectedElement");
		}
		toggleRow = selectedRow;
	}

	// Display the add and delete buttons
	if (selectedRow == 0) {
		hideAddDeleteButtons();
	} else {
		addButton.style.display = "inline-block";
		addButton.innerHTML = "Add Row";
		deleteButton.style.display = "inline-block";
		deleteButton.innerHTML = "Delete Row";
	}

	selectedColumn = 0;
	toggleColumn = null;
}

function selectColumn(e) {
	rowLength = table.rows.length;
	columnLength = table.rows[0].cells.length;
	selectedColumn = e.parentNode;
	selectedColumnIndex = selectedColumn.cellIndex;

	// Clear any selected row
	for (c = 1; c < columnLength; c++) {
		if (toggleRow != null)
			toggleRow.cells[c].classList.remove("selectedElement");
	}

	if (toggleColumn == selectedColumnIndex) {
		for (i = 1; i < rowLength; i++) {
			table.rows[i].cells[selectedColumnIndex].classList.remove("selectedElement");
		}
		toggleColumn = null;
		selectedColumn = 0;
	} else {
		for (i = 1; i < rowLength; i++) {
			table.rows[i].cells[selectedColumnIndex].className = 'selectedElement';
			if (toggleColumn != null)
				table.rows[i].cells[toggleColumn].classList.remove("selectedElement");
		}
		toggleColumn = selectedColumnIndex;
	}


	if (selectedColumn == 0) {
		hideAddDeleteButtons();
	} else {
		addButton.style.display = "inline-block";
		addButton.innerHTML = "Add Column";
		deleteButton.style.display = "inline-block";
		deleteButton.innerHTML = "Delete Column";
	}

	selectedRow = 0;
	toggleRow = null;
}

function onAdd() {

	columnLength = table.rows[0].cells.length;
	rowLength = table.rows.length;

	if (selectedRow != 0) {

		var row = table.insertRow(selectedRow.rowIndex + 1);

		for (c = 0; c < columnLength; c++) {
			var cell = row.insertCell(c);

			if (c == 0) {
				cell.innerHTML = returnTemplate(tableLocation.ROW, selectedRow.rowIndex + 1);
			} else {
				cell.innerHTML = returnTemplate(tableLocation.CELL, "");
			}
			selectedRow.cells[c].classList.remove("selectedElement");
		}
	} else if (selectedColumn != 0) {

		for (i = 0; i < rowLength; i++) {
			if (i == 0) {
				table.rows[i].insertCell(selectedColumnIndex + 1).innerHTML = returnTemplate(tableLocation.COLUMN, selectedColumnIndex.rowIndex + 1);
			} else {
				table.rows[i].insertCell(selectedColumnIndex + 1).innerHTML = returnTemplate(tableLocation.CELL, "");

			}
			table.rows[i].cells[selectedColumnIndex].classList.remove("selectedElement");
		}
	} else {
		console.log("Error in Adding Column or Row");
	}

	refreshTable();
}

function onDelete() {

	columnLength = table.rows[0].cells.length;
	rowLength = table.rows.length;

	if (selectedRow != 0 && rowLength > 2) {
		table.deleteRow(selectedRow.rowIndex);
	} else if (selectedColumn != 0 && columnLength > 2) {

		for (i = 0; i < rowLength; i++) {
			table.rows[i].deleteCell(selectedColumnIndex);
		}
	} else {
		for (i = 0; i < rowLength; i++) {
			for (j = 0; j < columnLength; j++) {
				table.rows[i].cells[j].classList.remove("selectedElement");
			}
		}
		console.log("Error in Deleting Row or Column");
		alert("1 Row or Column required");
	}

	refreshTable();
}

function onCancel() {
	isMerging = false;
	document.getElementById('mergeText').innerHTML = "";

	var buttons = document.getElementsByTagName("button");
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].disabled = false;
		buttons[i].classList.remove("mergingBackground");
	}
	document.getElementById('cancelButton').disabled = true;

	firstSelected = null;
	secondSelected = null;
}

function onMerge() {

	isMerging = true;
	document.getElementById('mergeText').innerHTML = "Please select the first point";

	var buttons = document.getElementsByTagName("button");
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].innerHTML != "Cancel") {
			buttons[i].disabled = true;
			buttons[i].classList.add("mergingBackground");
		}
	}
	document.getElementById('cancelButton').disabled = false;
}

var coordinate = function findCellIndices(cell) {
	rowLength = table.rows.length;
	columnLength = table.rows[0].cells.length;
	for (r = 0; r < rowLength; r++) {
		for (c = 0; c < columnLength; c++) {
			if (table.rows[r].cells[c] === cell)
				return [r, c];
		}
	}
}

function mergeFinished() {

	// Get coordinates
	var coordinate1 = new coordinate(firstSelected);
	var coordinate2 = new coordinate(secondSelected);

	if (coordinate1[0] == coordinate2[0] && coordinate1[1] == coordinate2[1]) {
		alert("You can't merge the same cell!");
	} else {
		var rowIndex = Math.min(coordinate1[0], coordinate2[0]);
		var rowSpan = Math.abs(coordinate1[0] - coordinate2[0]);

		var columnIndex = Math.min(coordinate1[1], coordinate2[1]);
		var columnSpan = Math.abs(coordinate1[1] - coordinate2[1]);

		// For vertical merging
		if (columnSpan == 0) {
			for (var i = rowIndex + 1; i <= rowIndex + rowSpan; i++) {
				table.rows[i].deleteCell(columnIndex);
			}
		}
		// For horizontal merging
		else if (rowSpan == 0) {
			for (var j = columnIndex + 1; j <= columnIndex + columnSpan; j++) {
				table.rows[rowIndex].deleteCell(1);
			}
		}
		// For vertical and horizontal merging
		else {
			for (var i = rowIndex; i <= rowIndex + rowSpan; i++) {
				for (var j = columnIndex; j <= columnIndex + columnSpan; j++) {
					if (!(i == rowIndex && j == columnIndex))
						table.rows[i].deleteCell(1);
				}
			}
		}

		if (++columnSpan > 1)
			table.rows[rowIndex].cells[columnIndex].colSpan = columnSpan;
		if (++rowSpan > 1)
			table.rows[rowIndex].cells[columnIndex].rowSpan = rowSpan;
	}
	onCancel();
}

function mergeInProcess(cell) {
	if (isMerging) {
		if (firstSelected == null) {
			firstSelected = cell;
			document.getElementById('mergeText').innerHTML = "Please select second point";
		} else if (secondSelected == null) {
			secondSelected = cell;
			mergeFinished();
		}
	}
}

function refreshTable() {
	hideAddDeleteButtons();
	tableNumbering();
	selectedColumn = 0;
	selectedRow = 0;
	toggleRow = null;
	toggleColumn = null;
}

function hideAddDeleteButtons() {
	addButton.style.display = "none";
	deleteButton.style.display = "none";
}

function onOutput() {
	var html = [];
	html.push("JPanel panel = new JPanel(new TableLayout(\n\tnew double[] {\n");

	columnLength = table.rows[0].cells.length;
	rowLength = table.rows.length;

	for (var i = 1; i < columnLength; i++) {
		html.push("\t\tSPACE, TableLayout.PREFERRED, // Column " + i + "\n");
	}
	html.push("\t\tSPACE },\n\tnew double[] {\n");

	for (var i = 1; i < rowLength; i++) {
		html.push("\t\tSPACE, TableLayout.PREFERRED, // Row " + i + "\n");
	}
	html.push("\t\tSPACE}));\n\n");

	for (r = 1; r < rowLength; r++) {
		for (c = 1; c < columnLength; c++) {
			var td = table.rows[r].cells[c];
			if (typeof td !== 'undefined') {
				var input = td.children[0];
				var value = input.value;
				if (value != "") {
					html.push("// " + value + "\n");
					var temp = "";
					//html.push('panel.add(' + value + ', "' + r);
					if (td.rowSpan > 1 || td.colSpan > 1)
						temp += "," + (c + td.colSpan - 1) + "," + (r + td.rowSpan - 1);
					html.push('panel.add(' + value + ', "' + c + ',' + r + temp + '");\n\n');
				}
			}
		}
	}

	var outputArea = document.getElementById("output");
	outputArea.value = html.join("");
}

function tableNumbering() {
	columnLength = table.rows[0].cells.length;
	rowLength = table.rows.length;

	for (r = 1; r < rowLength; r++) {
		table.rows[r].cells[0].firstChild.innerHTML = "Row " + r;
	}

	for (c = 1; c < columnLength; c++) {
		table.rows[0].cells[c].firstChild.innerHTML = "Column " + c;
	}
}

function onSave() {

	var columnLength = table.rows[0].cells.length - 1;
	var rowLength = table.rows.length - 1;
	var dataArray = new Array();

	dataArray[0] = { rowLength, columnLength };

	for (var i = 1; i <= rowLength; i++) {

		dataArray[i] = new Array();

		for (var j = 1; j <= columnLength; j++) {
			var cell = table.rows[i].cells[j];
			if (typeof cell != 'undefined') {
				dataArray[i][j] = { value: cell.children[0].value, rowSpan: cell.rowSpan, colSpan: cell.colSpan };
			}
		}
	}

	console.log(dataArray);
	var jsonData = JSON.stringify(dataArray);
	var blob = new Blob([jsonData], { type: "text/plain;charset=utf-8" });
	saveAs(blob, "tableLayoutHelper.json");
}

function onLoad() {
	var reader = new FileReader();

	reader.onload = function (event) {
		var jsonObj = JSON.parse(event.target.result);
		console.log(jsonObj);
		var columnLength = jsonObj[0].columnLength + 1;
		var rowLength = jsonObj[0].rowLength + 1;
		createTable(jsonObj, rowLength, columnLength);
	}

	reader.readAsText(event.target.files[0]);
}

