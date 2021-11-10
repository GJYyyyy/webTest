$(function () {
    setTimeout(function () {
        initData();
    }, 10)
});
function initData() {
    var sqbylFormData = JSON.parse(sxsl_store.sqsxData.viewData).sqbylForm
    $('#basj').html(sqbylFormData.basj)
    $('#fddbrxm').html(sqbylFormData.fddbrxm)
    mini.get('bzzlBtn').hide();
}