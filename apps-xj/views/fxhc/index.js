/**
 * Created by zhaojn on 2019/7/11
 */

var mock={
  cxList:[
      {wsh:'FX20191001123201',rwlx:'发票风险协查',shxydm:'91310120MA1HRBBA38',nsrmc:'测试纳税人1',bjqx:'2019-07-30',blztmc:'待分配',slr:'税管员01',cz:'01,02,03'},
      {wsh:'FX20191001123202',rwlx:'新办风险协查',shxydm:'913101203A1HRBBA38',nsrmc:'测试纳税人2',bjqx:'2019-07-30',blztmc:'待处理',slr:'税管员01',cz:'01,02,03'},
      {wsh:'FX20191001123203',rwlx:'风险协查',shxydm:'91310120MA14RBBA38',nsrmc:'测试纳税人3',bjqx:'2019-07-30',blztmc:'待审核',slr:'税管员01',cz:''},
      {wsh:'FX20191001123204',rwlx:'风险协查',shxydm:'91310120MA5HRBBA38',nsrmc:'测试纳税人4',bjqx:'2019-07-30',blztmc:'审核不通过',slr:'税管员01',cz:''},
      {wsh:'FX20191001123205',rwlx:'风险协查',shxydm:'91310120MA7HRBBA38',nsrmc:'测试纳税人5',bjqx:'2019-07-30',blztmc:'审核通过',slr:'税管员01',cz:''},
      {wsh:'FX20191001123206',rwlx:'风险协查',shxydm:'91310120MA3HRBBA38',nsrmc:'测试纳税人6',bjqx:'2019-07-30',blztmc:'作废',slr:'税管员01',cz:''}

  ]
};

var cx={
    init:function(){
        mini.parse();
        this.form=new mini.Form("#fxcxForm");
        this.grid=mini.get("fxcxGrid");
        this.bindEvent();
        this.doSearch();
    },
    reset:function () {
        this.form.reset();
    },
    doSearch:function () {
        this.grid.setData([]);
        this.grid.setData(mock.cxList);

        var formData = form.getData(true);

        // var param = mini.encode(formData);
        // this.grid.load({
        //     data : param
        // });
    },
    onActionRenderer:function (e) {
        // 01分配 02处理 03审核 04查看
        var dmList=e.value.split(',');
        var html='<a href="./route.html" target="">处理</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        var fplx=e.row.rwlx==='发票风险协查'?true:false;
        if(!e.value){
            return '';
        }
        if($.inArray('01',dmList)){
            html+='<a>分配</a>'
        }
        if($.inArray('02',dmList)&&fplx){
            html+='<a href="./fpTaskCl.html" target="_blank">处理</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        }
        if($.inArray('02',dmList)&&!fplx){
            html+='<a href="./xbfxForm.html" target="_blank">处理</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        }
        if($.inArray('03',dmList)&&fplx){
            html+='<a href="./fpfxForm.html?sh=Y" target="_blank">审核</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        }
        if($.inArray('03',dmList)&&!fplx){
            html+='<a href="./xbfxForm.html?sh=Y" target="_blank">审核</a>&nbsp;&nbsp;&nbsp;&nbsp;'
        }
        return html;
    },
    bindEvent:function () {
        $(document).on('click',".searchC",function () {
            if ($(".searchdiv").is(":hidden")) {
                $(".searchdiv").slideDown();
            } else {
                $(".searchdiv").slideUp();
            }
        });
    }

};

$(function () {
    cx.init();
});