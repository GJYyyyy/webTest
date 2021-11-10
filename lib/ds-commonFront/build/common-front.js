/*
    json2.js
    2015-05-03

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse. This file is provides the ES5 JSON capability to ES3 systems.
    If a project might run on IE8 or earlier, then this file should be included.
    This file does nothing on ES5 systems.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 
                            ? '0' + n 
                            : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date 
                    ? 'Date(' + this[key] + ')' 
                    : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint 
    eval, for, this 
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';
    
    var rx_one = /^[\],:{}\s]*$/,
        rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 
            ? '0' + n 
            : n;
    }
    
    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) 
            ? '"' + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' 
            : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) 
                ? String(value) 
                : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, '@')
                        .replace(rx_three, ']')
                        .replace(rx_four, '')
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

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
/**
 *@Name：Validator
 *@description:js校验通用类
 *@author：zhouqy
 *@create：2017-01-12
 */
! function(win) {
  var defaults = {
    messages: {
      required: '%s 不能为空',
    },
    callback: function(errors) {

    }
  };
  /*
   * Define the regular expressions
   */
  var numericReg = /^[0-9]+$/, //正整数
    integerReg = /^\-?[0-9]+$/, //整型（负整数和正整数）
    decimalReg = /^\-?[0-9]*\.?[0-9]+$/, //浮点型(整数和小数)
    userNameReg = /^[a-zA-Z0-9]{8,16}$/, //8到16位 数字、字母或字母数字组合
    nsrsbhReg = /^[a-zA-Z0-9\-]{15,20}$/, //15位到20位数字或字母（纳税人识别号）
    yzbm = /^[0-9]{6}$/, //邮政编码
    zjhm = /^([0-9A-Za-z]|[-]){0,20}$/,
    organizationCodeReg = /^[A-Z0-9]{9}$/, //组织机构代码（必须为9位数字字母，字母为半角大写）
    moneyReg = /^(([-]?[0-9]{1,14}[.]{1}[0-9]{1,2})$|([-]?[0-9]{1,14})$)/, //最大14位整数，最多两位小数金额
    emailReg =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, //邮箱
    alphaReg = /^[a-z]+$/i, //字母
    alphaNumericReg = /^[a-z0-9]+$/i, //字母、数字或者数字字母组合
    alphaDashReg = /^[a-z0-9_\-]+$/i, //可以含有下划线的字母、数字或者数字字母组合
    naturalReg = /^[0-9]+$/i, //自然数
    chineseReg = /^[\u4e00-\u9fa5]+$/, //中文字符
    //phoneNumReg = /^1[34578]\d{9}$/, //手机号码
    phoneNumReg = /^1[3456789]\d{9}$/,
    telNumReg = /^(0\d{2,3}-){0,1}\d{7,8}$/, //固定电话
    sfzhmReg =
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, //身份证号码
    noSpecialChar = /^[\u4e00-\u9fa5a-zA-Z0-9_\(\)$#@!\-]+$/, //不允许特殊字符
    alphaAndNumReg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]/, //数字和字母组合
    urlReg =
    /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, //url
    pwdReg =
    /(?:\d.*_)|(?:_.*\d)|(?:[A-Za-z].*_)|(?:_.*[A-Za-z])|(?:[A-Za-z].*\d)|(?:\d.*[A-Za-z])/;
  var _extend, _isObject;
  //校验位的检测
  var checkParity = function(card) {
    //15位转18位
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if (len == '18') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4,
        2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3',
        '2');
      var cardTemp = 0,
        i, valnum;
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[cardTemp % 11];
      if (valnum == card.substr(17, 1)) {
        return true;
      }
      return false;
    }
    return false;
  };

  // 15位转18位身份证号
  var changeFivteenToEighteen = function(card) {
    if (card.length == '15') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8,
        4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3',
        '2');
      var cardTemp = 0,
        i;
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      card += arrCh[cardTemp % 11];
      return card;
    }
    return card;
  };

  // 检查号码是否符合规范，包括长度，类型
  var isCardNo = function(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
      return false;
    }
    return true;
  };

  _isObject = function(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  };

  _extend = function(destination, source) {
    var property;
    for (property in destination) {
      if (destination.hasOwnProperty(property)) {
        // 若destination[property]和sourc[property]都是对象，则递归调用
        if (_isObject(destination[property]) && _isObject(source[property])) {
          arguments.callee(destination[property], source[property]);
        }
        // 若sourc[property]已存在，则跳过
        if (source.hasOwnProperty(property)) {
          continue;
        } else {
          source[property] = destination[property];
        }
      }
    }
  };
  //Validator 校验类
  function Validator() {}
  Validator.prototype = {
    //正整数
    isNumeric: function(val) {
      if (numericReg.test(val)) return true;
      return false;
    },
    //整型（负整数和正整数）
    isInteger: function(val) {
      if (integerReg.test(val)) return true;
      return false;
    },
    //邮政编码
    isYzbm: function(val) {
      if (yzbm.test(val)) return true;
      return false;
    },
    //证件号码(证件号码不同于身份证号码)
    isZjhm: function(val) {
      if (zjhm.test(val)) return true;
      return false;
    },
    //浮点型(整数和小数)
    isDecimal: function(val) {
      if (decimalReg.test(val)) return true;
      return false;
    },
    //最大14位整数，最多两位小数金额
    isMoney: function(val) {
      if (moneyReg.test(val)) return true;
      return false;
    },
    //邮箱
    isEmail: function(val) {
      if (emailReg.test(val)) return true;
      return false;
    },
    //字母
    isAlpha: function(val) {
      if (alphaReg.test(val)) return true;
      return false;
    },
    //字母、数字或者数字字母组合
    isAlphaNumeric: function(val) {
      if (alphaNumericReg.test(val)) return true;
      return false;
    },
    //可以含有下划线的字母、数字或者数字字母组合
    isAlphaDash: function(val) {
      if (alphaDashReg.test(val)) return true;
      return false;
    },
    //自然数
    isNatural: function(val) {
      if (naturalReg.test(val)) return true;
      return false;
    },
    //中文
    isChinese: function(val) {
      if (chineseReg.test(val)) return true;
      return false;
    },
    //手机号码
    isPhoneNum: function(val) {
      if (phoneNumReg.test(val)) return true;
      return false;
    },
    //固定电话
    isTelNum: function(val) {
      if (telNumReg.test(val)) return true;
      return false;
    },
    //身份证号码
    isSfzhm: function(val) {
      //检验位的检测
      if (!checkParity(val)) {
        return false;
      }
      //校验长度，类型
      if (!isCardNo(val)) {
        return false;
      }
      return true;
    },
    //特殊字符
    isNoSpecialChar: function(val) {
      if (noSpecialChar.test(val)) return true;
      return false;
    },
    //url
    isUrl: function(val) {
      if (urlReg.test(val)) return true;
      return false;
    },
    //组织机构代码，必须为9位数字字母，字母为半角大写
    isOrganizationCode: function(val) {
      if (organizationCodeReg.test(val)) return true;
      return false;
    },
    //8到16位 数字、字母或字母数字组合
    isUserName: function(val) {
      if (userNameReg.test(val)) return true;
      return false;
    },
    //密码需要8位以上，数字和英文组合，可以含有下划线
    isPwd: function(val) {
      if (pwdReg.test(val) && val.length > 7 && val.length<=16) return true;
      return false;
    },
    //数字和字母组合
    isAlphaAndNum: function(val) {
      if (alphaAndNumReg.test(val)) return true;
      return false;
    },
    //纳税人识别号(15位到20位 数字或字母)
    isNsrsbh: function(val) {
      if (nsrsbhReg.test(val)) return true;
      return false;
    }

  };
  typeof define === 'function' && define.amd ? define(function() { //requirejs加载
    return Validator;
  }) : function() { //普通script标签加载
    window.Validator = Validator;
  }();
}(window);

/*!
 * [description]
 * Function:Tools.js工具类
 * author:zhouqiyuan
 * Released under the MIT license
 *
 * Date: 2016-11-25
 */
(function (win) {
    var _extend, _isObject;

    _isObject = function (o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }

    _extend = function self(destination, source) {
        var property;
        for (property in destination) {
            if (destination.hasOwnProperty(property)) {
                // 若destination[property]和sourc[property]都是对象，则递归
                if (_isObject(destination[property]) && _isObject(source[property])) {
                    self(destination[property], source[property]);
                }
                ;
                // 若sourc[property]已存在，则跳过
                if (source.hasOwnProperty(property)) {
                    continue;
                } else {
                    source[property] = destination[property];
                }
            }
        }
    }

    // creact Tools Object
    function Tools() {
    }

    Tools.prototype = {
        constructor: Tools,
        /**
         * @description  简单的浏览器检查结果。
         *
         * * `webkit`  webkit版本号，如果浏览器为非webkit内核，此属性为`undefined`。
         * * `chrome`  chrome浏览器版本号，如果浏览器为chrome，此属性为`undefined`。
         * * `ie`  ie浏览器版本号，如果浏览器为非ie，此属性为`undefined`。**暂不支持ie10+**
         * * `firefox`  firefox浏览器版本号，如果浏览器为非firefox，此属性为`undefined`。
         * * `safari`  safari浏览器版本号，如果浏览器为非safari，此属性为`undefined`。
         * * `opera`  opera浏览器版本号，如果浏览器为非opera，此属性为`undefined`。
         *
         * @property {Object} [browser]
         */
        browser: (function (ua) {
            var ret = {},
                webkit = ua.match(/WebKit\/([\d.]+)/),
                chrome = ua.match(/Chrome\/([\d.]+)/) ||
                    ua.match(/CriOS\/([\d.]+)/),

                ie = ua.match(/MSIE\s([\d\.]+)/) ||
                    ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
                firefox = ua.match(/Firefox\/([\d.]+)/),
                safari = ua.match(/Safari\/([\d.]+)/),
                opera = ua.match(/OPR\/([\d.]+)/);

            webkit && (ret.webkit = parseFloat(webkit[1]));
            chrome && (ret.chrome = parseFloat(chrome[1]));
            ie && (ret.ie = parseFloat(ie[1]));
            firefox && (ret.firefox = parseFloat(firefox[1]));
            safari && (ret.safari = parseFloat(safari[1]));
            opera && (ret.opera = parseFloat(opera[1]));

            return ret;
        })(navigator.userAgent),

        /**
         * @description  操作系统检查结果。
         *
         * * `android`  如果在android浏览器环境下，此值为对应的android版本号，否则为`undefined`。
         * * `ios` 如果在ios浏览器环境下，此值为对应的ios版本号，否则为`undefined`。
         * @property {Object} [os]
         */
        os: (function (ua) {
            var ret = {},

                // osx = !!ua.match( /\(Macintosh\; Intel / ),
                android = ua.match(/(?:Android);?[\s\/]+([\d.]+)?/),
                ios = ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);

            // osx && (ret.osx = true);
            android && (ret.android = parseFloat(android[1]));
            ios && (ret.ios = parseFloat(ios[1].replace(/_/g, '.')));

            return ret;
        })(navigator.userAgent),

        /**
         * [isSupportTransition description]
         * 是否支持css3 transition动画属性
         * @return {Boolean} [description]
         */
        isSupportTransition: function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        },

        isIE: function () {
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                return true
            } else {
                return false;
            }
        },

        // 检测是否已经安装flash，检测flash的版本
        flashVersion: function () {
            var version;
            try {
                version = navigator.plugins['Shockwave Flash'];
                version = version.description;
            } catch (ex) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                        .GetVariable('$version');
                } catch (ex2) {
                    version = '0.0';
                }
            }
            version = version.match(/\d+/g);
            return parseFloat(version[0] + '.' + version[1], 10);
        },

        /**
         * [isSupportBase64 description]
         * @return {Boolean} 判断浏览器是否支持图片base64
         */
        isSupportBase64: function () {
            var data = new Image();
            var support = true;
            data.onload = data.onerror = function () {
                if (this.width != 1 || this.height != 1) {
                    support = false;
                }
            }
            data.src =
                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
        },
        /**
         * [trim description]去除前后空格
         * @param  {[type]} str
         * @return {[string]}
         */
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        /**
         * [extend description]扩张对象方法
         * @return {[Object]} [description]
         */
        extend: function () {
            var arr = arguments,
                result = {},
                i;
            if (!arr.length) return {};
            for (i = arr.length - 1; i >= 0; i--) {
                if (_isObject(arr[i])) {
                    _extend(arr[i], result);
                }
            }
            arr[0] = result;
            return result;
        },
        /**
         * url通过名字获取参数
         * @param attrName
         * @returns {*}
         */
        getUrlParamByName: function (attrName) {
            var locs = location.href.split("?");
            if (locs.length == 1) {
                return null;
            }
            var params = locs[1].split("&");
            var value = null;
            for(var i=0;i<params.length;i++){
                var param = params[i].split("=");
                if (param[0] == attrName) {
                    value = param[1];
                    break;
                }
            }

            return value;
        }
    };

    // Expose Tools identifiers, even in AMD
    // and CommonJS for browser emulators
    if (typeof define === "function") {
        define("Tools", [], function () {
            return new Tools();
        });
    } else {
        window.Tools = new Tools();
        return Tools;
    }
})(window);

