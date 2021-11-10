mini.parse();
var addgrid;
var grid;
var wzhxytjgrid;

var wzhxyObject = {

	getObject:function(){
		var nsrsbh = mini.get("nsrsbh").getValue();
		var parameters = {
			nsrsbh : mini.get("nsrsbh").getValue(),
			ssswjg : mini.get("swjg_gl").value
		}
		return parameters;
	},
	openFrame:function(url,title,width,height){
		mini.open({
		url:url,
		title:title,
		width:width,
		height:height
	});
	}
}
wzhxyObject.urlObject = {
    Api:function () {
        return function () {
            var baseUrl = '/dzgzpt-wsys',
                realUrl = {
                	/**查询签订纳税人，税务机关*/
                    queryNsr:'/api/wzhxy/queryNsr',
                    /**删除签订的纳税人*/
                    cancelNsr:'/api/wzhxy/cancelNsr',
                    /**提交签订的纳税人*/
                    submitNsr:'/api/wzhxy/submitNsr',
                    /**获得纳税人信息*/
                    getNsrxx:'/api/wzhxy/getNsrxx' ,
                    /**统计企业数*/
                    countData:'/api/wzhxy/count/'
                }
            for (var url in realUrl) {
                realUrl[url] = baseUrl + realUrl[url];
            }
            return realUrl;
        }();
    }()
}
function onButtonEdit(e){
	//wzhxyObject.openFrame("tree.html","税务机关",300,400);
	var thisId  = e.source;
	mini.open({
		url:"tree.html",
		title:"税务机关",
		width:300,
		height:400,
		onload : function() {},
		ondestroy : function(action) {
			var iframe = this.getIFrameEl();
			if('ok' == action){
				var result = iframe.contentWindow.getSsswjg();
				thisId.setText(result)
			}
		}
	});
}