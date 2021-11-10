/**
 * 免受理免审核（自动办理）事项查看详情
 */
function viewDetails(record) {
    var viewPageUrl = "";
    var xbtcSwsx = {};/*子功能的税务事项*/
    var viewData = mini.decode(mini.decode(record.viewData));
    ajax.get('../../data/swsxDm.json',{},
        function (responseJson) {
            responseJson=mini.decode(responseJson);
            xbtcSwsx =  responseJson['110002'].subSwsxList;
            viewPageUrl = xbtcSwsx[record.swsxDm].view;
            if(record.swsxDm === '110113'){
                var obj  = {
                    zzsybnsrdjDiv:viewData
                };
                viewData = mini.clone(obj);
            }
            xbnsrzhtcsq.initPages(viewPageUrl,viewData,record.swsxDm);
        }
    )
}