/**
 *@Name：原生js 支持define模块化
 *@description:VerificationCode.js e.g.短信、图形验证码组件，ajax依赖jquery
 *@author：zhouqiyuan
 *@create：2016-11-23
 */
! function(win) {
  var _extend, _isObject, insertAfter;

  _isObject = function(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  };

  _extend = function(destination, source) {
    var property;
    for (property in destination) {
      if (destination.hasOwnProperty(property)) {
        // 若destination[property]和sourc[property]都是对象，则递归调用
        if (_isObject(destination[property]) && _isObject(source[property])) {
          arguments.callee(destination[property], source[property]);
        }
        // 若sourc[property]已存在，则跳过
        if (source.hasOwnProperty(property)) {
          continue;
        } else {
          source[property] = destination[property];
        }
      }
    }
  };

  insertAfter = function(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
      // 如果最后的节点是目标元素，则直接添加。因为默认是最后
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
      //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
    }
  };
  //创建验证码类
  function VerificationCode(el, options) {
    this.opt = this.extend({}, this.defaultCfg, options);
    this.$element = document.getElementById(el);
    this.el = el;
    //组件初始化
    this.init();
    //绑定事件
    this.bind();
  }

  VerificationCode.prototype = {
    constructor: VerificationCode,
    //配置默认参数
    defaultCfg: {
      len: 4, //需要产生的验证码长度,可传参数到后端生成多少位验证码
      chars: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ], //指定产生验证码的字典，若不给或数组长度为0则试用默认字典
      messageBtnValue: "短信验证码",
      api: "/JPEGServlet", //api
      el: "verificationCode-image", //target对象
      telNum: "", //手机号
      telErrInfo: "请输入正确的手机号",
      sendMessageApi: "api/", //发送短信api
      sendMsgData: {}, //请求参数
      countTime: 60,
      inputArea: "", //输入验证码的input对象绑定【  HTMLInputElement 】
      click2refresh: true, //是否点击验证码刷新验证码
      validateEven: "" //触发验证的方法名，如click，blur等
    },
    /**
     * [extend description]扩展对象方法
     * @return {[Object]} [description]
     */
    extend: function() {
      var arr = arguments,
        result = {},
        i;
      if (!arr.length) return {};
      for (i = arr.length - 1; i >= 0; i--) {
        if (_isObject(arr[i])) {
          _extend(arr[i], result);
        }
      }
      arr[0] = result;
      return result;
    },
    /**
     * [trim description]去除前后空格
     * @param  {[type]} str
     * @return {[string]}
     */
    trim: function(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    //往对象添加节点
    append: function(el, newEl) {
      el.innerHTML += newEl;
      return el;
    },
    /**
     * [children 获取子节点]
     * @param  {[Object]} curEle  [当前父节点]
     * @param  {[string]} tagName [要查找的目标的节点]
     * @return {[Object]}         [description]
     */
    children: function(curEle, tagName) {
      var nodeList = curEle.childNodes;
      var ary = [];
      if (/MSIE(6|7|8)/.test(navigator.userAgent)) {
        for (var i = 0; i < nodeList.length; i++) {
          var curNode = nodeList[i];
          if (curNode.nodeType === 1) {
            ary[ary.length] = curNode;
          }
        }
      } else {
        ary = Array.prototype.slice.call(curEle.children);
      }
      // 获取指定子元素
      if (typeof tagName === "string") {
        for (var k = 0; k < ary.length; k++) {
          curTag = ary[k];
          if (curTag.nodeName.toLowerCase() !== tagName.toLowerCase()) {
            ary.splice(k, 1);
            k--;
          }
        }
      }
      return ary;
    },

    // 初始化生成验证码
    init: function() {
      if (this.el === this.defaultCfg.el) { //图形验证码
        this.append(this.$element,
          '<input type="text"/><img src="' +
          this.opt.api +
          '" alt="图形验证码"/>');
      } else {
        this.append(this.$element,
          '<input type="text"/><button type="button">' + this.opt.messageBtnValue +
          '</button>'
        );
      }
    },
    bind: function() {
      var self = this;
      var target;
      self.el === self.defaultCfg.el ? target = "img" : target = "button";
      //刷新或发送验证码
      if (self.opt.click2refresh) {
        self.bindHandler(self.children(self.$element, target)[0],
          'click',
          function() {
            if (self.el === self.defaultCfg.el) {
              self.refresh();
            } else {
              self.sendMessageCode();
            }
          });
      }
      /**
       * 绑定验证回调函数
       */
      // self.bindHandler(self.opt.validateObj || self.opt.inputArea, self.opt.validateEven, function() {
      //     self.opt.validateFn.call(self, self.validate(), self.myCode);
      //     if (self.opt.false2refresh && !self.validate()) {
      //         self.refresh();
      //         self.opt.inputArea.focus();
      //         self.opt.inputArea.select();
      //     }
      // });
    },
    /**
     * 绑定事件方法
     * @param elem
     * @param type
     * @param handler
     */
    bindHandler: function(elem, type, handler) {
      if (window.addEventListener) { // 支持html5标准浏览器
        elem.addEventListener(type, handler, false);
      } else if (window.attachEvent) { // IE浏览器
        elem.attachEvent("on" + type, handler);
      }
    },
    refresh: function() {
      this.children(this.$element, "img")[0].setAttribute("src", this.opt
        .api + '?' + Math.random());
    },
    sendMessageCode: function() {
      var tel = this.children(this.$element, "input")[0];
      var reg = /^1[34578]\d{9}$/;
      if (!reg.test(tel.value)) {
        if (tel.nextSibling.nodeName != "SPAN") {
          var node = document.createElement("span");
          var textnode = document.createTextNode(this.opt.telErrInfo);
          node.appendChild(textnode);
          node.style.color = "red";
          insertAfter(node, tel);
          tel.style.borderColor = "red";
        }
      } else {
        if (tel.nextSibling.nodeName != "BUTTON") {
          tel.nextSibling.remove();
        }
        tel.style.borderColor = "";
        this.timeCountDown(this.children(this.$element, "button")[0],
          this.opt.countTime);
        this.sendMsg();
      }
    },
    sendMsg: function() {
      reqwest({
        url: this.opt.api,
        type: 'json',
        method: 'post',
        contentType: 'application/json',
        // headers: {
        //   'X-My-Custom-Header': 'SomethingImportant'
        // },
        success: function(res) {

        },
        error: function(err) {}
      });
    },
    timeCountDown: function(obj, count) {
      var clear = null;
      var o = {
        timer: function() {
          clear = setTimeout(arguments.callee, 1000);
          if (count === 0) {
            clearTimeout(clear);
            obj.removeAttribute('disabled');
            obj.innerHTML = "重新发送";
          } else {
            obj.setAttribute('disabled', true);
            obj.innerHTML = "已发送(" + count + "s" + ")";
            count--;
          }
        }
      };
      o.timer();
    }
  };
  typeof define === 'function' ? define(function() { //requirejs加载
    return {
      get: function() {
        new VerificationCode(arguments[0], arguments[1]);
      }
    };
  }) : function() { //普通script标签加载
    var verificationObj = {
      get: function() {
        new VerificationCode(arguments[0], arguments[1]);
      }
    };
    window.VerificationCode = verificationObj;
  }();
}(window);

/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/11/29
 * Time：10:18
 *
 */

/**
 * window.console 兼容IE8
 */
(function() {
    // Union of Chrome, Firefox, IE, Opera, and Safari console methods
    var methods = ["assert", "cd", "clear", "count", "countReset",
        "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed",
        "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd",
        "select", "table", "time", "timeEnd", "timeStamp", "timeline",
        "timelineEnd", "trace", "warn"];
    var length = methods.length;
    var console = (window.console = window.console || {});
    var method;
    var noop = function() {};
    while (length--) {
        method = methods[length];
        // define undefined methods as noops to prevent errors
        if (!console[method])
            console[method] = noop;
    }
})();



/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/25
 * Time：17:05
 *
 */
var regx = /(onload|onclick|onchange|onmousedown|onmouseover|onmouseenter|onmouseouter|onmouseup|javascript:|onmouseout|onkeyup|onkeydown|onkeypress|<script|<\/script)/gi;

