/**
 * Created by jiangmq on 2017/3/2.
 */
(function(){
    var date = new Date();
    $("#year-yl").text(date.getFullYear());
    $("#month-yl").text(date.getMonth()+1);
    $("#day-yl").text(date.getDate());
})()