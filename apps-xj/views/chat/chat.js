
var chat = {};
var chatApiHead = '/dzgzpt-wsys/';
var chatApi = {
    querySwry: chatApiHead + 'api/hb/chat/querySwry', /* 查询 */
    queryMsg: chatApiHead + 'api/hb/chat/queryMsg', /* 查询 */
    queryAllMsgById: chatApiHead + 'api/hb/chat/queryAllMsgById', /* 查询 */
    queryMsgByMyIdToId: chatApiHead + 'api/hb/chat/queryMsgByMyIdToId', /* 查询 */
    addMsg: chatApiHead + 'api/hb/chat/addMsg', /* 增加 */
    updateMsgStatusByTime: chatApiHead + 'api/hb/chat/updateMsgStatusByTime', /* 更新状态 */
    getSwryxx: chatApiHead + 'api/wtgl/public/login/session', /* 获取当前登录人员信息 */
    handleMsgByTime: chatApiHead + 'api/hb/chat/handleMsgByTime', /* 处理某个时间前的数据 */
    handleMsg: chatApiHead + 'api/hb/chat/handleMsg' /* 处理两个对象某个时间前的数据 */
};

/**
 * @desc 初始化pageIndex pageSize
 */
chat.initPage = function() {
    chat.pageIndex = 0;
    chat.pageSize = 99;
};
chat.pageIndex = 0;
chat.pageSize = 99; /* 初始化为5 */
chat.key = true; /* 防止多次点击 */
chat.isScrollBottom = false;
chat.current = {
    myId: '',
    toId: ''
};


$(function () {
    if (!chat.setCurrentUserInfo()) return;
    chat.initInterval();
    chat.init();
    chat.start();

});

/**
 * @desc 获取当前登录人员信息
 */
chat.getCurrentSwryxx = function() {
    var msg = false;
    $.ajax({
        url: chatApi.getSwryxx,
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        async: false,
        success: function(res) {
            msg = res.value;
        },
        error: function () {
            chat.showTips('登录异常~', 3000);
        }
    });
    return msg;
};

/**
 * @desc 初始化税务人员
 */
chat.initSwry = function(keywords) {
    var msg, params = {
        keywords: chat.encodeHtml(chat.trim($('#search-input').val()))
    };
    if (keywords) params.keywords = keywords;
    if (sessionStorage && sessionStorage.getItem('chat_swry')) {
        msg = chat.deepClone(sessionStorage.getItem('chat_swry'), 'parse');
    } else {
        $.ajax({
            url: chatApi.querySwry,
            data: mini.encode(params),
            type: 'POST',
            contentType: 'application/json;charset=utf-8',
            async: false,
            success: function(res) {
                msg = res.value;
            },
            error: function () {
                chat.showTips('网络异常~');
            }
        });
    }
    return msg;
};

/**
 * @desc 初始化Interval计时器
 */
chat.initInterval = function(target) {
    var queryAllMsgById = {
        name: 'queryAllMsgById',
        interval: null, /* 计时器 */
        time: 1000, /* 间隔时间 */
        weight: 1, /* 权重 */
        minVal: 8, /* 最小开始数值 */
        maxWeight: 60,
        minWeight: 1,
        count: 0, /* 计数器 */
        temp: 0, /* 上一次的数值，根据查询条数是否变化判断 */
    };
    var queryMsgByMyIdToId = {
        name: 'queryMsgByMyIdToId',
        interval: null, /* 计时器 */
        time: 200, /* 间隔时间 */
        weight: 1, /* 权重 */
        minVal: 40, /* 最小开始数值 */
        maxWeight: 60,
        minWeight: 1,
        count: 0, /* 计数器 */
        temp: 0, /* 上一次的数值，根据查询条数是否变化判断 */
    };
    if (target === 'queryMsgByMyIdToId') {
        chat.clearInterval(target);
        chat.interval.queryMsgByMyIdToId = chat.deepClone(queryMsgByMyIdToId);
    } else {
        chat.clearInterval('queryAllMsgById');
        chat.clearInterval('queryMsgByMyIdToId');
        chat.interval = {
            queryAllMsgById: chat.deepClone(queryAllMsgById),
            queryMsgByMyIdToId: chat.deepClone(queryMsgByMyIdToId)
        };
    }

};