(function($) {
    var $_ajax = $.ajax;
    $.extend({
        _ajax : $_ajax,
        /**
         * 重写ajax方法：增加遮罩配置及异常处理
         *
         * @param options
         *            请参见jquery.ajax参数
         * @param options.url
         *            请求url
         * @param options.type
         *            请求方式:[GET\POST]
         * @param options.data
         *            发送到服务器的数据
         * @param options.dataType
         *            预期服务器返回的数据类型，默认为json
         * @param options.success
         *            请求成功时的回调函数（error=0的情况）
         * @param options.failure
         *            请求失败时的回调函数
         * @param options.timeout
         *            请求超时时间（毫秒）
         * @param options.showMask
         *            是否显示遮罩，默认为false，手动调用时需将其设置为true
         * @param options.maskMassage
         *            显示遮罩时显示的信息，默认为"数据加载中，请稍后..."
         * @param el
         *            遮罩对象（DOM id），可选，默认为document.body
         */

        dataFilter: function(data){
            if(typeof data == "string"){
                data = data.replace(regx, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }else if(typeof data == "object" && typeof data != "undefined" && data != null){
                for(var i in data){
                    if(data[i] instanceof Array){
                        var arry = [];
                        for(var j=0;j<data[i].length;j++){
                            arry.push(this.dataFilter(data[i][j]));
                        }
                        data[i] = arry;
                    }else{
                        data[i] = this.dataFilter(data[i]);
                    }
                }
            }
            return data;
        },
        addTimeStamp:function (url) {
            var fileType = url.split('.').pop();
            var typeArr = ['html','css','js','json','xml','txt'];
            var newUrl='';
            if($.inArray(fileType,typeArr)>-1){
                newUrl = url + '?_t=' + new Date().getTime();
            }else{
                newUrl = url;
            }
            return newUrl;
        },
        ajax : function(options, el) {
            options = $.extend({
                url : "",
                type : "POST",
                data : {},
                dataType : "json",
                success : $.noop,
                failure : $.noop,
                timeout : 1000000,
                async : false, // 默认改成同步
                showMask : false,
                headers: {},
                contentType : "application/json; charset=UTF-8", // 默认为 application/x-www-form-urlencoded
                maskMassage : "数据加载中，请稍后..." // 等待提示信息
            }, options);

            //options.url = this.addTimeStamp(options.url); // 'html','css','js','json','xml','txt' 添加时间戳

            if (!options.error) {
                options.error = $.noop;
            }

            if (options.showMask) {
                mini.mask({
                    el : el,
                    html : options.maskMassage
                });
            }

            //防止XSS攻击，对提交数据进行过滤
            //options.url = options.url.replace(regx, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            //options.data = this.dataFilter(options.data);

            return $_ajax({
                url : options.url,
                type : options.type,
                dataType : options.dataType,
                contentType: options.contentType,
                data : options.data,
                timeout : options.timeout,
                cache : false,
                async : options.async,
                headers : options.headers,
                complete : function(req, st) {
                    if(options.complete){
                        options.complete.call(this, req, st);
                    }
                    if (options.showMask) {
                        mini.unmask(el);
                    }
                    if (st == "success" && req.status == "200") {
                        if (req.responseJSON) {// jsonp\json
                            if (req.responseJSON.success == false) {
                                if (req.responseJSON.messageCode == "SESSION_TIME_OUT") {//session超时
                                    //top.location.replace("/BsfwtWeb/apps/views/login/login.html");
                                } else {
                                    options.success.call(this, req.responseJSON);
//                                     alert(req.responseJSON.message, function() {
//                                         options.failure.call(this, req.responseJSON);
//                                     });
                                }
                            } else {//成功
                                options.success.call(this, req.responseJSON);
                            }
                        } else if(req.responseXML){
                            options.success.call(this, req.responseXML);
                        } else {//其他
                            var regx = /"success"[ ]?:[ ]?false/g;
                            if (regx.test(req.responseText)) {
                                var obj;
                                try {
                                    if (mini) {
                                        obj = mini.decode(req.responseText);
                                    } else {
                                        obj = jQuery.parseJSON(req.responseText);
                                    }
                                } catch (e) {
                                    obj = req.responseText;
                                }
                                if(obj.messageCode == "SESSION_TIME_OUT"){//session超时
                                    //top.location.replace("/BsfwtWeb/apps/views/login/login.html");
                                }else{
                                    options.error.call(this, req, st);
//                                     alert(obj.message, function() {
//                                         options.failure.call(this, req.responseText);
//                                     });
                                }
                                delete obj;
                            } else {
                                if(options.dataType == "json") {//兼容低版本jquery
                                    obj = jQuery.parseJSON(req.responseText);
                                    options.success.call(this, obj);
                                }else if(options.dataType == "xml"){
                                    obj = jQuery.parseXML(req.responseText);
                                    options.success.call(this, obj);
                                }else{
                                    options.success.call(this, req.responseText);
                                }
                            }
                        }
                    }else if(st == "error"){
                        options.error.call(this, req, st);
                    }
                }
            });
        }

    });
})(jQuery)

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
        root.ajax = factory();
    }
}(this, function () {
    var ajax={};
    var errorMap = {
        '404': '错误：404，服务未找到',
        '500': '错误：500，服务出错',
        '502': '系统出现异常，请联系运维人员或稍后重试！',
        '900': '错误：900，session超时',
        'timeout': '错误：timeout，连接超时',
        'parsererror': '错误：parsererror，发送数据异常'
    };
    function executeAjax(async,method, url, params, successCallback, errCallback) {

        if(!errCallback){
            // 默认的ajax error 回调函数
            errCallback=function (req, st) {
                var msg = getLocalMessage(req, st);
                mini.alert(msg);
                return false;
            }
        }
        
        $.ajax({
            type: method,
            url: url,
            data: params,
            async:async,
            success: function(res) {

                if(res.message==='ajaxSessionTimeOut'){
                    top.location.reload(true);
                    return;
                }
                ajax.response = res;
                successCallback(res);

            },
            error: function(req,st) {
                if(!req.message){
                    req.message = getLocalMessage(req,st) || '服务异常！';
                }
                errCallback(req,st);
            }
        });
    }
    function getLocalMessage(req, st) {
        var localMsg = "";
        if(st === 'error'){
            localMsg = errorMap[req.status];
        }else if( ['timeout','parsererror'].indexOf(st) !== -1 ){
            localMsg = errorMap[st];
        }
        return localMsg;
    }
    // 同步请求
    ajax.get=function (url, params, successCallback, errCallback) {

        executeAjax(false,'get',url, params, successCallback, errCallback);
    };

    ajax.post=function (url, params, successCallback, errCallback) {

        executeAjax(false,'post',url, params, successCallback, errCallback);
    };

     // 异步请求
    ajax.asyncGet=function (url, params, successCallback, errCallback) {

        executeAjax(true,'get',url, params, successCallback, errCallback);
    };

    ajax.asyncPost=function (url, params, successCallback, errCallback) {

        executeAjax(true,'post',url, params, successCallback, errCallback);
    };

    return ajax;

}));


/**
 * Created by chenjunj on 2016/11/23.
 */
/*重写Date 解决IE8及以下  无法new Date('2011-11-11')的问题*/
/*var browser=navigator.appName;
var b_version=navigator.appVersion;
var version=b_version.split(";");
var trim_Version=version[1].replace(/[ ]/g,"");*/
/*if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){*/
// 通周啟源提供的Tools判断浏览器
if(Tools.browser.ie && Tools.browser.ie===8){
    var nativeDate = Date;
    Date = function(o){
        if (arguments.length === 1 && typeof o === 'string') {
            if(/^\d{4}-\d{2}-\d{2}$/.test(o)){
                o = o.replace(/-/g,'/');
            }
            return new nativeDate(o);
        }
        if (arguments.length > 1) {
            var t = [];
            for (var j = 0; j < arguments.length; j++) {
                t.push(arguments[j]);
            }
            o = t.join(',');
        }
        return eval('new nativeDate(' + (o || '') + ')');
    };
    Date.prototype = nativeDate.prototype;
}
/*
 * 日期格式化
 * @param [formatStr]
 * @returns String
 * */
