var sqxh = "";
$(function(xh) {
	mini.parse();
});
function setData(data){
			var result = $("#wlxx");
			result.empty();
			var json = mini.decode(data);
			var resultData = mini.decode(json.yjqk);
			for (var i = resultData.length - 1; i >= 0; i--) {
			/*<p><span>2017-03-03</span><span>周一</span><span>17:40:39</span>您的订单待配货</p>*/
			//状态发生机构
			var	acceptAddress = resultData[i].acceptAddress;
			var remark = resultData[i].remark;
			var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	        var dateStr = mini.formatDate(resultData[i].acceptTime,'yyyy-MM-dd HH:mm:ss');
	        var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
	        var week = (weekDay[myDate.getDay()]);
	        result.append("<p><span>"+dateStr+"</span><span>"+week+"</span>"+acceptAddress+" "+remark+"</p>");
		}
}
		
