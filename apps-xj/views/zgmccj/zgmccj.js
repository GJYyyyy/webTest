
function initZgmccjTab(djxh){
	$.ajax({ type : "POST",
	     url : "/dzgzpt-wsys/api/wtgl/xj/zgmccj/queryZgxxByDjxh",
        contentType: 'application/json;charset=utf-8',
		 data : mini.encode({
				"djxh" : djxh
			}),
			success : function(result) {
				json=mini.decode(result);
				if(!json.success){
					mini.alert(json.message,"提示");
				}else{
					mini.get("zgmccjXxGrid").setData(json.value);
				}
			},
			error:function(result){
				
			}
	});
}