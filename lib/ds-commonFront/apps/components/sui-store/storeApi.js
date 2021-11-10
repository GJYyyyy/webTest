/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/11/21
 * Time：15:00
 *
 */

/**
 * modified by lizm 2016-11-30 11:08
 *
 * 从store方法名上区分了sessionStorage 和 localStorage，各自有各自的方法
 *
 * 增加了 has，getAll，each，serialize，deserialize 方法，
 *
 * 基于jquery.cookie 增加了操作cookie的方法 get，set，getAll，remove
 *
 **/

"use strict"
// Module export pattern from
// https://github.com/umdjs/umd/blob/master/returnExports.js
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
        root.store = factory();
    }
}(this, function () {

    // Store.js
    var store = {},
        win = (typeof window != 'undefined' ? window : global),
        doc = win.document,
        localStorageName = 'localStorage',
        sessionStorageName = 'sessionStorage',
        scriptTag = 'script',
        storage,_storage;

    store.disabled = false;

    store.setLocal = function(key, value) {};
    store.getLocal = function(key, defaultVal) {};
    store.hasLocal = function(key) { return store.getLocal(key) !== undefined };
    store.removeLocal = function(key) {};
    store.clearLocal = function() {};

    store.getAllLocal = function() {};
    store.eachLocal = function() {};

    store.setSession = function(key, value) {};
    store.getSession = function(key, defaultVal) {};
    store.hasSession = function(key) { return store.getSession(key) !== undefined };
    store.removeSession = function(key) {};
    store.clearSession = function() {};

    store.getAllSession = function() {};
    store.eachSession = function() {};

    store.serialize = function(value) {
        return JSON.stringify(value)
    };
    store.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        try { return JSON.parse(value) }
        catch(e) { return value || undefined }
    };

    // 获取cookie
    store.getCookie=function (name) {
        $.cookie.json = true;
        return $.cookie(name);
    };

    // 是否存在cookie
    store.hasCookie=function (name) {
        $.cookie.json = true;

        if ($.cookie(name)){
            return true
        }else{
            return false
        }
    };

    // 设置cookie
    store.setCookie = function (name, value, days, path) {
        $.cookie.json = true;

        if(days !==undefined && path!==undefined){
            $.cookie(name, value,{expires:days,path:path});

        }else if(days !==undefined && path===undefined){
            $.cookie(name, value,{expires:days});

        }else if(days ===undefined && path===undefined){
            $.cookie(name, value);
        }

    };

    // 获取所有cookie键值对
    store.getAllCookie = function () {
        return $.cookie();
    };

    // 删除cookie 必须传入与设置cookie时相同的参数,如 path, domain , secure
    store.removeCookie =function (name,path) {
        var result;
        if(path){
            result = $.removeCookie(name, { path: path });
        }else {
            result = $.removeCookie(name);
        }
        if(!result){console.log('删除cookie'+name+'失败')}
    };

    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    }

    function isSessionStorageNameSupported() {
        try { return (sessionStorageName in win && win[sessionStorageName]) }
        catch(err) { return false }
    }
    // sessionStorage API
    if(isSessionStorageNameSupported()){
        _storage = win[sessionStorageName];
        store.setSession = function(key, val) {
            if (val === undefined) { return store.removeSession(key) }
            _storage.setItem(key, store.serialize(val));
            return val
        };
        store.getSession = function(key, defaultVal) {
            var val = store.deserialize(_storage.getItem(key));
            return (val === undefined ? defaultVal : val)
        };
        store.removeSession = function(key) { _storage.removeItem(key) };
        store.clearSession = function() { _storage.clear() };
        store.getAllSession = function() {
            var ret = {};
            store.eachSession(function(key, val) {
                ret[key] = val
            });
            return ret
        };
        store.eachSession = function(callback) {
            for (var i=0; i<_storage.length; i++) {
                var key = _storage.key(i);
                callback(key, store.getSession(key))
            }
        }
    }
    // localStorage API
    if (isLocalStorageNameSupported()) {
        storage = win[localStorageName];
        store.setLocal = function(key, val) {
            if (val === undefined) { return store.removeLocal(key) }
            storage.setItem(key, store.serialize(val));
            return val
        };
        store.getLocal = function(key, defaultVal) {
            var val = store.deserialize(storage.getItem(key));
            return (val === undefined ? defaultVal : val)
        };
        store.removeLocal = function(key) { storage.removeItem(key) };
        store.clearLocal = function() { storage.clear() };
        store.getAllLocal = function() {
            var ret = {};
            store.eachLocal(function(key, val) {
                ret[key] = val
            });
            return ret
        };
        store.eachLocal = function(callback) {
            for (var i=0; i<storage.length; i++) {
                var key = storage.key(i);
                callback(key, store.getLocal(key))
            }
        }
    } else if (doc && doc.documentElement.addBehavior) {
        var storageOwner,
            storageContainer;
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
            storageContainer = new ActiveXObject('htmlfile');
            storageContainer.open();
            storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>');
            storageContainer.close();
            storageOwner = storageContainer.w.frames[0].document;
            storage = storageOwner.createElement('div')
        } catch(e) {
            // somehow ActiveXObject instantiation failed (perhaps some special
            // security settings or otherwse), fall back to per-path storage
            storage = doc.createElement('div');
            storageOwner = doc.body
        }
        var withIEStorage = function(storeFunction) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift(storage);
                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                storageOwner.appendChild(storage);
                storage.addBehavior('#default#userData');
                storage.load(localStorageName);
                var result = storeFunction.apply(store, args);
                storageOwner.removeChild(storage);
                return result
            }
        };

        // In IE7, keys cannot start with a digit or contain certain chars.
        // See https://github.com/marcuswestin/store.js/issues/40
        // See https://github.com/marcuswestin/store.js/issues/83
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
        var ieKeyFix = function(key) {
            return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
        };
        store.setLocal = withIEStorage(function(storage, key, val) {
            key = ieKeyFix(key);
            if (val === undefined) { return store.remove(key) }
            storage.setAttribute(key, store.serialize(val));
            storage.save(localStorageName);
            return val
        });
        store.getLocal = withIEStorage(function(storage, key, defaultVal) {
            key = ieKeyFix(key);
            var val = store.deserialize(storage.getAttribute(key));
            return (val === undefined ? defaultVal : val)
        });
        store.removeLocal = withIEStorage(function(storage, key) {
            key = ieKeyFix(key);
            storage.removeAttribute(key);
            storage.save(localStorageName)
        });
        store.clearLocal = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes;
            storage.load(localStorageName);
            for (var i=attributes.length-1; i>=0; i--) {
                storage.removeAttribute(attributes[i].name)
            }
            storage.save(localStorageName)
        });
        store.getAllLocal = function(storage) {
            var ret = {};
            store.eachLocal(function(key, val) {
                ret[key] = val
            });
            return ret
        };
        store.eachLocal = withIEStorage(function(storage, callback) {
            var attributes = storage.XMLDocument.documentElement.attributes;
            for (var i=0, attr; attr=attributes[i]; ++i) {
                callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
            }
        })
    }

    try {
        var testKey = '__storejs__';
        store.set(testKey, testKey);
        if (store.get(testKey) != testKey) { store.disabled = true }
        store.remove(testKey)
    } catch(e) {
        store.disabled = true
    }
    store.enabled = !store.disabled;

    return store
}));