/**
 * Created by Administrator on 2017-02-16.
 */
    console.log(gldUtil);
    var html = gldUtil.loadTemplate('FbzlView.html');
    $('body').append(html);

    $(function(){
        var data = {sqxh:parent.fbzlSqxh};
        fbzlAjax(data);
    })