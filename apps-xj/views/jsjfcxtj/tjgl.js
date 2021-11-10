var swjgdm, swryissk;

function setData(swjgdm, issk, tspc) {
    mini.parse();
    tjgl.init(swjgdm, issk, tspc);
}

var tjgl = {
    tsxxUrl: 'tsxx',
    sktsxxUrl: 'sktsxx',
    init: function (swjgdm, issk, tspc) {
        this.swjgdm = swjgdm;
        this.swryissk = issk;
        this.tspc = tspc;
        this.qymdGrid = mini.get("tjglGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        this.doSearch();
    },
    doSearch: function () {
        tjgl.qymdFrom.validate();
        if (!tjgl.qymdFrom.isValid()) {
            return false;
        }

        var formData = tjgl.qymdFrom.getData(true);
        var param = mini.decode(formData);
        tjgl.qymdGrid.setUrl("/dzgzpt-wsys/api/sh/jsjf/query/" + (tjgl.swryissk == '1' ? tjgl.sktsxxUrl : tjgl.tsxxUrl));
        tjgl.qymdGrid.load({
            nsrsbh:param.nsrsbh,
            ssglymc:param.ssglydm,
            nsrmc:param.nsrmc,
            tsrqQ:param.sqrqQ,
            tsrqZ:param.sqrqZ,
            tsswjg:tjgl.swjgdm,
            tspc:tjgl.tspc
        }, function (res) {
            // this.setData(res.data);
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        mini.get("nsrsbh").setValue("");
        mini.get("nsrmc").setValue("");
        mini.get("ssglydm").setValue("");

        mini.get("sqrqQ").setValue("");
        mini.get("sqrqZ").setValue("");
        tjgl.qymdGrid.setData('');
    },
    openTip: function (record) {
        // mini.alert(record.tsxx);
        mini.get('#tsxx-win').restore();
        $("#tsxx-inner").html(record.tsxx ? record.tsxx : '空');
        $("#fkxx-inner").html(record.hfxx ? record.hfxx : '空');
        mini.get('#tsxx-win').show();

    },
    tsxxWinClose: function () {
        $("#tsxx-inner").html('');
        $("#fkxx-inner").html('');
        mini.get('#tsxx-win').hide();
    },
    onActionRendererYq: function (e) {
        var record = e.record;
        var value = e.value || '';
        return '<a class="Delete_Button" onclick="tjgl.openTip(record)" href ="#">查看</a>';
    }
};

//form展示隐藏
$(document).ready(function() {
    $(".search").click(function() {
        showsearch();
    });
});
function showsearch() {
    if ($(".searchdiv").is(":hidden")) {
        $(".searchdiv").slideDown();
        $('.searchC').html('隐藏查询条件');
    } else {
        $(".searchdiv").slideUp();
        $('.searchC').html('显示查询条件');
    }
}

function nsrsbhValidate(e) {
    if (e.value == false) return;
    if (e.isValid) {
        if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
            e.errorText = "社会信用代码必须为15到20位的字母或数字！";
            e.isValid = false;
            return;
        }
    }
}