Date.prototype.format = function (formatStr) {
    var o = {
        "M+" : this.getMonth()+1, //month 月
        "d+" : this.getDate(), //day 日
        "h+" : this.getHours(), //hour 时
        "m+" : this.getMinutes(), //minute 分
        "s+" : this.getSeconds(), //second 秒
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter季度
        "S" : this.getMilliseconds() //millisecond毫秒
    };

    if(/(y+)/.test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return formatStr;
};
/*
 * 获取当月第一天
 * @param [formatStr]
 * reutrn Date/String
 * */
Date.prototype.getFirstDateOfMonth = function (formatStr) {
    var year = this.getFullYear();
    var month = this.getMonth();
    if(formatStr){
        return new Date(year,month,1).format(formatStr);
    }
    return new Date(year,month,1);
};
/*
 * 获取当月最后一天
 * @param [formatStr]
 * reutrn Date/String
 * */
Date.prototype.getLastDateOfMonth = function (formatStr) {
    var year = this.getFullYear();
    var month = this.getMonth()+1;
    if(formatStr){
        return new Date(year,month,0).format(formatStr);
    }
    return new Date(year,month,0);
};
/*
 * 获取下个月的第一天
 * @param [formatStr]
 * reutrn Date/String
 * */
Date.prototype.getFirstDateOfNextMonth = function (formatStr) {
    if(formatStr){
        return new Date(this.getLastDateOfMonth().getTime()+24*60*60*1000).format(formatStr);
    }
    return new Date(this.getLastDateOfMonth().getTime()+24*60*60*1000);
};
/*
 * 获取下个月的最后一天
 * @param [formatStr]
 * reutrn Date/String
 * */
Date.prototype.getLastDateOfNextMonth = function(formatStr){
    if(formatStr){
        return this.getFirstDateOfNextMonth().getLastDateOfMonth(formatStr);
    }
    return this.getFirstDateOfNextMonth().getLastDateOfMonth();
};
/*
 * 获取上个月的第一天
 * @param [formatStr]
 * reutrn Date/String
 * */
Date.prototype.getFirstDateOfPrevMonth = function (formatStr) {
    if(formatStr){
        return new Date(this.getFirstDateOfMonth().getTime()-24*60*60*1000).getFirstDateOfMonth(formatStr);
    }
    return new Date(this.getLastDateOfMonth().getTime()+24*60*60*1000);
};
/*
 * 获取上个月的最后一天
 * @param [formatStr]
 * reutrn Date/String
 * */
Date.prototype.getLastDateOfPrevMonth = function(formatStr){
    if(formatStr){
        return new Date(this.getFirstDateOfMonth().getTime()-24*60*60*1000).format(formatStr);
    }
    return new Date(this.getFirstDateOfMonth().getTime()-24*60*60*1000);
};
/*
 * 获取本年第一季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */
Date.prototype.getDatesOfFirstSeason = function (formatStr) {
    var year = this.getFullYear();
    var beginDate = new Date(year,0,1);
    var endDate = new Date(year,2,31);
    if(formatStr){
        return [beginDate.format(formatStr),endDate.format(formatStr)];
    }
    return [beginDate,endDate];
};
/*
 * 获取本年第二季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */
Date.prototype.getDatesOfSecondSeason = function (formatStr) {
    var year = this.getFullYear();
    var beginDate = new Date(year,3,1);
    var endDate = new Date(year,5,30);
    if(formatStr){
        return [beginDate.format(formatStr),endDate.format(formatStr)];
    }
    return [beginDate,endDate];
};
/*
 * 获取本年第三季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */
Date.prototype.getDatesOfThirdSeason = function (formatStr) {
    var year = this.getFullYear();
    var beginDate = new Date(year,6,1);
    var endDate = new Date(year,8,30);
    if(formatStr){
        return [beginDate.format(formatStr),endDate.format(formatStr)];
    }
    return [beginDate,endDate];
};
/*
 * 获取本年第四季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */
Date.prototype.getDatesOfForthSeason = function (formatStr) {
    var year = this.getFullYear();
    var beginDate = new Date(year,9,1);
    var endDate = new Date(year,11,31);
    if(formatStr){
        return [beginDate.format(formatStr),endDate.format(formatStr)];
    }
    return [beginDate,endDate];
};
/*
 * 日期比较-早于
 * */
Date.prototype.earlierThan = function (date) {
    var thisTime = this.getTime();
    var dateTime;
    if(typeof date === 'number'){
        dateTime = new Date(parseInt(date)).getTime();
    }else if(typeof date === 'string'){
        dateTime = new Date(date).getTime();
    }else if(typeof date === 'object' && date instanceof Date){
        dateTime = date.getTime();
    }
    return thisTime<dateTime;
};
/*
 * 日期比较-晚于
 * @param Int/String/Date date
 * @return boolean
 * */
Date.prototype.laterThan = function (date) {
    var thisTime = this.getTime();
    var dateTime;
    if(typeof date === 'number'){
        dateTime = new Date(parseInt(date)).getTime();
    }else if(typeof date === 'string'){
        dateTime = new Date(date).getTime();
    }else if(typeof date === 'object' && date instanceof Date){
        dateTime = date.getTime();
    }
    return thisTime>dateTime;
};
/*
 * 获取本地时间
 * @return Date
 * */
Date.localDate = null;
Date.getLocalDate = function(formatStr){
    if(formatStr){
        Date.localDate = new Date().format(formatStr);
    }else{
        Date.localDate = new Date();
    }
    return  Date.localDate;
};
/*
 * 获取服务器时间-----------------------------------------------------接口待定
 * @return Date
 * */
Date.serverDate = null;
Date.getServerDate = function(formatStr,url){
    var _url='/sb/sbcommon_checkCwbbSbqkFromGt3.do';
    if(!!url){
        _url = url;
    }
    if(!Date.serverDate){
        $.ajax({
            url : _url,
            async : false,
            type : "GET",
            data : {}
        }).success(function (result) {
            Date.serverDate = result;
        }).error(function () {
            console.log('获取服务器时间失败！');
        });
    }
    if(!!formatStr){
        Date.serverDate =  Date.serverDate.format(formatStr);
    }
    return Date.serverDate;
};
/**
 * 前台页面提示信息工具类
 *
 * @author zhaomd
 */
var MessageUtil = {};

/**
 * 前台页面提示信息 注：各功能模块请各自添加，规则："模块名称.提示信息场景":"提示信息"
 * "提示信息"内容如果需要参数，使用{index}来表示，如"{0}唯一"
 * 提示信息场景规则：以_CONFIRM结束表示确认信息，以_WARNING结束表示警告信息，以_ERROR结束表示错误信息，其他为提示信息
 *
 * @author zhaomd
 */
MessageUtil.MESSAGE = {
	/** -----------------公共提示----------------------- */
	"80483901":"请选中一条记录"	,
	"80483902":"必须选择一个缴税账号！"	,
	"80483903":"信息未作修改，不能点击下一步"	,
	"80483904":"输入数据不完整，{0}",
	"80483905":"数据格式输入不正确，请检查数据，重新填写。"	,
	"80483906":"请求提交失败，请稍后再试。"	,
	"80483907":"您未更新上传过附报资料，不能予以提交！"	,
	"80483908":"您的申请信息提交失败，请稍后提交"	,
	"80483909":"请求提交失败，错误原因：{0}"	,
	"80483910":"数据未填写完整，请检查填写的数据是否有遗漏，补充填写必录项。"	,
	"80483911":"备案已过期，请重新备案"	,
	"80483912":"已经备案，不能重复备案"	,
	"80483913":"请输入不小于本月的日期！"	,
	"80483914":"请输入正确四位数年度！"	,
	"80483915":"您还有必填项未填，不能进入下一步！"	,
	"80483916":"数据不正确，请重新输入。"	,
	"80483917":"有效期起不能大于等于有效期止！请重新修改有效期起止。"	,
	"80483918":"有效期起不能大于等于有效期止！请重新修改有效期起止。"	,
	"80483919":"请先填写有效期起！"	,
	"80483920":"请至少录入一条数据！"	,

	/** -----------------文书提示----------------------- */
	"80483921":"账户性质为\"基本存款账户\",\"预算单位专用存款账户\",\"QFII专用存款账户\"或\"临时存款账户\"时\t银行开户登记证号和发证日期不能为空！"	,
	"80483922":"查询存款账户账号信息失败，请核实是否存在存款账户账号信息。",
	"80483923":"查询停业信息失败，请确认是否存在停业登记信息，是否已自动复业。",
	"80483924":"复业日期有误，请重新审核并输入",
	"80483925":"查询非正常户信息失败",
	"80483926":"获取税收减免性质信息失败！",
	"80483927":"查询税费种认定信息失败，请稍后再试！",
	"80483928":"获取税收优惠事项失败！",
	"80483929":"请填写减征额度！",
	"80483930":"请填写减征幅度！",
	"80483931":"请填写减征税率！",
	"80483932":"有效期起必须大于2015-07-01日",
	"80483933":"获取扣缴登记信息失败！",
	"80483934":"此纳税人存在扣缴税款资格，不予受理！",
	"80483935":"您有正在办理的任务，请等待工作人员处理完后再操作",
	"80483936":"请填写扣缴税款登记_代扣代缴、代收代缴税款信息。",
	"80483937":"请选择扣缴义务人发生日期",
	"80483938":"输入数据不完整，请输入申请重新发放的的详细信息。",
	"80483939":"遗失，损毁税务证件表输入不正确，请检查！",
	"80483940":"申请重新发放表输入不正确，请检查！",
	"80483941":"查询  税务证件遗失补办 失败",
	"80483942":"停业月份止必须大于等于停业月份起，请重新选择停业月份止。",
	"80483943":"停业期限起需大于当前月",
	"80483944":"数据未填写完整，请检查填写的数据是否有遗漏，补充填写必录项。",
	"80483945":"确定删除选中记录？",
	"80483946":"查询跨区域涉税事项报告信息失败！",
	"80483947":"查询跨区域涉税事项报告申报失败，请稍后再试。",
	"80483948":"金额仅支持数字格式并保留两位小数",
	"80483949":"发生异常信息：{0}",
	"80483950":"该《跨区域涉税事项报告》逾期核销，请到税务机关接受处罚",
	"80483951":"跨区域涉税事项报验登记缴销数据或格式输入不正确，请检查！",
	"80483952":"货物信息发票起始号码不得大于货物信息发票终止号码！",
	"80483953":"劳务信息发票起始号码不得大于劳务信息发票终止号码！",
	"80483954":"货物信息发票终止号码与货物信息发票起始号码之差不等于发票份数，请检查重新填写。",
	"80483955":"货物信息发票终止号码与货物信息发票起始号码之差不等于发票份数，请检查重新填写。",
	"80483956":"当前用户税纳税人状态异常，请联系主管税务机关核实原因。",
	"80483957":"跨区域涉税事项报告数据或格式输入不正确，请检查！",
	"80483958":"数据未填写完整，请检查填写的数据是否有遗漏，补充填写必录项。",
	"80483959":"跨区域涉税事项报告的货物（劳务）信息输入不正确！",
	"80483960":"证明有效期止不得超过证明有效期起180日。请重新选择证明有效期起止时间。",
	"80483961":"货物信息有效期起不得大于货物有效期止！",
	"80483962":"劳务信息有效期起不得大于货物有效期止！",
	"80483963":"货物劳务累计销售额查询失败，请稍后再试。",
	"80483964":"查询应税服务累计销售额失败",
	"80483965":"货物劳务累计销售额的计算时间不得超过12个月，请修改货物劳务累计销售额的计算时间。",
	"80483966":"应税服务累计销售额的计算时间不得超过12个月，请修改应税服务累计销售额的计算时间。",
	"80483967":"选择“C.动漫企业为开发动漫产品提供的应税服务”的有效期止不得晚于2017年12月，请修改有效期止!",
	"80483968":"选择“J.通过卫星提供的语音通话服务、电子数据和信息的传输服务” 的有效期止不得晚于2015年12月,请修改有效期止!",
	"80483969":"有效期止不能小于有效期起！",
	"80483970":"有效期止必须大于等于有效期起+35个月！请修改有效期起止时间。",
	"80483971":"选择的简易征收方式，在页面上已存在，请重新录入！",
	"80483972":"手机验证码错误",
	"80483973":"未选择纳税人类别",
	"80483974":"未选择主营业务类别！",
	"80483975":"未选择一般纳税人资格生效之日",
	"80483976":"纳税人类别未选择！",
	"80483977":"该纳税人税务登记类型不是单位纳税人登记或临时税务登记，不能作为总机构或分支机构，请重新输入！",
	"80483978":"查询总机构纳税人是否为单位或临时纳税人失败或不存在此纳税人！",
	"80483979":"根据《增值税一般纳税人资格认定管理办法》第十二条规定，纳税人一经认定为一般纳税人后，不得转为小规模纳税人。请慎重操作！",
	"80483980":"您已登记为增值税一般纳税人，可按照要求在【发票领用】页面申请办理增值税专用发票手续",
	"80483981":"选择增值税普通发票、机动车销售统一发票、二手车销售统一发票时【单张发票最高开票限额】不能为空",

	/** -----------------公共错误提示----------------------- */





	"MSG.NOT_FIND" : "【配置错误】：消息代码[{0}]不存在。",

	/** -----------------公共----------------------- */
	"COMMON.404_ERROR" : "错误 404 - 文件或目录未找到。",
	"COMMON.TIMEOUT_FAILED" : "连接超时，请刷新后重试。",
	"COMMON.CONNECT_ERROR" : "连接失败，请检查网络后重试。",
	"COMMON.500_ERROR" : "服务出错，请联系管理员。",

	// 保存
	"COMMON.SAVE_SUCCESS" : "保存成功。",
	"COMMON.SAVE_FAILED" : "保存失败。原因可能是：{0}。",

	// 新增
	"COMMON.ADD_SUCCESS" : "新增成功。",
	"COMMON.ADD_FAILED" : "新增失败。原因可能是：{0}。",

	// 删除
	"COMMON.DEL_SUCCESS" : "删除成功。",
	"COMMON.DEL_CONFIRM" : "是否确定删除选中记录？",

	// 导出
	"COMMON.NODATA_IMPORT" : "没有要导出的数据。",
	// 导入
	"COMMON.IMPORT_NOFILE" : "请选择导入文件。",

	// 其他操作
	"COMMON.OPT_SUCCESS" : "{0}成功。",
	"COMMON.OPT_FAILED" : "{0}条记录操作成功。其中{1}条记录操作失败。<a href='javascript:MessageUtil.toggleDetail()'>点击展开不成功的对象</a><div id='messageDetail' style='display:none;'>{2}</div>",
	"COMMON.OPT_CONFIRM" : "是否确定{0}选中记录？",
	"COMMON.OPT_ADD_CONFIRM" : "记录新增成功,是否要继续新建？",

	// 选择操作
	"COMMON.SELECT_OP_ROW" : "请选择要{0}的数据。",
	"COMMON.SELECT_1" : "请选择一条记录。",
	"COMMON.SELECT_N" : "请至少选择1条记录。",

	// 校验
	"COMMON.UNIQUE_FAIL" : "{0}不能重复。",
	"COMMON.UNIQUE_CHECK_EXIST" : "{0}已经存在。",
	"COMMON.VALIDATE_FAILED" : "输入数据有误。",

	"COMMON.DB_CONNECT_ERROR" : "数据库连接异常，请联系管理员。",
	"COMMON.DB_ERROR"         : "数据库异常，请联系管理员。",
	"COMMON.CLASS_NEWINSTANCE_ERROR" : "类[{0}]创建错误。",
	"COMMON.CLASS_COVERT_ERROR" : "类{0}转换错误，可能是抽象类、数组、基本类型或void。",
	"MODEL.LINE_CHECK_EXISTS" : "节点间已经存在连接线。",
	"MODEL.LINE_CHECK_CIRCLE" : "连接后将会形成回路。",
	"MODEL.NODE_TO_ITSELF_VAIL"   : "节点不能指向自己。",
	"COMMON.GET_ENTRY_FAIL" : "获取JSON实体出错了。",
	"COMMON.FORMULA_VALID_FAIL" : "公式返回的结果值类型可能不符合预期，是否继续？",
	"COMMON.FORMULA_REQ_VALID_FAIL" : "公式不能为空。",
	"COMMON.FORMULA_INPUT_FAIL" : "公式格式输入错误:{0}",
	"COMMON.FILE_UPLOAD_FAIL"   : "文件上传出错。",
	"COMMON.477_ERROR":"账号信息不一致，请重新打开。",

	/**----------------------数据权限------------------------**/
	"SJQX.UPDATE_SUCC" : "数据权限修改成功。"

};

/**
 * 获取提示信息
 *
 * @author zhaomd
 * @param keyCode
 *            提示信息代码
 * @param params
 *            提示信息的参数
 */
MessageUtil._getMessage = function(keyCode, params) {
	params = params || [];
	var message = MessageUtil.MESSAGE[keyCode];

	if (!message) {
		if(/^[A-Z._]+$/.test(keyCode)){
			message = MessageUtil.MESSAGE["MSG.NOT_FIND"];
			params = [keyCode];
		}else{
			message = keyCode+"";
			params = [];
		}
	}

	for (var i = 0; i < params.length; i++) {
		message = message.replace(["{", i, "}"].join(""), function() {
			return params[i];
		});
	}

	// 支持message中引用提示信息代码
	var msgs = message.split("{");
	if (msgs.length > 1) {
		for (var i = 1; i < msgs.length; i++) {
			var code = msgs[i].split("}");
			if (code.length > 1) {
				if (code[0].indexOf(":") > 0) {
					code[0] = "{" + code[0] + "}";
				}
				message = message.replace(["{", code[0], "}"].join(""),
						function() {
							return MessageUtil.getMessage(code[0]);
						});
			}
		}
	}
	return message;
};

MessageUtil.getMessage = function(msg) {
	var type = $.type(msg);
	var message = "";

	if (type == 'object') {
		for (var k in msg) {
			message += MessageUtil._getMessage(k, msg[k]) + "<br/>";
		}
		if (message.length > 0) {
			message = message.substring(0, message.length - 5);
		}
	} else if (type == 'array') {
		$.each($.makeArray(msg), function(index) {
			for (var k in this) {
				message += MessageUtil._getMessage(k, this[k])
						+ "<br/>";
			}
			if (index == msg.length - 1 && message.length > 0) {
				message = message.substring(0, message.length - 5);
			}
		});
	} else {
		try {
			var _msg = $.parseJSON(msg);
			if (!_msg || _msg == null) {
				message = MessageUtil._getMessage(msg);
			} else {
				message = MessageUtil.getMessage(_msg);
			}
		} catch (e) {
			message = MessageUtil._getMessage(msg);
		}
	}
	return message;
}

/**
 * 提示信息
 *
 * @param String/Object/Array
 *            msg
 * @param Function
 *            callback 参数为按钮类型（ok、cancel）
 * @param String
 *            title 提示信息弹出窗口标题
 */
MessageUtil._msg = function(msg, callback, msgType, title) {
	var message = MessageUtil.getMessage(msg);

	if (msgType == "confirm") {// 确认信息（按钮：确定，取消）
		mini.MessageBox.show({
			minWidth : 250,
			maxWidth : 550,
			title : title || "确认",
			buttons : ["ok", "cancel"],
			message : message,
			iconCls : "mini-messagebox-question",
			callback : callback
		});
	} else if (msgType == "confirmCancel") {// 确认信息(按钮：是，否，取消)
		mini.MessageBox.show({
			minWidth : 250,
			maxWidth : 550,
			title : title || "确认",
			buttons : ["yes", "no", "cancel"],
			message : message,
			iconCls : "mini-messagebox-question",
			callback : callback
		});
	} else if (msgType == "warn") {// 警告信息
		mini.alert(message, title || "警告", callback);
	} else if (msgType == "error") {// 错误信息
		mini.showMessageBox({
			minWidth : 250,
			maxWidth : 550,
			title : title || "错误",
			buttons : ["ok"],
			message : message,
			iconCls : "mini-messagebox-error",
			callback : callback
		});
	} else {// 提示信息
		mini.showMessageBox({
			minWidth : 250,
			maxWidth : 550,
			title : title || "提示",
			buttons : ["ok"],
			message : message,
			iconCls : "mini-messagebox-info",
			callback : callback
		});
	}
}
MessageUtil.toggleDetail = function() {
	$("#messageDetail").toggle();
}

// 原生alert、confirm
window._nativeAlert = window.alert;
window.nativeAlert = function(msg) {
	var message = MessageUtil.getMessage(msg);
	if (message == MessageUtil.MESSAGE["MSG.NOT_FIND"].replace("{0}", msg)) {
		message = msg;
	}
	window._nativeAlert(message);
}
window._nativeConfirm = window.confirm;
window.nativeConfirm = function(msg, callback) {
	var message = MessageUtil.getMessage(msg);
	if (window._nativeConfirm(message)) {
		callback('ok');
	} else {
		callback('cancel');
	}
}

/**
 * 重写window.alert
 *
 * @example
 * alert("COMMON.SAVE_SUCCESS");
 * @example
 * alert({"SAVE_FAILED":["数据库无法连接"]});
 * @example
 * alert({"SAVE_FAILED":["数据库无法连接"], "COMMON.ADD_FAILED":["名称不能重复"]});
 * @example
 * alert([{"SAVE_FAILED":["数据库无法连接"]},{"SAVE_FAILED":["数据库无法连接"]}]);
 * @example
 * 参数支持使用消息代码，使用方式：{消息代码}
 * alert([{"SAVE_FAILED":["数据库无法连接"]},{"SAVE_FAILED":["{COMMON.TIMEOUT_FAILED}"]}]);
 *
 * @param {String/Object/Array}
 *            msg
 * @param {Function}
 *            callback 回调函数
 * @param {String}
 *            title 标题
 */
window.alert = function(msg, callback, title) {
	//屏蔽掉代码形式的异常信息  2014-01-24 linchen
	if(msg&&msg.constructor==String){
		if(msg.indexOf("Exception") > 0 || msg === "null"){
			msg = "服务器暂时无法连接，请稍后再试！";
		}
	}
	MessageUtil._msg(msg, callback, 'alert', title);
}
$(function(){
	mini.alert = function(msg, title, callback){
		alert(msg, callback, title);
		// document.body.scrollTop = 0;
	}
})

window.warning = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'warn', title);
}
window.error = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'error', title);
}
window.confirm = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'confirm', title);
}
window.confirmCancel = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'confirmCancel', title);
}
/*重写window.close()事件*/
win_close = window.close;
var window_close = function () {
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
        window.location.href="about:blank";
        win_close();
    } else {
        window.opener = null;
        window.open("", "_self");
        win_close();
    }
};
window.close = function () {
    window_close();
};


