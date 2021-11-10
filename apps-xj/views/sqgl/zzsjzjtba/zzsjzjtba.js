$(function() {
    init();
});
var grid;
var form = new mini.Form("#form1");
function init() {
    mini.parse();
    mini.get("win1").hide();
    grid = mini.get("jzjt1_grid");
}

function onrenderInfo(e){
    return "<a href='javascript:showInfo(" + mini.encode(e.record) + ")' class='check-info'>查看详情</a>";
}

function showInfo(record) {
    var obj = mini.decode(record);
    form.setData(obj);
    $("#div_htysh").hide();
    if (obj.jmsspsxDm === "SXA031900191" || obj.jmsspsxDm === "SXA031900536") {
        $("#div_htysh").show();
    }
    //绑定title
    $("#ssjmxzhzDmText").attr("title",obj.jmzcMc);
    mini.get('win1').show();
}

function onCancel() {
    mini.get('win1').hide();
}