/**
 * @desc 启动
 */
chat.start = function() {
    chat.initInterval();
    chat.interv_fn(chat.interval.queryAllMsgById, chat.initChatWindow);
};

/**
 * @desc 初始化事件绑定
 */
chat.init = function () {
    var $chatWin = mini.get('chat-win'),
        $chat = $('#chat'),
        $sendBtn = $('#send-btn'),
        $userLi = $('#chat-users-ul'),
        $pop = $('#pop'),
        $popClose = $('.chat-close-outer'),
        $searchBtn = $('#search-id'),
        $searchInput = $('#search-input'),
        $chatSearch = $('#chat-search'),
        $searchList = $('#search-id-ul');
    /**
     * 绑定 聊天窗口点击事件
     */
    $chat && $chat.click(function (e) {
        var className = $(e.target).attr('class');
        if (className && className.indexOf('search') < 0) $searchList.hide();
    });
    /**
     * 绑定 悬浮的 我的消息 图标点击事件
     */
    $pop && $pop.click(function () {
        // $pop.hide();
        // $chatWin.show();
        chat.start();
    });
    /**
     * 绑定聊天窗口右上角关闭图标点击事件
     */
    $popClose && $popClose.click(function () {
        // $pop.show();
        // $chatWin.hide();
    });
    /**
     * 绑定左侧联系人列表点击事件
     */
    $userLi && $userLi.on('click', 'li', function (e) {
        var $this = $(this);
        chat.isScrollBottom = true;
        var userInfo = chat.getAttr($this);
        $this.addClass('active');
        $this.find('span[id^=data-user-box-val]').text('');
        $this.siblings().removeClass('active');
        chat.initPage();
        chat.initInterval('queryMsgByMyIdToId');
        chat.setOtherUserInfo(userInfo);
        chat.initChatPanelHead(userInfo);
        chat.interv_fn(chat.interval.queryMsgByMyIdToId, chat.initChatPanel, 'queryMsgByMyIdToId');
    });
    /**
     * 绑定发送按钮事件
     */
    $sendBtn && $sendBtn.click(function () {
        chat.handleSend();
    });
    /**
     * @desc 键盘事件
     */
    $("#chat-textarea").keydown(function (e) {
        if (e.which === 13) chat.handleSend();
    });
    /**
     * 绑定搜索键盘事件
     */
    $searchInput && $searchInput.keydown(function (e) {
        if (e.which === 13) chat.handleSearch($searchInput, $searchList);
    });
    /**
     * 绑定搜索按钮事件
     */
    $searchBtn && $searchBtn.click(function () {
        chat.handleSearch($searchInput, $searchList);
    });
    /**
     * 绑定搜索下拉列表点击事件
     */
    $searchList && $searchList.click(function (e) {
        $searchList.hide();
        var target = $(e.target);
        target.attr('data-time', chat.getTimestamp());
        var userInfo = chat.getAttr(target);
        userInfo.time = new Date().getTime();
        if (!userInfo.toId) return;
        if (userInfo.toId === chat.getCurrentUserInfo('myId')) return;
        var ids = chat.alreayExistLi();
        ids = chat.filterArrInMyself(ids.concat([userInfo]));
        ids = chat.sortArr(ids, 'time');
        var contentHtml = chat.getContentHtml(ids);
        if (contentHtml) {
            $userLi.html(contentHtml);
            var tar = $('#chat-users-ul-li' + userInfo.toId);
            tar && tar.click();
            $searchInput.val('');
        }
        chat.queryAllMsgById();
    });
};
/**
 * @desc 过滤数组得到符合条件的人员
 */