/**
 * Created by chenjunj on 2016/11/16.
 * Last modefied by:zhouqy
 */
/**
 * dataGrid校验
 * @param grid grid对象
 * @returns {Boolean}校验结果
 */
function validateGrid(grid) {
	grid.validate();
	if (grid.isValid() == false) {
		var error = grid.getCellErrors()[0];
		mini.alert(error.errorText, "提示信息", function() {
			grid.beginEditCell(error.record, error.column);
		});
		return false;
	}
	return true;
}
var validator = new Validator();
/*------------------------------------------------自定义vtype----begin-----------------------------------*/
/*自定义vtype:固定电话*/
mini.VTypes["telephoneErrorText"] = "3/4位区号-7/8位电话号码，如0123-12345678";
mini.VTypes["telephone"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isTelNum(v);
};

/*自定义vtype:14位整数，两位小数金额*/
mini.VTypes["int_14_digit_2ErrorText"] = "请输入最大14位整数2位小数";
mini.VTypes["int_14_digit_2"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isMoney(v);
};

/*自定义vtype:10位整数*/
mini.VTypes["int_10ErrorText"] = "请输入不大于9,999,999,999的数！";
mini.VTypes["int_10"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	if (parseFloat(v) <= 0) {
		return false;
	}
	var re = new RegExp("^([0-9]{1,10}$)");
	if (re.test(v)) return true;
	return false;
};

/*自定义vtype:非特殊字符,如果为null 不再校验，如果想检验不能为空，请加上 required="true" */
mini.VTypes["specialCharErrorText"] = "不能输入特殊字符";
mini.VTypes["specialChar"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isNoSpecialChar(v);
};

/*自定义vtype:如果不为空再开始校验是否为float*/
mini.VTypes["numericErrorText"] = "请输入数字";
mini.VTypes["numeric"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isNumeric(v);
};

/*自定义vtype:16位整数，两位小数金额*/
// mini.VTypes["double16ErrorText"] = "请输入最大16位整数2位小数";
// mini.VTypes["double16"] = function(v) {
// 	return validator.isNumeric(v);
// };

/*自定义vtype:12位整数，4位小数金额*/
mini.VTypes["double12ErrorText"] = "请输入最大12位整数4位小数";
mini.VTypes["double12"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	var re = new RegExp(
		"^(([-]?[0-9]{1,12}[.]{1}[0-9]{1,4})$|([-]?[0-9]{1,12})$)");
	if (!v || re.test(v)) return true;
	return false;
};

