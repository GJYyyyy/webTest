$(function () {
    gldUtil.addWaterInPages();
    init()
})
var gird;

function init() {
    grid = mini.get("tscxGrid");
    grid.setUrl("/sxsq-wsys/api/hgzx/xxts/queryXxts");
    
    initTscx()

}

function initTscx() {
    var date=new Date();
    date.setMonth(date.getMonth()-3);
    mini.get("tsrqJs").setValue(new Date());
    mini.get("tsrqKs").setValue(new Date(date));
    // 推送类别下拉
    var $tslb = mini.get("tslb");
    $.ajax({
        url: "/cxb-dzgzpt/api/hgzx/xxts/queryContClassByNsr",
        data: "",
        type: "get",
        success: function (lbObj) {
            var lbArr = [];

            // ES6
            // for (let i in lbObj) {
            //     var o = {};
            //     o[i] = lbObj[i];
            //     lbArr.push(o);
            // };
            // $tslb.setData(lbArr.map((v, i) => {
            //     const [lbid, lbtext] = Object.entries(v)[0];
            //     return {
            //         lbid,
            //         lbtext
            //     }
            // }))


            //兼容IE8

            function _slicedToArray(arr, i) {
                return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
            }

            function _nonIterableRest() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }

            function _iterableToArrayLimit(arr, i) {
                if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
                    return;
                }
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = undefined;
                try {
                    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                        _arr.push(_s.value);
                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally {
                    try {
                        if (!_n && _i["return"] != null) _i["return"]();
                    } finally {
                        if (_d) throw _e;
                    }
                }
                return _arr;
            }

            function _arrayWithHoles(arr) {
                if (Array.isArray(arr)) return arr;
            }

            for (var i in lbObj) {
                var o = {};
                o[i] = lbObj[i];
                lbArr.push(o);
            }

            ;
            $tslb.setData(lbArr.map(function (v, i) {
                var _Object$entries$ = _slicedToArray(Object.entries(v)[0], 2),
                    lbid = _Object$entries$[0],
                    lbtext = _Object$entries$[1];

                return {
                    lbid: lbid,
                    lbtext: lbtext
                };
            }));


        },
        error: function () {
            console.log("error")
        }
    })

    // 推送渠道
    var $tsqd = mini.get("tsqd");
    $.ajax({
        url: "/cxb-dzgzpt/api/hgzx/xxts/queryAllChannels",
        data: "",
        type: "get",
        success: function (qdobj) {

            var qdarr = [];

            // ES6
            // for (let i in qdobj) {
            //     var o = {};
            //     o[i] = qdobj[i];
            //     qdarr.push(o);
            // };

            // $tsqd.setData(qdarr.map((v, i) => {
            //     const [qdid, qdtext] = Object.entries(v)[0];
            //     return {
            //         qdid,
            //         qdtext
            //     }
            // }));

            //兼容IE8

            function _slicedToArray(arr, i) {
                return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
            }

            function _nonIterableRest() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }

            function _iterableToArrayLimit(arr, i) {
                if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
                    return;
                }
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = undefined;
                try {
                    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                        _arr.push(_s.value);
                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally {
                    try {
                        if (!_n && _i["return"] != null) _i["return"]();
                    } finally {
                        if (_d) throw _e;
                    }
                }
                return _arr;
            }

            function _arrayWithHoles(arr) {
                if (Array.isArray(arr)) return arr;
            }

            var qdarr = [];

            for (var i in qdobj) {
                var o = {};
                o[i] = qdobj[i];
                qdarr.push(o);
            }

            ;
            $tsqd.setData(qdarr.map(function (v, i) {
                var _Object$entries$ = _slicedToArray(Object.entries(v)[0], 2),
                    qdid = _Object$entries$[0],
                    qdtext = _Object$entries$[1];

                return {
                    qdid: qdid,
                    qdtext: qdtext
                };
            }));

        },
        error: function () {
            console.log("error")
        }
    })
}

function beforenodeselect1(e) {
    // e.tree.expandOnNodeClick = true;
    // 禁止选中父节点
    // if (e.isLeaf == false) {
    //     e.cancel = true;
    // }
}

function doSearch() {
    var form = new mini.Form("#tscxForm");
    var formData = form.getData(true);

    // 必填项空值验证
    if (mini.get("swjg").text === "") {
        mini.alert("所属税务机关不能为空", "提示", function () {
            mini.get("swjg").focus()
        })
        return
    }

    grid.load({
        sqrqq: formData.tsrqKs,
        sqrqz: formData.tsrqJs,
        blswjgDm: formData.swjg,
        ydzt: formData.readingStatus,
        contentClassId: formData.tslb,
        channelId: formData.tsqd,
        tsjs: formData.tsCharactor,
        nsrsbh: formData.nsrNumber,
        tsgjz: formData.tsgjz
    }, function (data) {});

}


//转换社会信用代码数据格式
function dealCharactorFormat(e) {
    if (e.value == 0) {
        return "所有"
    }
    if (e.value == 1) {
        return "法人"
    }
    if (e.value == 2) {
        return "财务负责人"
    }
    if (e.value == 3) {
        return "办税员"
    }
}

//阅读状态数据转换
function dealReadingStatus(e) {
    if (e.value == 0) {
        return "未读"
    }
    if (e.value == 1) {
        return "已读"
    }
    if (e.value == "all") {
        return "全部"
    }
}

//转换推送类别数据格式
function dealClassFormat(e) {
    if (e.value == 10) {
        return "通知公示"
    }
    if (e.value == 20) {
        return "提示提醒"
    }
    if (e.value == 30) {
        return "网校动态"
    }
    if (e.value == 40) {
        return "专题政策解读"
    }
    if (e.value == 50) {
        return "维权指南"
    }
    if (e.value == 70) {
        return "调查问卷"
    }
    if (e.value == 71) {
        return "专项调查"
    }
    if (e.value == 80) {
        return "纳税人端待办业务"
    }
    if (e.value == 2010) {
        return "办税完结提醒"
    }
    if (e.value == 2020) {
        return "办税提示信息"
    }
    if (e.value == 2030) {
        return "风险预警提醒"
    }
}


