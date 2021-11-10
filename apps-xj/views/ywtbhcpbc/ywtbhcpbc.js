 $(function () {
   mini.parse();
 });

 function submit() {
   var ywlsh = mini.get("ywlsh").getValue();
   var ywlx = mini.get("ywlx").getValue();

   var data = {
     sqxhs: ywlsh,
     ywlx: ywlx
   }

   $.ajax({
     url: '/dzgzpt-wsys/api/sh/ywtb/hcpbc',
     type: 'get',
     data: data,
     success: function (res) {
       if(res.success){
         $("#resultInfo").text("成功")
       }else{
        $("#resultInfo").text(res.message || '失败')
       }
      
     },
   })

 }