/*自定义vtype:邮政编码*/
mini.VTypes["yzbmErrorText"] = "请输入0～9数字，长度为6位";
mini.VTypes["yzbm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isYzbm(v);
};

/*自定义vtype:证件号码(证件号码不同于身份证号码)*/
mini.VTypes["zjhmErrorText"] = "请输入数字、字母或-，长度不超过20位";
mini.VTypes["zjhm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isZjhm(v);
};

/*自定义vtype:身份证件号码*/
mini.VTypes["sfzjhmErrorText"] = "请输入正确的身份证号码。";
mini.VTypes["sfzjhm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isSfzhm(v);
};

/*自定义vtype:组织机构代码*/
mini.VTypes["zzjgdmErrorText"] = "组织机构代码必须为9位数字字母，字母为半角大写。";
mini.VTypes["zzjgdm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isOrganizationCode(v);
};

/*自定义vtype: 用户名*/
mini.VTypes["usernameErrorText"] = "请输入8-16位字符(字母、数字组合)";
mini.VTypes["username"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isUserName(v);
};

/*自定义vtype: 8-32位英文和数字*/
mini.VTypes["englishAndNum32ErrorText"] = "请输入8-32位字符(字母、数字组合)区分大小写";
mini.VTypes["englishAndNum32"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	var re = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,32}$/;
	if (!v || re.test(v)) return true;
	return false;
};

/*自定义vtype:密码格式*/
// 密码需要8位以上，数字和英文组合，可以含有下划线
mini.VTypes["passwordErrorText"] = "密码格式不正确";
mini.VTypes["password"] = function(v) {
    return validator.isPwd(v);
};

/*自定义vtype:两次密码输入*/
mini.VTypes["rePasswordErrorText"] = "两次密码输入不一致";
mini.VTypes["rePassword"] = function(v) {
	var pwd = mini.get("password");
	if (v === pwd.value) return true;
	return false;
};

/*自定义vtype:手机号码(1+[3-8]+任意9位数)*/
mini.VTypes["mobilePhoneErrorText"] = "请输入正确的手机号码";
mini.VTypes["mobilePhone"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isPhoneNum(v);
};

/*自定义vtype:纳税人识别号*/
mini.VTypes["nsrsbhErrorText"] = "请输入正确的纳税人识别号";
mini.VTypes["nsrsbh"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isNsrsbh(v);
};

/* 自定义vtype：42位以内的字符且必须都是汉字 */
mini.VTypes["isChinese42ErrorText"] = "请输入少于42个汉字";
mini.VTypes["isChinese42"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	var re = new RegExp("^[\u4e00-\u9fa5]+$");
	if (re.test(v)) {
		if (v.length > 42) {
			return false;
		}
	}
	return true;
};

/*自定义vtype: 字母、数字或者数字字母组合*/
mini.VTypes["alphaNumericErrorText"] = "字母、数字或者数字字母组合";
mini.VTypes["alphaNumeric"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isAlphaNumeric(v);
};

/*------------------------------------------------自定义vtype----end-----------------------------------*/

/*-----------------------------------------mini组件定制化----start---------------------------*/
/*---------mini Form 增加getDataAndText方法---------------*/
mini.copyTo(mini.Form.prototype, {
	getDataAndText: function(formatted) {
		var formData = this.getData(formatted);
		var fields = this.getFields();
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].type == "combobox" || fields[i].type == "treeselect") {
				formData[fields[i].getId() + "Text"] = fields[i].getText();
			}
		}
		return formData;
	}
});
/**
 * 重写alert的宽度和高度-----------------------------------暂时屏蔽
 * @param message
 * @param title
 * @param callback
 * @returns {*}
 */
/*mini.alert = function (message, title, callback) {
return mini.MessageBox.show({
maxWidth: 550,
minWidth: 430,
minHeight: 250,
title: title || mini.MessageBox.alertTitle,
buttons: ["ok"],
message: message,
iconCls: "mini-messagebox-warning",
callback: callback
});
};*/

/** ------------------ Layout---------------------------- */
if (mini.Layout) {
	mini.Layout.prototype.mini_createRegion = mini.Layout.prototype._createRegion;
	mini.copyTo(mini.Layout.prototype, {
		_createRegion: function(options) {
			options = options || {};
			if (!options.showSplit) {
				options.showSplit = false;
			}
			if (!options.showHeader) {
				options.showHeader = false;
			}
			return this.mini_createRegion(options);
		}
	});
}
/** ------------------ DataGrid---------------------------- */
if (mini.DataGrid) {
	mini.DataGrid.prototype.mini_OnDrawCell = mini.DataGrid.prototype._OnDrawCell;
	mini.DataGrid.prototype.mini_OnCellCommitEdit = mini.DataGrid.prototype._OnCellCommitEdit;
	mini.DataGrid.prototype.mini_getData = mini.DataGrid.prototype.getData;
	mini.copyTo(mini.DataGrid.prototype, {
		width: "100%",
		height: "auto",
		showFooter: false,
		allowResize: false,
		showModified: false,
		allowUnselect: true,
		enableHotTrack: false,
		loadErrorAlert: false, //ajax请求异常时不提示url等信息
		beginEdit: function() {
			if (!this.allowCellEdit) { // 行编辑模式
				var scope = this;
				this._allowLayout = false;
				this.findRows(function(row) {
					scope.beginEditRow(row);
				});
				this._allowLayout = true;
				this.doLayout();
			}
		},
		getData: function() {
			var data = mini.DataGrid.prototype.mini_getData.apply(this, arguments);

			return mini.decode(mini.encode(data, 'yyyy-MM-dd'));
		},
		_tryFocus: function() {
			//解决点击单元格页面跳动问题
			return;
		},
		/**
		 * 扩展:单元格编辑时高亮显示可编辑单元格
		 */
		_OnDrawCell: function() {
			var e = this.mini_OnDrawCell.apply(this, arguments);
			//扩展单元格编辑时高亮显示可编辑单元格
			if (this.allowCellEdit && arguments[1].editor) {
				e.cellCls = e.cellCls + " mini-grid-editCell-hotTrack";
			}
			return e;
		},
		_OnCellCommitEdit: function(record, column, value, editor) {
			var e = this.mini_OnCellCommitEdit.apply(this, arguments);
			if (e.editor.textName) {
				mini._setMap(e.editor.textName, e.text, record);
			}
			return e;
		}
	});
}
/** ------------------ ComboBox---------------------------- */
if (mini.ComboBox) {
	mini.ComboBox.prototype.mini_set = mini.ComboBox.prototype.set;
	mini.ComboBox.prototype.mini__createPopup = mini.ComboBox.prototype._createPopup;
	mini.ComboBox.prototype.miniSetValue = mini.ComboBox.prototype.setValue;
	mini.ComboBox.prototype.mini_setEnabled = mini.ComboBox.prototype.setEnabled;
	mini.ComboBox.prototype.mini_setText = mini.ComboBox.prototype.setText;
	mini.ComboBox.prototype.mini__doEmpty = mini.ComboBox.prototype._doEmpty;
	mini.copyTo(mini.ComboBox.prototype, {
		width: "100%",
		height: 32,
		textField: "MC",
		valueField: "ID",
		showClose: true,
		allowInput: true,
		valueFromSelect: true,
		errorMode: "border",
		emptyText: "-请选择-",
		set: function(kv) {
			this._value = kv.value;
			if (!kv.textField) {
				kv.textField = "MC";
			}

			if (!kv.valueField) {
				kv.valueField = "ID";
			}

			if (!kv.nullItemText) {
				kv.nullItemText = "-请选择-";
			}

			var _enabled = kv.enabled;
			delete kv.enabled;

			this.mini_set(kv);

			//解决disable时不显示emptyText
			if (_enabled === false) {
				this.setEnabled(false);
			}

		},
		setText: function(text) {
			mini.ComboBox.prototype.mini_setText.apply(this, arguments);

			//解决disable时不显示emptyText
			if (mini.isEquals(this._emptyText, text)) {
				mini.ComboBox.superclass.setText.call(this, "");
			}
		},
		_doEmpty: function() {
			mini.ComboBox.prototype.mini__doEmpty.apply(this, arguments);

			//解决emptyText无法修改为空的问题
			if (this.emptyText == "") {
				mini._placeholder(this._textEl);
			}

		},
		setEnabled: function(value) {
			//disable时不显示emptyText
			if (!value) {
				if (typeof(this._emptyText) == "undefined") {
					this._emptyText = this.emptyText;
					this.setEmptyText("");
				}
			} else if (this._emptyText) {
				this.setEmptyText(this._emptyText);
				delete this._emptyText;
			}

			mini.ComboBox.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		},
		__OnItemLoad: function() {
			this.data = this._listbox.data;

			if (typeof this._value != "undefined") {
				this.setValue(this._value, this.defaultValueTriggerChange);
			} else {
				this.setValue(this.value);
			}
		},
		/**
		 * 修改为同步请求
		 */
		__OnItemBeforeLoad: function(e) {
			e.async = false;
		},
		_createPopup: function() {
			this.mini__createPopup();

			this._listbox.on("load", this.__OnItemLoad, this);
			this._listbox.on("beforeload", this.__OnItemBeforeLoad, this);
		},
		setValue: function(value, valid) {
			this._value = value;
			this.miniSetValue(value, valid);
		}
	});
}
if (mini.TreeSelect) {
	mini.TreeSelect.prototype.mini_setEnabled = mini.TreeSelect.prototype.setEnabled;
	mini.copyTo(mini.TreeSelect.prototype, {
		width: "100%",
		popupWidth: "100%",
		popupMinWidth: 250,
		popupMaxHeight: 300,
		height: 32,
		showClose: true,
		errorMode: "border",
		emptyText: "-请选择-",
		setEnabled: function(value) {
			mini.TreeSelect.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		}
	});
}
/** ------------------ mini-Password---------------------------- */
if (mini.Password) {
	mini.Password.prototype.mini_setEnabled = mini.Password.prototype.setEnabled;
	mini.Password.prototype.mini__OnBlur = mini.Password.prototype.__OnBlur;
	mini.copyTo(mini.Password.prototype, {
		width: "100%",
		height: 32,
		errorMode: "border",
		setEnabled: function(value) {
			mini.Password.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		},
		__OnBlur: function(e) {
			if (this._textEl.value != this._valueEl.value) {
				this.setValue(this._textEl.value);
			}
			mini.Password.prototype.mini__OnBlur.apply(this, arguments);
		}
	});
}
/** ------------------ TextBox---------------------------- */
if (mini.TextBox) {
	mini.TextBox.prototype.mini_setEnabled = mini.TextBox.prototype.setEnabled;
	mini.TextBox.prototype.mini__OnBlur = mini.TextBox.prototype.__OnBlur;
	mini.copyTo(mini.TextBox.prototype, {
		width: "100%",
		height: 32,
		errorMode: "border",
		setEnabled: function(value) {
			mini.TextBox.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		},
		__OnBlur: function(e) {
			if (this._textEl.value != this._valueEl.value) {
				this.setValue(this._textEl.value);
			}
			mini.TextBox.prototype.mini__OnBlur.apply(this, arguments);
		}
	});
}
/** ------------------ Splitter---------------------------- */
if (mini.Splitter) {
	mini.copyTo(mini.Splitter.prototype, {
		width: "100%",
		height: "100%"
	});
}
/** ------------------ PopupEdit---------------------------- */
if (mini.PopupEdit) {
	mini.copyTo(mini.PopupEdit.prototype, {
		width: "100%",
		height: 32,
		errorMode: "border"
	});
}
/** ------------------ DatePicker---------------------------- */
if (mini.DatePicker) {
	mini.DatePicker.prototype.mini_setEnabled = mini.DatePicker.prototype.setEnabled;
	mini.copyTo(mini.DatePicker.prototype, {
		width: "100%",
		height: 32,
		showClose: false,
		errorMode: "border",
		/*popupHeight: 206,
		popupMinHeight: 206,*/
		setEnabled: function(value) {
			mini.DatePicker.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		}
	});
}

