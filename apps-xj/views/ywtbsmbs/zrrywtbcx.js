$(function () {
    gldUtil.addWaterInPages();
    init();
});

function init() {
    mini.parse();

    //证件类型需求写死
    var zjlxData = [{
        "ID":"237","MC":"中华人民共和国港澳居民居住证"},{
        "ID":"238","MC":"中华人民共和国台湾居民居住证"},{
        "ID":"201","MC":"居民身份证"},{
        "ID":"208","MC":"外国护照"},{
        "ID":"210","MC":"港澳居民来往内地通行证"},{
        "ID":"213","MC":"台湾居民来往大陆通行证"},{
        "ID":"103","MC":"税务登记证"}];
    mini.get("sfzjlx").setData(zjlxData);

    //先获取办理分局，并设置为只读
    $.ajax({
        url: "../../../../api/xj/wtgl/sxbllz/get/blfj",
        type: "get",
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            var blfj = mini.get("blfj");
            blfj.setData([{ID:resultData.blfjDm,MC:baseCode.getMcById('DM_GY_SWJG_GT3',resultData.blfjDm)}]);
            blfj.setValue(resultData?resultData.blfjDm:'');
            blfj.setReadOnly(true);
        }
    });

    //设置亮证类型
    $.ajax({
        url: "/dzgzpt-wsys/api/xj/wtgl/sxbllz/get/lzlx/02",
        type: "get",
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            var lzlx = mini.get("lzlx");
            lzlx.setData(resultData);
        }
    });

    doReset()
    // doSearch("init");
}

function doSearch(e) {
    var form = new mini.Form("#ywtbcxForm");
    form.validate();
    if(!form.isValid()){
        return false;
    }

    // if(e === "init"){
    //     mini.get("zrrsfzh").setRequired(true);
    //     mini.get("zrrxm").setRequired(true);
    //     mini.get("sfzjlx").setRequired(true);
    // }

    var grid = mini.get("ywtbcxGrid");
    var formData = form.getData(true);
    var param = $.extend(formData,{
        qdid:'02'
    });
    param = mini.encode(param);
    //获取表格dom、设置url
    grid.setUrl("../../../../api/xj/wtgl/sxbllz/get/lzsx");
    //发起请求，获取并展示表格数据
    grid.load({
        data : param
    }, function(res) {

    },function (data) {
        var obj = JSON.parse(data.errorMsg);
        mini.alert(obj.message || "查询失败,请稍后再试。")
    });
}

var reset = false;
function doReset() {
    reset = true;
    mini.get('zrrsfzh').setValue('');
    mini.get('zrrxm').setValue('');
    mini.get('sfzjlx').setValue('');
    mini.get('lzlx').setValue('');
    mini.get('slsjQ').setValue(new Date());
    mini.get('slsjZ').setValue(new Date());
    mini.get('ywtbcxGrid').setData([]);
    reset = false;
}

function slrqqChange(e) {
    mini.get("slsjZ").setMinDate(e.value);
}
function slrqzChange(e) {
    mini.get("slsjQ").setMaxDate(e.value);

}

function onMcValidation(e) {
    if(reset) return;
    if (validator.isChinese(e.value) == false) {
        e.errorText = "请输入正确的姓名";
        mini.alert("请输入正确的姓名");
        return;
    }
}
function onZjhmValidation(e) {
    if(reset) return;
    if (validator.isZjhm(e.value) == false || validator.isSfzhm(e.value) == false) {
        e.errorText = "请输入正确的证件号码";
        mini.alert("请输入正确的证件号码");
        return;
    }
}