chat.filterSwry = function(keyword) {
    var swry = chat.initSwry(),
        temp = [];
    if (!swry) return;
    for (var i = 0, len = swry.length; i < len; i += 1) {
        var item = swry[i];
        if (item.swryDm.indexOf(keyword) >= 0 || item.swrymc.indexOf(keyword) >= 0) temp.push(item);
    }
    return temp;
};
/**
 * @desc 搜索操作
 */
chat.handleSearch = function($searchInput, $searchList) {
    var val = $searchInput.val();
    if (!val || !chat.trim(val)) {
        chat.showTips('请输入用户ID或名称');
        return;
    }
    var swry = chat.filterSwry(val);
    if (!swry) return;
    var contentHtml = chat.getContentHtml(swry, ['time', 'swrymc', 'swryDm'], true);
    $searchList.html(contentHtml);
    $searchList.show();
};
/**
 * @desc 发送操作
 */
chat.handleSend = function() {
    if (!chat.addMsg()) return;
    chat.isScrollBottom = true;
    chat.initInterval('queryMsgByMyIdToId');
    chat.interv_fn(chat.interval.queryMsgByMyIdToId, chat.initChatPanel);
};
/**
 * @desc 当前时间戳
 */
chat.getTimestamp = function() {
    return new Date().getTime();
};
/**
 * @desc 获取当前节点属性
 */
chat.getAttr = function(target, one) {
    if (one) return target.attr(one);
    return {
        toName: target.attr('data-name'),
        toId: target.attr('data-to-id'),
        time: target.attr('data-time')
    }
};
/**
 * @desc 设置当前节点属性
 */
chat.setAttr = function(target, obj) {
    target.attr('data-name', obj.toName);
    target.attr('data-to-id', obj.toId);
    target.attr('data-time', obj.time);
};
/**
 * @desc 赋值当前用户信息
 */
chat.setCurrentUserInfo = function() {
    var info = chat.getCurrentSwryxx();
    if (!info) return false;
    chat.current.myId = info.userId;
    var myInfo = chat.initSwry(info.userId);
    if (!myInfo || !myInfo.length) return false;
    chat.current.myName = myInfo[0].swrymc;
    return true;
};
/**
 * @desc 获取当前用户信息
 */
chat.getCurrentUserInfo = function(key) {
    if (key === 'myId') return chat.current.myId;
    if (key === 'myName') return chat.current.myName;
};
/**
 * @desc 赋值对方用户信息
 */
chat.setOtherUserInfo = function(userInfo) {
    chat.current.toId = userInfo.toId;
    chat.current.toName = userInfo.toName;
};
/**
 * @desc 获取对方用户信息
 */
chat.getOtherUserInfo = function() {
    return chat.current;
};
/**
 * @desc 初始化聊天头部信息
 */
chat.initChatPanelHead = function(userInfo) {
    var headTitle = $('.chat-head-title');
    headTitle.text(userInfo.toName);
    chat.setAttr(headTitle, userInfo);
    $('.chat-right').show();
};
/**
 * @desc 初始化参数
 */
chat.initParams = function(newObj) {
    var myId = chat.getCurrentUserInfo('myId'),
        myName = chat.getCurrentUserInfo('myName'),
        userInfo = chat.getOtherUserInfo();
    newObj = newObj || {};
    return $.extend({
        myId: myId,
        myName: myName,
        toId: userInfo.toId,
        toName: userInfo.toName,
        pageIndex: chat.pageIndex,
        pageSize: chat.pageSize
    }, newObj);
};
/**
 * @desc 初始化聊天面板HTML
 */