/** ------------------ MoneyBox---------------------------- */
if (mini.MoneyBox) {
	mini.MoneyBox.prototype.mini_setEnabled = mini.MoneyBox.prototype.setEnabled;
	mini.copyTo(mini.MoneyBox.prototype, {
		width: "100%",
		height: 32,
		selectOnFocus: true,
		errorMode: "border",
		setEnabled: function(value) {
			mini.MoneyBox.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		}
	});
}

/** ------------------ mask---------------------------- */
if (mini.mask) {
	mini__mask = mini.mask;
	mini.mask = function(options) {
		options = options || {};
		var el = mini.byId(options);
		if (mini.isElement(el)) options = {
			el: el
		};
		else if (typeof options == "string") options = {
			html: options
		};
		options.cls = "mini-mask-loading";
		mini__mask(options);
		$('.mini-mask-msg').show();//added by chenjunj, mini-mask遮罩实时显示，不再是所有代码执行完毕之后才显示
	}
}

/*重写mini.prompt*/
mini.prompt = function(message, title, callback, multi) {
	var id = "prompt$" + new Date().getTime();
	var s = message || mini.MessageBox.promptMessage;
	// 改为miniui的textbox,来保证页面风格的统一性 潘正锋 2014-06-16
	// 增加尺寸数据,解决ie6下面无法自适应的问题 pzf 2014-11
	var $html = jQuery('<div></div>');
	var obj;
	var height;

	if (multi) {
		obj = new mini.TextArea();
		obj.setWidth("230");
		obj.setHeight("70");
		height = "190";

	} else {
		obj = new mini.TextBox();
		obj.setWidth("230");
		height = "200";
		s = '<span style="line-height: 28px;">' + s + '：</span><br/>';

	}

	var uid = mini.MessageBox.show({
		title: title || mini.MessageBox.promptTitle,
		buttons: ["ok", "cancel"],
		width: 280,
		height: height,
		html: '<div id="pzf" style="overflow:auto;padding:5px;padding-left:10px;">' +
			s + '</div>',
		callback: function(action) {
			if (callback) callback(action, obj.getValue());
		}
	});
	obj.render(jQuery('#pzf')[0]);
	obj.focus();
	return uid;
};
/*-----------------------------------------mini组件定制化----end---------------------------*/

/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/9
 * Time：19:31
 *
 */

// 重写miniVtype校验，校验通过的单元格添加背景色

mini_CellValidator_Prototype.setCellIsValid = function(row, column, isValid,
	errorText) {

	row = this.getNode ? this.getNode(row) : this._getRow(row);
	column = this.getColumn(column);
	if (!row || !column) return;
	var id = row[this._rowIdField] + "$" + column._id;
	var cellEl = this._getCellEl(row, column);
	var error = this._cellMapErrors[id];
	delete this._cellMapErrors[id];
	this._cellErrors.remove(error);

	if (isValid === true) {
		// lizm 2017-01-09 vtype校验通过时添加背景色
		if (!!column.editor && !mini.hasClass(cellEl, 'mini-grid-cell-validated')) {
			mini.addClass(cellEl, 'mini-grid-cell-validated');
		}
		if (!this.getAllowCellEdit()) {
			mini.removeClass(cellEl, 'mini-grid-cell-validated');
		}
		// end

		if (cellEl && error) {
			mini.removeClass(cellEl, 'mini-grid-cell-error');

		}
	} else {
		error = {
			record: row,
			column: column,
			isValid: isValid,
			errorText: errorText
		};
		this._cellMapErrors[id] = error;
		this._cellErrors.add(error);
		if (cellEl) {
			mini.addClass(cellEl, 'mini-grid-cell-error');
		}
	}
};
/**
 * 更新行
 * @param Object/Number row 行对象或行rowIndex
 * @param String/Object rowData 行对象，当rowData为String类型时表示更新列的field
 * @param String/Number/Boolean value 当rowData为String类型时，更新列对应的value
 */
mini_CellValidator_Prototype._updateRowEl = function(row) {
	var me = this;

	var s = jQuery(me._createRow(row));
	var rowEl = me._getRowEl(row);
	jQuery(rowEl).before(s);
	// lizm 2017-01-11 重新绘制表格时，同时复制样式
	jQuery(rowEl).find('td').each(function() {
		var classValue = jQuery(this).attr('class');
		var tdId = jQuery(this).index();
		jQuery(this).parent().prev().find('td').eq(tdId).attr('class', classValue);
	});
	// end
	rowEl.parentNode.removeChild(rowEl);

};
if (mini.DataGrid) {
	mini.copyTo(mini.DataGrid.prototype, mini_CellValidator_Prototype);
}
if (mini.showTips) {
	// 添加mini.showTips
	mini.copyTo(mini, {
		showAt: function(options) {
			var $ = jQuery;

			options = jQuery.extend({
				el: null,

				x: 'center',
				y: 'center',
				offset: [0, 0],
				fixed: false,
				zindex: mini.getMaxZIndex(),
				timeout: 0,
				timeoutHandler: null,
				animation: false
			}, options);
			var el = jQuery(options.el)[0],
				x = options.x,
				y = options.y,
				offsetx = options.offset[0],
				offsety = options.offset[1],
				zindex = options.zindex,
				fixed = options.fixed,
				animation = options.animation;
			if (!el) return;

			if (options.timeout) {
				setTimeout(function() {
					if (options.timeoutHandler) options.timeoutHandler();

				}, options.timeout);
			}



			var s =
				';position:absolute;display:block;left:auto;top:auto;right:auto;bottom:auto;margin:0;z-index:' +
				zindex + ';';
			mini.setStyle(el, s);
			var s = "";

			if (options && mini.isNumber(options.x) && mini.isNumber(options.y)) {
				if (options.fixed && !mini.isIE6) {
					s += ";position:fixed;";
				}
				mini.setStyle(el, s);
				mini.setXY(options.el, options.x, options.y);
				return;
			}



			if (x == 'left') {
				s += 'left:' + offsetx + 'px;';
			} else if (x == 'right') {
				s += 'right:' + offsetx + 'px;';
			} else {
				var size = mini.getSize(el);
				s += 'left:50%;margin-left:' + (-size.width * 0.5) + 'px;';
			}

			if (y == 'top') {
				s += 'top:' + offsety + 'px;';
			} else if (y == 'bottom') {
				s += 'bottom:' + offsety + 'px;';
			} else {
				var size = mini.getSize(el);
				s += 'top:50%;margin-top:' + (-size.height * 0.5) + 'px;';
			}

			if (fixed && !mini.isIE6) {
				s += 'position:fixed';
			}
			mini.setStyle(el, s);

		}
	});
}
/* 1. mini-datepicker 渲染时，为每一个日期数字添加样式 mini-calendar-item */
/* 2. 渲染时，不创建 mini-timespinner ，将display：inline-block 改成了display：none*/
if (mini.DatePicker) {
	mini.copyTo(mini.Calendar.prototype, {
        _create: function () {
            var s = '<tr style="width:100%;"><td style="width:100%;"></td></tr>';
            s += '<tr ><td><div class="mini-calendar-footer">'
                + '<span style="display:none;"><input name="time" class="mini-timespinner" style="width:80px" format="' + this.timeFormat + '"/>'
                + '<span class="mini-calendar-footerSpace"></span></span>'
                + '<span class="mini-calendar-tadayButton">' + this.todayText + '</span>'

                + '<span class="mini-calendar-footerSpace"></span>'
                + '<span class="mini-calendar-clearButton">' + this.clearText + '</span>'
                + '<span class="mini-calendar-okButton">' + this.okText + '</span>'
                + '<a href="#" class="mini-calendar-focus" style="position:absolute;left:-10px;top:-10px;width:0px;height:0px;outline:none" hideFocus></a>'
                + '</div></td></tr>';

            var html = '<table class="mini-calendar" cellpadding="0" cellspacing="0">' + s + '</table>';

            var d = document.createElement("div");
            d.innerHTML = html;
            this.el = d.firstChild;

            var trs = this.el.getElementsByTagName("tr");
            var tds = this.el.getElementsByTagName("td");

            this._innerEl = tds[0];
            this._footerEl = mini.byClass("mini-calendar-footer", this.el);

            this.timeWrapEl = this._footerEl.childNodes[0];
            this.todayButtonEl = this._footerEl.childNodes[1];
            this.footerSpaceEl = this._footerEl.childNodes[2];
            this.closeButtonEl = this._footerEl.childNodes[3];
            this.okButtonEl = this._footerEl.childNodes[4];

            this._focusEl = this._footerEl.lastChild;




            this.yesterdayButtonEl = mini.after(this.todayButtonEl, '<span class="mini-calendar-tadayButton yesterday">' + this.yesterdayText + '</span>');


            mini.parse(this._footerEl);
            this.timeSpinner = mini.getbyName('time', this.el);
            this.doUpdate();
        },
		_CreateView: function(viewDate, row, column) {
			var month = viewDate.getMonth();
			var date = this.getFirstDateOfMonth(viewDate);
			var firstDateOfWeek = new Date(date.getTime());
			var todayTime = mini.clearTime(new Date()).getTime();
			var selectedTime = this.value ? mini.clearTime(this.value).getTime() : -1;

			var multiView = this.rows > 1 || this.columns > 1;

			var s = '';
			s +=
				'<table class="mini-calendar-view" border="0" cellpadding="0" cellspacing="0">';

			if (this.showHeader) {
				s +=
					'<tr ><td colSpan="10" class="mini-calendar-header"><div class="mini-calendar-headerInner">';
				if (row == 0 && column == 0) {
					s += '<div class="mini-calendar-prev">';
					if (this.showYearButtons) s +=
						'<span class="mini-calendar-yearPrev"></span>';
					if (this.showMonthButtons) s +=
						'<span class="mini-calendar-monthPrev"></span>';
					s += '</div>';
				}
				if (row == 0 && column == this.columns - 1) {
					s += '<div class="mini-calendar-next">';
					if (this.showMonthButtons) s +=
						'<span class="mini-calendar-monthNext"></span>';
					if (this.showYearButtons) s +=
						'<span class="mini-calendar-yearNext"></span>';
					s += '</div>';
				}
				s += '<span class="mini-calendar-title">' + mini.formatDate(viewDate,
					this.format); + '</span>';
				s += '</div></td></tr>';
			}


			if (this.showDaysHeader) {
				s +=
					'<tr class="mini-calendar-daysheader"><td class="mini-calendar-space"></td>';
				if (this.showWeekNumber) {
					s += '<td sclass="mini-calendar-weeknumber"></td>';
				}

				for (var j = this.firstDayOfWeek, k = j + 7; j < k; j++) {
					var name = this.getShortWeek(j);
					s += '<td yAlign="middle">';
					s += name;
					s += '</td>';
					date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
				}
				s += '<td class="mini-calendar-space"></td></tr>';
			}


			date = firstDateOfWeek;
			for (var i = 0; i <= 5; i++) {
				s +=
					'<tr class="mini-calendar-days"><td class="mini-calendar-space"></td>';
				if (this.showWeekNumber) {
					var num = mini.getWeek(date.getFullYear(), date.getMonth() + 1, date.getDate());
					if (String(num).length == 1) num = "0" + num;
					s += '<td class="mini-calendar-weeknumber" yAlign="middle">' + num +
						'</td>';
				}
				for (var j = this.firstDayOfWeek, k = j + 7; j < k; j++) {
					var weekend = this.isWeekend(date);
					var clearTime = mini.clearTime(date).getTime();
					var isToday = clearTime == todayTime;
					var isSelected = this.isSelectedDate(date);

					if (month != date.getMonth() && multiView) {
						clearTime = -1;
					}

					var e = this._OnDrawDate(date);

					s += '<td yAlign="middle" id="';
					s += this.uid + "$" + clearTime;
					s += '" class="mini-calendar-date ';
					if (weekend) {
						s += ' mini-calendar-weekend '
					}
					if (e.allowSelect == false) {
						s += ' mini-calendar-disabled '
					}

					if (month != date.getMonth() && multiView) {} else {
						if (isSelected) {
							s += ' ' + this._selectedDateCls + ' ';
						}
						if (isToday) {
							s += ' mini-calendar-today '
						}
					}
					if (month != date.getMonth()) {
						s += ' mini-calendar-othermonth ';
					}

					if (e.dateCls) s += ' ' + e.dateCls;

					s += '" style="';
					if (e.dateStyle) s += e.dateStyle;
					s += '"><span class="mini-calendar-item">';

					if (month != date.getMonth() && multiView) {} else {

						s += e.dateHtml;
					}
					s += '</span></td>';

					date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
				}
				s += '<td class="mini-calendar-space"></td></tr>';
			}
			s += '<tr class="mini-calendar-bottom" colSpan="10"><td ></td></tr>';

			s += '</table>';
			return s;
		}
	});
}

