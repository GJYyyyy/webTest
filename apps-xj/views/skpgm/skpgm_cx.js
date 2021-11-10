var beforeLoad = function (e) {
    e.contentType = 'application/json;charset=utf-8'
    e.data = mini.encode(e.data)
}

var skpgmCx = {
    apiService: {
        cxApi: '/dzgzpt-wsys/api/wtgl/skpgm/query/skpgmxx'
    },
    initPage: function () {
        // 选中元素
        this.elementSelect()
        // 绑定事件
        this.bindEvent()
        // 表单默认值
        this.initalizeValue()

    },
    bindEvent: function () {
        var that = this
        this.$search_ele.on('click', function () {
            if (that.validataForm()) {
                that.queryGrid()
            }
        })
        this.nsrsbh_ele.on('input', function (value) {
            if (value.length > 20) {
                return false
            }
            return value.toUpperCase()
        })
        // grid setUrl
        this.cx_grid_ele.setUrl(this.apiService.cxApi)
    },
    validataForm: function () {
        var kssjValue = this.kssj_ele.getValue() ? this.kssj_ele.getValue().format('yyyy-MM-dd') : ''
        var jssjValue = this.jssj_ele.getValue() ? this.jssj_ele.getValue().format('yyyy-MM-dd') : ''
        var nsrsbhValue = this.nsrsbh_ele.getValue() + ''
        if (!!kssjValue && !jssjValue) {
            mini.alert('结束时间不能为空！')
            return false
        }
        if (!!kssjValue && !!jssjValue && kssjValue > jssjValue) {
            mini.alert('结束时间不能早于开始时间！')
            return false
        }
        if (nsrsbhValue.length < 15 || nsrsbhValue.length > 20) {
            mini.alert('纳税人识别号不正确，请重新输入！')
            return false
        }
        return true
    },
    initalizeValue: function () {
        // 可以为空，默认为当月的1号0:00
        var date = new Date()
        var nowFirstDay = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
        var nowDay = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        this.kssj_ele.setValue(nowFirstDay)
        this.jssj_ele.setValue(nowDay)
        // grid 设置url
        var comboData = [{'MC': '全部', 'ID': ''}, {'MC': '成功', 'ID': 'Y'}, {'MC': '失败', 'ID': 'N'}]
        this.gmbz_ele.setData(comboData)
        this.gmbz_ele.setValue('')
    },
    elementSelect: function () {
        this.cx_grid_ele = mini.get('#cx_grid')
        this.$search_ele = $('#search')
        this.kssj_ele = mini.get('#kssj')
        this.jssj_ele = mini.get('#jssj')
        this.nsrsbh_ele = mini.get('#nsrsbh')
        this.gmbz_ele = mini.get('#ifSuccess')
    },
    renderCz: function (e) {
        if (e.row.gmbz === 'Y') {
            return  '<a style="color:#2464cc;" href="javascript:skpgmCx.czConfirm(\'' + e.row.uuid+ '\')">变更发行状态</a>';
        }else{
            return '--'
        }
    },
    czConfirm: function (uuid) {
        var that = this
        mini.showMessageBox({
            width: 350,
            title: '提示',
            buttons: ['成功', '失败'],
            html: '请确认是否发行成功？',
            showModal: false,
            callback: function (action) {
                if (action === '成功') {
                    that.updataZt(uuid, 'Y')
                }
                if (action === '失败') {
                    that.updataZt(uuid, 'N')
                }
            }
        })
    },
    renderGmzt: function (e) {
        var rowData = e.row
        switch (rowData.gmbz) {
            case 'Y':
                return '是'
            case 'N':
                return '否'
            case '':
                return '--'
            default:
                return '--'
        }
    },
    renderFxzt: function (e) {
        var rowData = e.row
        if (rowData.fxbz === 'N' && rowData.gmbz === 'N') {
            return '--'
        } else {
            switch (rowData.fxbz) {
                case 'Y':
                    return '是'
                case 'N':
                    return '否'
                case '':
                    return '--'
                default:
                    return '--'
            }
        }
    },
    queryGrid: function () {
        var params = {
            nsrsbh: this.nsrsbh_ele.getValue(),
            kssj: this.kssj_ele.getValue() ? this.kssj_ele.getValue().format('yyyy-MM-dd') : '',
            jssj: this.jssj_ele.getValue() ? this.jssj_ele.getValue().format('yyyy-MM-dd') : '',
            gmbz: this.gmbz_ele.getValue()
        }
        this.cx_grid_ele.load(params,function (res) {
        },function (err) {
            if(err.errorMsg && typeof err.errorMsg === 'string'){
                mini.alert(mini.decode(err.errorMsg).message)
            }
        })
    },
    updataZt: function (uuid, fxbz) {
        var that = this
        var params = mini.encode({
            uuid: uuid,
            fxbz: fxbz
        })
        mini.mask('加载中...')
        $.ajax({
            url:'/dzgzpt-wsys/api/wtgl/skpgm/updateFxbz',
            type:'POST',
            data:params,
            contentType:'application/json; charset=UTF-8',
            success:function (res) {
                mini.unmask()
                if (res.success) {
                    that.cx_grid_ele.reload()
                } else {
                    mini.alert(res.message)
                }
            },
            error:function (err) {
                mini.unmask()
                mini.alert('网络异常，请稍后再试！')
            }
        })

    }
}

$(function () {
    skpgmCx.initPage()
})