chat.initChatPanel = function(callback) {
    var msg = chat.queryMsgByMyIdToId(callback),
        contentHtml = '';
    if (!msg) return;
    msg = chat.sortArr(msg, 'time', true);
    for (var i = 0, len = msg.length; i < len; i += 1) {
        var item = msg[i];
        var flag = item.myId === chat.getCurrentUserInfo('myId') ? 'me' : 'you';
        contentHtml += '<div class="msg">' +
                            '<div class="txt-' + flag + '">' +
                                '<span class="msg-time time-' + flag + '">' +
                                    chat.showDate(item.time) +
                                '</span>' +
                            '</div>' +
                            '<div class="txt-' + flag + '">' +
                                '<span class="msg-ball msg-' + flag + '">' +
                                    chat.decodeHtml(item.content) +
                                '</span>' +
                            '</div>' +
                        '</div>';
    }
    $('#chat-list').html(contentHtml);
    var tempObj = sessionStorage.getItem('tempObj');
    if (tempObj) {
        tempObj = JSON.parse(tempObj);
        if (chat.current.toId === tempObj.id) chat.isScrollBottom = !(tempObj.num === msg.length);
    }
    sessionStorage.setItem('tempObj', JSON.stringify({
        id: chat.current.toId,
        num: msg.length
    }));
    chat.scrollBottom();
};

/**
 * @desc 显示日期
 */
chat.showDate = function(val) {
    var date = chat.formatDate(val, 'yyyy-MM-dd'),
        time1 = chat.formatDate(val, 'hh:mm:ss'),
        time2 = chat.formatDate(val, 'hh:mm'),
        today = chat.formatDate(new Date(), 'yyyy-MM-dd');
    if (date === today) return time1;
    return date + ' ' + time2
};

/**
 * @desc 查询聊天面板消息
 */
chat.queryMsgByMyIdToId = function(callback) {
    var params = chat.initParams();
    var msg = [];
    $.ajax({
        url: chatApi.queryMsgByMyIdToId,
        data: mini.encode(params),
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        async: false,
        success: function(res) {
            msg = res.value;
            if (res && res.success && res.value) {
                if (callback) callback(msg.length);
            } else {
                if (callback) callback(null);
            }
        },
        error: function () {
            chat.showTips('网络异常~');
            if (callback) callback(null);
        }
    });
    return msg;
};
/**
 * @desc 发送信息
 */
chat.addMsg = function() {
    var target = $('#chat-textarea'),
        content = chat.encodeHtml(chat.trim(target.val()));
    if (!content || !chat.key) {
        chat.showTips(!content ? '不能发送空白消息' : '您发送速度过快，系统跟不上了');
        return;
    }
    chat.hasKey();
    var params = chat.initParams({
        content: content
    });
    if (!params.myId || !params.toId) {
        chat.showTips('当前接收方不存在');
        return;
    }
    if (content && content.length > 80) {
        chat.showTips('请输入80字内的内容');
        return;
    }
    var msg;
    $.ajax({
        url: chatApi.addMsg,
        data: mini.encode(params),
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        async: false,
        success: function(res) {
            msg = res.value;
            setTimeout(function () {
                target.val('');
            });
        },
        error: function () {
            chat.showTips('网络异常~')
        }
    });
    // chat.interval.queryMsgByMyIdToId.
    return msg;
};

/**
 * @desc 初始化聊天窗口HTML
 */
chat.initChatWindow = function(callback) {
    var msg = chat.queryAllMsgById(callback);
    if (!msg) return;
    var contentHtml = '',
        ids = chat.alreayExistLi();
    var newMsg = chat.handleNewMsg(msg);
    msg  = chat.filterChatWindowData(msg);
    msg = chat.filterArrInMyself(msg.concat(ids), null, newMsg);
    msg = chat.sortArr(msg, 'time');
    contentHtml = chat.getContentHtml(msg);
    if (contentHtml) $('#chat-users-ul').html(contentHtml);
    chat.userLiCss();
};
/**
 * @desc userList-点击焦点样式
 */
