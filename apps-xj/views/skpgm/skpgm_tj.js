var beforeLoad = function (e) {
    e.contentType = 'application/json;charset=utf-8'
    e.data = mini.encode(e.data)
}

var skpgmTj = {
    apiService: {
        tjApi: '/dzgzpt-wsys/api/wtgl/skpgm/cxtj/skpgmxx'
    },
    initPage: function () {
        // 选中元素
        this.elementSelect()
        // 绑定事件
        this.bindEvent()
        // 表单默认值
        this.initalize()
    },
    initalize: function () {
        // 税务机关下拉
        this.tj_grid_ele.setUrl(this.apiService.tjApi)
    },
    bindEvent: function () {
        var that = this
        this.$search_ele.on('click', function () {
            if (that.validataForm()) {
                that.queryGrid()
            }
        })
        this.swjg_select = mini.get('#swjg')
        // grid setUrl
        this.tj_grid_ele.setUrl(this.apiService.tjApi)
    },
    validataForm: function () {
        var kssjValue = this.kssj_ele.getValue() ? this.kssj_ele.getValue().format('yyyy-MM-dd') : ''
        var jssjValue = this.jssj_ele.getValue() ? this.jssj_ele.getValue().format('yyyy-MM-dd') : ''
        var swjgValue = this.swjg_ele.getValue()
        if(!swjgValue){
            mini.alert('请选择税务机关！')
            return false
        }
        if (!kssjValue || !jssjValue) {
            mini.alert('开始时间和结束时间不能为空！')
            return false
        }
        if (!!kssjValue && !!jssjValue && kssjValue > jssjValue) {
            mini.alert('结束时间不能早于开始时间！')
            return false
        }
        return true
    },
    elementSelect: function () {
        this.tj_grid_ele = mini.get('#tj_grid')
        this.swjg_ele = mini.get('#swjg')
        this.kssj_ele = mini.get('#kssj')
        this.jssj_ele = mini.get('#jssj')
        this.$search_ele = $('#search')
    },
    queryGrid: function () {
        var params = {
            swjgdm: this.swjg_ele.getValue(),
            kssj: this.kssj_ele.getValue() ? this.kssj_ele.getValue().format('yyyy-MM-dd') : '',
            jssj: this.jssj_ele.getValue() ? this.jssj_ele.getValue().format('yyyy-MM-dd') : ''
        }
        this.tj_grid_ele.load(params)
    }
}

$(function () {
    skpgmTj.initPage()
})
