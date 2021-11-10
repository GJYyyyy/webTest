/**
 * Created by ywy on 2017/5/12.
 */
mini.parse();
var r = window.location.search;
r = r.substring(1,r.length-1);
$.ajax({
	url: '/dzgzpt-wsys/api/yybs/yyxx',
	type: 'post',
	data: {
		uuid: r
	},
	success: function(data){

	},
	error: function(data){

	}
})