chat.userLiCss = function() {
    var toId= chat.getOtherUserInfo().toId;
    if (toId) {
        $('#data-user-box-val' + toId).text('');
        $('#chat-users-ul-li' + toId).addClass('active');
    }
};
/**
 * @desc 已存在的li
 */
chat.filterChatWindowData = function(data) {
    var msg = data || [],
        myId = chat.getCurrentUserInfo('myId');
    for (var n = 0, nLen = msg.length; n < nLen; n += 1) {
        var nItem = msg[n], temp = chat.deepClone(msg[n]);
        if (nItem.toId === myId) {
            nItem.myId = temp.toId;
            nItem.myName = temp.toName;
            nItem.toId = temp.myId;
            nItem.toName = temp.myName;
        }
    }
    return msg;
};
/**
 * @desc 已存在的li
 */
chat.alreayExistLi = function() {
    var alreayExist = $('#chat-users-ul li'),
        ids = [];
    for (var n = 0, nLen = alreayExist.length; n < nLen; n += 1) {
        var nItem = $(alreayExist[n]);
        ids.push(chat.getAttr(nItem));
    }
    return ids;
};
/**
 * @desc html模板
 */
chat.getContentHtml = function(ArrObj, keys, searchList) {
    var contentHtml = '';
    for (var i = 0, len = ArrObj.length; i < len; i += 1) {
        var item = ArrObj[i], temp = '';
        if (searchList) {
            contentHtml += chat.contentHtmlSearchList(item, keys);
        } else {
            contentHtml += chat.contentHtml(item, keys);
        }
    }
    return contentHtml;
};
/**
 * @desc 滚动条到最底部
 */
chat.scrollBottom = function() {
    if (!chat.isScrollBottom) return;
    var list = document.getElementById('chat-msgs');
    list.scrollTop = list.scrollHeight;
    chat.isScrollBottom = false;
};
/**
 * @desc html模板-userList
 */
chat.contentHtml = function(item, keys) {
    keys = keys || ['time', 'toName', 'toId'];
    var time = chat.trim(item[keys[0]]),
        toName = chat.trim(item[keys[1]] || item[keys[2]]),
        toId = chat.trim(item[keys[2]]);
    return '<li id="chat-users-ul-li' + toId + '" data-time="' + time + '" data-name="' + toName + '" data-to-id="' + toId + '">' +
                '<span class="user-box" title="' + toName + '(' + toId + ')' + '">' +
                    toName + '(' + toId + ')' +
                '</span>' +
                '<span class="user-box-val ' + (item.val ? 'has-noread' : '') + '" id="data-user-box-val' + toId + '">·</span>' +
            '</li>';
};
/**
 * @desc html模板-searchList
 */
chat.contentHtmlSearchList = function(item, keys) {
    keys = keys || ['time', 'name', 'toId'];
    var toName = chat.trim(item[keys[1]] || item[keys[2]]),
        toId = chat.trim(item[keys[2]]);
    return '<li data-name="' + toName + '" data-to-id="' + toId + '">' + toName + '(' + toId + ')' + '</li>';
};
/**
 * @desc 查询聊天窗口所有消息
 */
chat.queryAllMsgById = function(callback) {
    var params = chat.initParams();
    var msg = [];
    $.ajax({
        url: chatApi.queryAllMsgById,
        data: mini.encode(params),
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        async: false,
        success: function(res) {
            msg = res.value;
            if (res && res.success && res.value) {
                if (callback) callback(msg.length);
            } else {
                if (callback) callback(null);
            }
        },
        error: function () {
            chat.showTips('网络异常~');
            if (callback) callback(null);
        }
    });
    chat.userLiCss();
    // var t1 = Number(msg[0].time),
    //     t2 = Number(msg[msg.length - 1].time),
    //     maxT = Math.max(t1, t2),
    //     minT = Math.min(t1, t2),
    //     now = new Date().getTime(),
    //     day =  86400000,
    //     day3 = 3 * day,
    //     space = Math.abs(now - minT);
    // if (space > day3) {
    //     // chat.handleMsg(now - day3);
    // } else if (space > day) {
    //     // chat.handleMsg(now - day);
    // }
    return msg;
};
/**
 * @desc 查询聊天窗口所有消息
 */
