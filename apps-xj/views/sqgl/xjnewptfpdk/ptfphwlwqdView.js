function SetData(data) {
	init(data);
}



var grid;
function init(data) {
	mini.parse();
	grid = mini.get("dbsxGrid");
	grid.setUrl("../../../../../api/xjzzszyfp/cxfwhwqd/queryFwhwList");
	doSearch(data);
}

function doSearch(tdata) {
	grid.load({"sqxh":tdata.sqxh}, function(data) {
	});
}