// mini-tab 切换时，调整steps插件内容显示区的高度
if (mini.Tabs) {
	mini.copyTo(mini.Tabs.prototype, {
		// 调整steps插件内容的高度 李志明 2017-02-09
		resetWizard: function() {
			var height = this.getTabBodyEl(this.activeIndex).clientHeight + 100;
			if (jQuery('#wizard').length == 1) {
				jQuery('#wizard').find('.content').height(height);
			}
		},
		// end
		activeTab: function(tab) {
			this.setActiveIndex(tab);
			this.resetWizard();
		}
	})
}
/*修改 miniForm 的validate 方法*/
if (mini.Form) {
	mini.Form.prototype.mini_validate = mini.Form.prototype.validate;
	mini.copyTo(mini.Form.prototype, {
		validate: function(all, hide) {
			var validResult = mini.Form.prototype.mini_validate.apply(this, arguments);
			if (!validResult) {
				var errorTexts = this.getErrorTexts();
				if (errorTexts.length > 0) {
					var text = '';
					for (var i = 0; i < errorTexts.length; i++) {
						text += errorTexts[i] + '<br/>';
					}
					mini.alert(text);
				}
				return false;
			} else {
				return validResult;
			}

		}


	})
}
/*mini vtype rangeChar 中的中文字符算 3 个长度*/
if (mini.VTypes) {
    mini.VTypes.rangeChar = function (v, args) {
        if (mini.isNull(v) || v === "") return true;

        var min = parseFloat(args[0]), max = parseFloat(args[1]);
        if (isNaN(min) || isNaN(max)) return true;

        //将中文标点符号也纳入到校验范围中 潘正锋 2013-10-12
        function isChinese(v) {
            var reg = /[^\x00-\xff]/ig;
            if (v.match(reg) != null) return true;
            return false;
        }

        var len = 0;
        var ss = String(v).split("");
        for (var i = 0, l = ss.length; i < l; i++) {
            if (isChinese(ss[i])) {
                len += 3; // 原来是2，改成3
            } else {
                len += 1;
            }
        }

        if (min <= len && len <= max) return true;
        return false;
    }
}

/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/11/22
 * Time：11:12
 *
 */

var moneyUtil = function () {
    // 阿拉伯数字金额转成中文大写金额
    var _arabicToChinese = function (arabicNum) {
        var arabicNum = new String(Math.round(arabicNum * 100)); // 数字金额
        var chineseValue = ""; // 转换后的汉字金额
        var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
        var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
        var len = arabicNum.length; // arabicNum 的字符串长度
        var Ch1; // 数字的汉语读法
        var Ch2; // 数字位的汉字读法
        var nZero = 0; // 用来计算连续的零值的个数
        var String3; // 指定位置的数值
        if (len > 15) {
            alert("超出计算范围");
            return "";
        }
        if (arabicNum == 0) {
            chineseValue = "零元整";
            return chineseValue;
        }
        String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
        for (var i = 0; i < len; i++) {
            String3 = parseInt(arabicNum.substr(i, 1), 10); // 取出需转换的某一位的值
            if (i != (len - 3) && i != (len - 7) && i != (len - 11)
                && i != (len - 15)) {
                if (String3 == 0) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                } else if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                } else {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
            } else { // 该位是万亿，亿，万，元位等关键位
                if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                } else if (String3 != 0 && nZero == 0) {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                } else if (String3 == 0 && nZero >= 3) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                } else {
                    Ch1 = "";
                    Ch2 = String2.substr(i, 1);
                    nZero = nZero + 1;
                }
                if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
                    Ch2 = String2.substr(i, 1);
                }
            }
            chineseValue = chineseValue + Ch1 + Ch2;
        }
        if (String3 == 0) { // 最后一位（分）为0时，加上“整”
            chineseValue = chineseValue + "整";
        }
        return chineseValue;
    };
    //toFixed js默认Number类型的toFixed方法是 四舍六入，现在改为四舍五入
    var _nativeToFixed = function (origin,s) {
        var e, changeNum, index, i, j;
        // 如果值小于0，先转成正数
        if (origin < 0) {
            e = -origin;
        }
        else {
            e = origin;
        }
        changeNum = (parseInt(e * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
        index = changeNum.indexOf(".");
        if (index < 0 && s > 0) {
            changeNum = changeNum + ".";
            for (i = 0; i < s; i++) {
                changeNum = changeNum + "0";
            }
        } else {
            index = changeNum.length - index;
            for (j = 0; j < (s - index) + 1; j++) {
                changeNum = changeNum + "0";
            }
        }
        if (origin < 0) {
            if (Number(s) > 0) {
                return '-' + changeNum;
            }
            else {
                return -changeNum;
            }
        }
        else {
            return changeNum;
        }
    };
    return {
        arabicToChinese: function () {
            return _arabicToChinese.apply(this, arguments);
        },
        toFixed: function (origin,s) {
            return _nativeToFixed(origin,s);
        }
    }
}();
Number.prototype.toFixed = function (s) {
    var temp = moneyUtil.toFixed(this,s+4);
    return moneyUtil.toFixed(Number(temp),s);
};
//toFixed js默认Number类型的toFixed方法是 四舍六入，现在改为四舍五入
/*Number.prototype.toFixed = function (d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") === -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        s = "0" + RegExp.$2;
        var pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a === d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] === 10) {
                        a[i] = 0;
                        b = i !== 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
};*/
/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/11/23
 * Time：13:41
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
        root.nsrxxUtil = factory();
    }
}(this, function () {

    var nsrxxUtil={};
    // 有参数true，就重新请求
    nsrxxUtil.getUserInfo = function (refresh) {

        var userInfo = mini.decode(store.getSession('getUserInfo'));

        if (refresh===true || !userInfo) {
            ajax.post('../../../api/base/userInfo/get', {}, function (response) {
                if (response.success && !!response.value) {
                    userInfo = response.value;
                    store.setSession('getUserInfo',userInfo);
                }else{
                    mini.alert(response.message);
                    return false;
                }
            });
        }
        return userInfo;
    };
    nsrxxUtil.getNsrInfo = function () {
        var data = nsrxxUtil.getUserInfo();
        if(!!data && !! data.NsrInfo){
            return data.NsrInfo;
        }else{
            return null;
        }
    };
    nsrxxUtil.getAccountInfo = function () {
        var data = nsrxxUtil.getUserInfo();
        if(!!data && !! data.AccountInfo){
            return data.AccountInfo;
        }else{
            return null;
        }
    };
    nsrxxUtil.getNsrxxVO = function (url) {

        var userInfo = nsrxxUtil.getUserInfo(); // 办税桌面缓存
        var nsrxxData = mini.decode(store.getSession("NsrjbxxVO")); // 纳税人信息缓存
        // 获取纳税人信息请求
        var _getNsrxx = function () {
            var nsrxx=null;
            var defaultUrl = !!url ? url : "../../../api/base/nsrxx/get";
            ajax.post(defaultUrl, {}, function (response) {

                if (response.success && !!response.value) {
                    nsrxx = response.value;
                    store.setSession("NsrjbxxVO", mini.encode(nsrxx));
                }else{
                    // 个人模式没有纳税人信息，不弹框提示
                    if(userInfo.NsrInfo){
                        mini.alert('获取纳税人信息失败，请稍后再试');
                    }

                    return false;
                }
            });
            return nsrxx;
        };

        if(!!userInfo){
            if (!!nsrxxData) {
                if(!userInfo.NsrInfo){
                    nsrxxData = null;
                    return false;
                }
                // 判断是否和办税桌面缓存的信息一致
                if(nsrxxData.djxh != userInfo.NsrInfo.djxh){
                    nsrxxData =  _getNsrxx();
                }
            } else {  // 缓存没有 则发请求
                nsrxxData =  _getNsrxx();
            }
            return nsrxxData;

        }else{  // 缓存不存在，未登录或者session过期
            //store.clearSession();
            //store.clearLocal();
            //mini.alert('登录已过期，请重新登录');
            return false;
        }
    };

    return nsrxxUtil;

}));


