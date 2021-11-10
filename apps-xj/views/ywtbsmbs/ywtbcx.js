$(function () {
    gldUtil.addWaterInPages();
    init();
});

function init() {
    mini.parse();
    //先获取办理分局，并设置为只读
    $.ajax({
        url: "../../../../api/xj/wtgl/sxbllz/get/blfj",
        type: "get",
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            var blfj = mini.get("blfj");
            blfj.setData([{ ID: resultData.blfjDm, MC: baseCode.getMcById('DM_GY_SWJG_GT3', resultData.blfjDm) }]);
            blfj.setValue(resultData ? resultData.blfjDm : '');
            blfj.setReadOnly(true);
        }
    });

    //设置亮证类型

    $.ajax({
        url: "/dzgzpt-wsys/api/xj/wtgl/sxbllz/get/lzlx/01",
        type: "get",
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            var lzlx = mini.get("lzlx");
            lzlx.setData(resultData)
        }
    });

    doReset()
}

function doSearch() {
    var nsrsbhStr = mini.get("nsrsbh").value;
    if (nsrsbhStr && validator.isNsrsbh(nsrsbhStr) == false) {
        return;
    }

    var form = new mini.Form("#ywtbcxForm");
    form.validate();
    if (!form.isValid()) {
        return false;
    }

    var grid = mini.get("ywtbcxGrid");
    var formData = form.getData(true);
    var param = mini.encode(formData);
    //获取表格dom、设置url
    grid.setUrl("../../../../api/xj/wtgl/sxbllz/get/lzsx");
    //发起请求，获取并展示表格数据
    grid.load({
        data: param
    }, function (res) {

    }, function (data) {
        var obj = JSON.parse(data.errorMsg);
        mini.alert(obj.message || "查询失败,请稍后再试。")
    });
}

var reset = false;
function doReset() {
    reset = true;
    mini.get('nsrsbh').setValue('');
    mini.get('nsrmc').setValue('');
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
    if (reset) return;
    if (validator.isChinese(e.value) == false) {
        e.errorText = "请输入正确的名称";
        mini.alert("请输入正确的名称");
        return;
    }
}

function onNsrValidation(e) {
    if (reset) return;
    if (validator.isNsrsbh(e.value) == false) {
        e.errorText = "请输入正确的纳税人识别号";
        mini.alert("请输入正确的纳税人识别号");
        return;
    }
}