chat.handleMsg = function(time, flag) {
    var url = flag ? chatApi.handleMsgByTime : chatApi.handleMsg,
        params = $.extend(chat.initParams(), {
            time: time
        });
    ajax.post(url, mini.encode(params), function (data) {});
};
/**
 * @desc 初始化设置setInterval
 */
chat.interv_fn = function(target, fn, id) {
    if (!target || !fn) return;
    var interv = target;
    clearInterval(interv.interval);
    interv.interval = setInterval(function () {
        interv.count += 1;
        var params = $.extend(chat.initParams(), {
            time: new Date().getTime() + ''
        });
        if (id === 'queryMsgByMyIdToId') {
            $.ajax({
                url: chatApi.updateMsgStatusByTime,
                data: mini.encode(params),
                type: 'POST',
                contentType: 'application/json;charset=utf-8',
                async: false,
                success: function(res) {}
            });
        }
        fn(function (len) {
            if (len === null) {
                clearInterval(interv.interval);
                return;
            }
            if (interv.temp === len) {
                interv.weight = interv.weight > interv.maxWeight ? interv.maxWeight : (interv.weight + 2);
            } else {
                interv.temp = len;
                interv.weight = interv.weight <= interv.minWeight ? interv.minWeight : --interv.weight;
            }
            /* 跳跃增加start */
            if (interv.weight < interv.minVal) interv.weight = interv.minVal;
            if (interv.name === 'queryMsgByMyIdToId' && interv.weight < interv.minVal) interv.weight = interv.minVal;
            /* 跳跃增加end */
            chat.interv_fn(target, fn);
        });
    }, interv.time * interv.weight);
};

/**
 * @desc 格式化日期
 */
chat.formatDate = function(val, f) {
    if (!val) return val;
    var date = typeof val === 'object' ? val : (isNaN(Number(val)) ? new Date(val) : new Date(Number(val))),
        year = date.getFullYear(),
        month = chat.add0(date.getMonth() + 1),
        day = chat.add0(date.getDate()),
        hour = chat.add0(date.getHours()),
        minute = chat.add0(date.getMinutes()),
        second = chat.add0(date.getSeconds()),
        miniSeconde = chat.add0(date.getMilliseconds()),
        ft = f || 'yyyy-MM-dd',
        result = '';
    switch (ft) {
        case 'yyyy-MM-dd hh:mm:ss': result =  year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second; break;
        case 'yyyy-MM-dd hh:mm': result =  year + '-' + month + '-' + day + ' ' + hour + ':' + minute; break;
        case 'hh:mm:ss': result = hour + ':' + minute + ':' + second; break;
        case 'hh:mm': result = hour + ':' + minute; break;
        default: result = year + '-' + month + '-' + day; break;
    }
    return result;
};
/**
 * @desc 转义特殊字符
 */
chat.add0 = function(val) {
    return Number(val) < 10 ? ('0' + val) : val.toString();
};
/**
 * @desc 转义特殊字符
 */
chat.decodeHtml = function(val) {
    return val;
};
/**
 * @desc 转义特殊字符
 */
chat.encodeHtml = function(val) {
    return $('<div>').text(val).html();
};
/**
 * @desc 提示
 */
chat.showTips = function(tips, second) {
    var target = $('.tips'), time = second || 2000;
    target.text(tips).show();
    setTimeout(function () {
        target.hide();
    }, time);
};
/**
 * @desc 清除计时器
 */
