function initquerySwsxtzsxx(SWSX_STORE) {
    batzsData = SWSX_STORE.batzsData
    window.SWSX_STORE = SWSX_STORE
    mini.get('#blztDm').setValue('01')
    $("#title_swjgMc").text(batzsData.zgswjgMc);
    $("#foot_swjgMc").text(batzsData.zgswjgMc);
    $('#tznr').html(batzsData.tznr)
    $("#content_jg").text(batzsData.jg);
    $("#content_zg").text(batzsData.zg);
    $("#content_nsrmc").text(batzsData.nsrmc);
    $("#content_nsrsbh").text(batzsData.nsrsbh);
    $("#content_swsxMc").text(batzsData.sy);
    $("#content_swsxMc2").text(batzsData.swsxmc);
    $(".content_swsxMc3").text(batzsData.swsxmc);
    $("#content_sqrq").text(mini.formatDate(mini.parseDate(batzsData.bjrq), "yyyy年MM月dd日"));
    $(".content_sqrq2").text(mini.formatDate(mini.parseDate(batzsData.sqrq), "yyyy年MM月dd日"));
    $("#content_bjrq").text(mini.formatDate(mini.parseDate(batzsData.bjrq), "yyyy年MM月dd日"));
    $("#content_flyj").html(batzsData.yj);

    mini.get("flyj").setValue(batzsData.flyj);
    mini.get("sqxh").setValue(batzsData.sqxh);
    mini.get("swjgDm").setValue(batzsData.swjgdm);
    mini.get("jg").setValue(batzsData.jg);
    mini.get("zg").setValue(batzsData.zg);
    //通用需求展示文书号，不再展示字轨局轨
    $('#swsxTzsDiv').show();
    $('#oldWsh').hide();
    $('#kqqyWsh').show();
    $('#kqqyWsh').html("文书号：" + batzsData.wsh);
}