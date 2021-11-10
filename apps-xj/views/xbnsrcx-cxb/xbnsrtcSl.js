var gzpz = {
    fpzlListfde: [],   //非定额发票种类下拉框
    dffpzgkpxeList: [],  //单份发票最高开票限额下拉框
    cannotEditFpzlDms: ['11', '04', '05', '06', '07'], // 哪些发票种类要禁止编辑
    addfdeFp: function () {
        var grid = mini.get('gzpz_gridfde');
        var newObj = {
            fpzlDm: '',
            fpzlmc: '',
            dffpzgkpxeDm: '',
            dffpzgkpxeList: [],
            jldwmc: '',
            fpgpfsDm: '1',
            myzggpsl: '',
            cpzgsl: '',
            mczggpsl: '',
            fpme: '',
            defpbz: '',
            lxkpsx: '',
            lxkpljxe: '',
            fppzhdczlxDm: '1'
        };
        grid.addRow(newObj);
    },
    deletefdeFp: function () {
        var grid = mini.get('gzpz_gridfde');
        var selecteds = grid.getSelecteds();
        if (selecteds && selecteds.length > 0) {
            mini.confirm('确定删除您当前选中的数据？', '请确定', function (action) {
                if (action === 'ok') {
                    grid.removeRows(selecteds);
                    gzpz.cellendedit();
                }
            })
        } else {
            mini.alert('请先选择您要删除的数据！');
        }
    },
    drawcell: function (e) {
        var record = e.record;
        if (e.field === 'fpzlDm') {
            e.cellHtml = record.fpzlmc;
        }
        if (e.field === 'dffpzgkpxeDm') {
            if (record.defpbz === 'Y') {
                e.cellHtml = record.jebmc;
            } else {
                $.each(record.dffpzgkpxeList, function () {
                    if (this.dffpzgkpxeDm === record.dffpzgkpxeDm) {
                        record.fpme = this.dffpzgkpxe;
                        record.dffpzgkpxemc = this.dffpzgkpxemc;
                        e.cellHtml = this.dffpzgkpxemc;
                        return false;
                    }
                })
            }
        }
    },
    cellbeginedit: function (e) {
        var record = e.record;
        var list = ['fpzlDm', 'dffpzgkpxeDm', 'myzggpsl'];
        if (list.indexOf(e.field) !== -1) {
            if (record.defpbz === 'Y') {
                e.cancel = true;
            }
        } else {
            e.cancel = true
        }
    },
    isFpNotExist: function (_index, fpzlDm) {
        var gridde = mini.get('gzpz_gridde') ? mini.get('gzpz_gridde').getData() : [];
        var gridfde = mini.get('gzpz_gridfde') ? mini.get('gzpz_gridfde').getData() : [];
        var data = gridde.concat(gridfde);
        for (var i = 0; i < data.length; i++) {
            if (i !== _index && data[i].fpzlDm === fpzlDm) {
                return false;
            }
        }
        return true;
    },
    setDefaultRowData: function (e) {
        var record = e.record;
        var fpzlDm = e.value;
        $.each(this.dataSource, function (i, selectData) {
            if (this.fpzlDm === fpzlDm) {
                var fpzlGrid = mini.get('gzpz_gridfde'); // 默认费定额种类
                if (selectData.defpbz === 'Y') { //定额发票标志，这是定额发票
                    selectData.dffpzgkpxeDm = selectData.jebmc;
                    selectData.dffpzgkpxe = selectData.jebmc; //管理端使用这个字段
                    selectData.dffpzgkpxemc = selectData.jebmc;
                    fpzlGrid = mini.get('gzpz_gridde') // 改为定额种类
                }
                if (selectData.zppzDm === '1' || selectData.zppzDm === '9') {
                    selectData.myzggpsl = selectData.mczggpsl = selectData.cpzgsl = '25';
                }
                if ((selectData.fpzlDm === '1130' || selectData.fpzlDm === '1160')) {
                    selectData.myzggpsl = selectData.mczggpsl = selectData.cpzgsl = '15';
                }
                if (selectData.fpzlDm === '13') {
                    selectData.myzggpsl = selectData.mczggpsl = selectData.cpzgsl = '10';
                }
                if (selectData.zppzDm === '3' || selectData.zppzDm === '7' || fpzlDm === '06' || fpzlDm === '07') {
                    selectData.myzggpsl = selectData.mczggpsl = selectData.cpzgsl = '50';
                }
                selectData.tzsl = '';
                selectData.tzlxDm = '';
                selectData.tzhmyzggpsl = '';
                selectData.fpgpfsDm = '1'; //购票方式默认是01
                selectData.fpgpfsMc = '验旧购新';
                //离线开票时限和累计限额
                selectData.lxkpsx = '0';
                selectData.lxkpljxe = '5000000';

                /* 增值税（专普票）发票核定 默认值不允许纳税人修改 */
                if (gzpz.cannotEditFpzlDms.indexOf(fpzlDm) > -1) {
                    selectData.dffpzgkpxeDm = '5';
                }
                fpzlGrid.updateRow(record, selectData);
                return false;
            }
        })
    },
    cellcommitedit: function (e) {
        var record = e.record;
        var zzzyList = ['1130', '1160']; // 纸质增值税专用发票
        var dzzyList = ['13']; // 电子增值税专用发票
        var zp = ['1130', '1160', '13']
        if (e.field === 'fpzlDm') {
            if (e.value && !gzpz.isFpNotExist(record.rowIndex, e.value)) {
                mini.alert('已存在该发票种类的发票票种核定!');
                e.value = '';
                e.cancel = true;
            } else {
                gzpz.setDefaultRowData(e);
            }
        }
        if (e.field === 'dffpzgkpxeDm') {
            if (record.zppzDm === '1' && e.value === '4') {
                mini.alert('增值税专用发票单张最高开票限额核定为十万元的，需要法定代表人本人前往税务机关现场采集实名信息，请确认。');
            }
            record.fpme = e.editor.getSelected().dffpzgkpxe;
            record.dffpzgkpxemc = e.editor.getSelected().dffpzgkpxemc;
        }
        var positiveNumReg = /^[1-9]\d*$/;
        // 每次最高购票数量
        if (e.field === 'mczggpsl') {
            if (!positiveNumReg.test(e.value)) {
                mini.alert('每次最高购票数量应输入大于0的整数！');
                e.cancel = true;
                return;
            }
            if (record.myzggpsl && Number(record.myzggpsl) < Number(e.value)) {
                mini.alert('每次最高购票数量不能大于每月最高购票数量！');
                e.cancel = true;
                return;
            }
            if (record.cpzgsl && Number(record.cpzgsl) < Number(e.value)) {
                mini.alert('每次最高购票数量不能大于持票最高数量！');
                e.cancel = true;
                return;
            }
            if (zzzyList.indexOf(record.fpzlDm) !== -1) {
                var value = e.value;
                if (value !== '15' && value !== '25') {
                    mini.alert(record.fpzlmc + '每月最高购票数量需为15份或者25份！');
                    e.cancel = true;
                    return;
                }
            }
            if (dzzyList.indexOf(record.fpzlDm) !== -1) {
                var value = e.value;
                if (value !== '10' && value !== '25') {
                    mini.alert(record.fpzlmc + '每月最高购票数量需为10份或者25份！');
                    e.cancel = true;
                    return;
                }
            }
        }
        // 持票最高量数量
        if (e.field === 'cpzgsl') {
            if (!positiveNumReg.test(e.value)) {
                mini.alert('持票最高量数量应输入大于0的整数！');
                e.cancel = true;
                return;
            }
            if (record.myzggpsl && Number(e.value) > Number(record.myzggpsl)) {
                mini.alert('持票最高数量不能大于每月最高购票数量');
                e.cancel = true;
                return;
            }
            if (record.mczggpsl && Number(e.value) < Number(record.mczggpsl)) {
                mini.alert('持票最高数量不能小于每次最高购票数量');
                e.cancel = true;
                return;
            }
        }
        if (e.field === 'myzggpsl') {
            if (!positiveNumReg.test(e.value)) {
                mini.alert('每月最高购票数量应输入大于0的整数！');
                e.cancel = true;
                return;
            }
            if (zp.indexOf(record.fpzlDm) === -1 && Number(e.value) % 25 !== 0 && Number(e.value) !== 0) {
                mini.alert('数量请填写25的倍数！');
                e.cancel = true;
                return;
            }
            // 专票最高25份、普票最高50份
            if ((record.zppzDm === '1' && Number(e.value) > 25) || ((record.zppzDm === '3' || record.zppzDm === '7') && Number(e.value) > 50)) {
                mini.alert('每月最高购票数量过高，请修改！');
                e.cancel = true;
                return;
            }
            if (zzzyList.indexOf(record.fpzlDm) !== -1) {
                var value = e.value;
                if (value !== '15' && value !== '25') {
                    mini.alert(record.fpzlmc + '每月最高购票数量需为15份或者25份！');
                    e.cancel = true;
                    return;
                }
            }
            if (dzzyList.indexOf(record.fpzlDm) !== -1) {
                var value = e.value;
                if (value !== '10' && value !== '25') {
                    mini.alert(record.fpzlmc + '每月最高购票数量需为10份或者25份！');
                    e.cancel = true;
                    return;
                }
            }
            var newRow = $.extend({}, record);
            newRow.mczggpsl = newRow.cpzgsl = e.value;
            mini.get('gzpz_gridfde').updateRow(record, newRow);
        }
    },
    cellendedit: function () {

    },
    //校验
    unitValidate: function () {
        var flag = true;
        // var selectedsde = mini.get('gzpz_gridde').getData();
        var selectedsde = [];
        var selectedsfde = mini.get('gzpz_gridfde').getData();
        var selecteds = selectedsde.concat(selectedsfde);
        var num = 0;
        var name = [];
        if (selecteds.length === 0) {
            mini.alert('请增加需核定的发票种类');
            return false;
        }
        $.each(selecteds, function (i, v) {
            if (!v.fpzlDm) {
                mini.alert('您选择的第' + (i + 1) + '个发票数据中，发票种类名称不能为空！');
                flag = false;
                return false;
            }
            if (['1130', '1160', '13'].indexOf(v.fpzlDm) !== -1) {
                num += Number(v.myzggpsl)
                name.push(v.fpzlmc)
            }
            if (v.defpbz === 'N') {
                if (!v.dffpzgkpxeDm) {
                    mini.alert('您选择的第' + (i + 1) + '发票数据中，单份发票最高开票限额不能为空！');
                    flag = false;
                    return false;
                }
                if (!v.myzggpsl) {
                    mini.alert('您选择的第' + (i + 1) + '发票数据中，每月最高购票数量不能为空！');
                    flag = false;
                    return false;
                }
                if (!v.mczggpsl) {
                    mini.alert('您选择的第' + (i + 1) + '发票数据中，每次最高购票数量不能为空！');
                    flag = false;
                    return false;
                }
                if (!v.cpzgsl) {
                    mini.alert('您选择的第' + (i + 1) + '发票数据中，持票最高数量不能为空！');
                    flag = false;
                    return false;
                }
            }
        });
        if (num > 25) {
            flag = false;
            mini.alert('您为新办纳税人，' + name.join('、') + '每月最高购票数量总和不可超过25份')
            return false;
        }
        if (!flag) {
            return false;
        }

        return true;
    }
}