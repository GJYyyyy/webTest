/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/2/20
 * Time：18:43
 *
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.baseCode = factory();
    }
}(this, function () {

    var baseCode = {};

    var baseCodeData = store.getLocal('baseCode') || {version: 0};

    var checkVersionUrl = '../../../api/baseCode/get/version';
    var baseCodeUrl = '../../../api/baseCode/CombSelect/common/';

    baseCode.getDataByCodeName = function (codeName) {

        // 检查版本号
        ajax.get(checkVersionUrl, {}, function (versionOnserver) {

            // 版本号存在且与本地一致
            versionOnserver = versionOnserver.version;
            if (!!versionOnserver && versionOnserver == baseCodeData.version) {

                // 缓存中存在该codename对应的数据
                if (!!baseCodeData[codeName]) {
                    return baseCodeData[codeName]

                } else {// 不存在，则发请求，并存入缓存

                    ajax.get(baseCodeUrl + codeName, {}, function (data) {
                        baseCodeData[codeName] = data;
                        store.setLocal('baseCode', baseCodeData);
                    })
                }

            } else {
                // 版本号不一致,重新存储 baseCodeData

                baseCodeData = {version: versionOnserver};

                ajax.get(baseCodeUrl + codeName, {}, function (data) {
                    baseCodeData[codeName] = data;
                    store.setLocal('baseCode', baseCodeData);
                })

            }
        //获取版本号错误时，直接去请求
        },function (req) {
            baseCodeData = {version: 0};

            ajax.get(baseCodeUrl + codeName, {}, function (data) {
                baseCodeData[codeName] = data;
                store.setLocal('baseCode', baseCodeData);
            })
        });
        return baseCodeData[codeName];


    };

    baseCode.getMcById = function (codeName, Id) {
        var data = baseCode.getDataByCodeName(codeName);
        var MC = null;
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (obj.ID == Id) {
                    MC = obj.MC;
                    break;
                }
            }
        }
        return MC;
    };
    return baseCode;

}));
