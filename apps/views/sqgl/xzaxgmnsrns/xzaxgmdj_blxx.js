$(function() {
	mini.parse();
});

function nextShowSwsxtzs() {
	//1.取补录信息数据
	var blxxForm = new mini.Form("#blxxForm");
	blxxForm.validate();
	if(!blxxForm.isValid()){
		return;
	}
	var blxxData = blxxForm.getData(true);
	CloseWindow(blxxData);
}

function CloseWindow(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}

function onCancel(e) {
	CloseWindow("cancel");
}