chat.clearInterval = function(val) {
    if (!val) return;
    var interval = chat && chat.interval,
        target = interval && interval[val];
    if (target && target.interval) clearInterval(target.interval);
};
/**
 * @desc 去掉首尾空格
 */
chat.trim = function(val) {
    return val && val.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
/**
 * @desc 防止多次点击
 */
chat.hasKey = function() {
    chat.key = false;
    setTimeout(function () {
        chat.key = true;
    }, 1000);
};
/**
 * @desc 深克隆
 */
chat.deepClone = function(obj, flag) {
    if (flag === 'str') return JSON.stringify(obj);
    if (flag === 'parse') return JSON.parse(obj);
    return JSON.parse(JSON.stringify(obj));
};
/**
 * @desc 数组排序
 */
chat.sortArr = function(arrBase, key, desc) {
    arrBase.sort(function (a, b) {
        var aa = (a[key] ? a[key] : 0),
            bb = (b[key] ? b[key] : 0);
        if (desc) return aa - bb;
        return bb - aa;
    });
    return arrBase;
};
/**
 * @desc 过滤，防重复
 */
chat.filterArrInMyself_New = function(arrBase, key) {
    // var temp = {};
    var arr = arrBase,
        myId = chat.getCurrentUserInfo('myId'),
        temp = [];
    for (var i = 0, iLen = arr.length; i < iLen; i += 1) {
        var iItem = arr[i],
            flag = true;
        iItem.val = 0;
        for (var j = 0, jLen = temp.length; j < jLen; j += 1) {
            var jItem = temp[j];
            if (iItem[key] === jItem[key]) flag = false;
        }
        if (flag) temp.push(iItem);
    }
    return temp;
};

/**
 * @desc 处理新消息
 */
chat.handleNewMsg = function(arr) {
    var key = 'toId',
        myId = chat.getCurrentUserInfo('myId'),
        temp = [],
        tempObj = {};
    /* 别人发我 或者 我发给别人的全部消息 过滤获取所有与用户 */
    $.each(arr, function (i, item) {
        tempObj[item.myId] = {
            val: 0
        };
        tempObj[item.toId] = {
            val: 0
        };
    });
    $.each(arr, function (i, item) {
        if (item.toId === myId && item.status === '0') tempObj[item.myId].val += 1;
    });
    return tempObj;
};

/**
 * @desc 过滤，防重复---此方法前 已经将 toId myId 全部对调
 */
chat.filterArrInMyself = function(arrBase, key, newMsg) {
    key = key || 'toId';
    var arr = arrBase,
        myId = chat.getCurrentUserInfo('myId'),
        temp = [];
    /* 别人发我 或者 我发给别人的全部消息 过滤获取所有与用户 */
    for (var i = 0, iLen = arr.length; i < iLen; i += 1) {
        var iItem = arr[i],
            flag = true;
        iItem.val = 0;
        for (var j = 0, jLen = temp.length; j < jLen; j += 1) {
            var jItem = temp[j];
            if (iItem[key] === jItem[key]) flag = false;
        }
        if (flag && !(myId === iItem.myId && myId === iItem.toId)) {
            var val = newMsg && newMsg[iItem.toId] && newMsg[iItem.toId].val;
            if (val) iItem.val = val;
            temp.push(iItem);
        }
    }
    /* 对过滤的 */
    return temp;
};

/* 将对象里的日期对象进行格式化 */
chat.formatDateInObj = function(arr, keys) {
    keys = keys || ['dateCreated'];
    arr = arr instanceof Array ? arr : [arr];
    if (!arr.length) return arr;
    for (var i = 0, len = arr.length; i < len; i += 1) {
        var obj = arr[i];
        obj.fjfl = obj.fl + '类' + obj.fj + '级';
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && keys.indexOf(key) >= 0) {
                obj[key] = new Date(obj[key]).format('yyyy-MM-dd hh:mm:ss');
            }
        }
    }
    return arr;
};
