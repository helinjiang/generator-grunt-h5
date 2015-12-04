/**
 * 公共处理函数,如果是业务处理相关的，则请放置在action.js中
 *
 * @author linjianghe
 * @date   2015-07-16
 */
window.UTIL = (function (global, undefined) {
    /**
     * 根据html模版（EJS引擎）和数据获得最终生成之后的html代码。
     * @param {string} htmlTpl html模版
     * @param {object} data 数据对象
     * @returns {string} 解析之后的html代码
     */
    //function template(htmlTpl, data) {
    //    data = data || {};
    //    var b = ["var __=[];"],
    //        d = /([\s\S]*?)(?:(?:<%([^=][\s\S]*?)%>)|(?:<%=([\s\S]+?)%>)|$)/g;
    //    d.lastIndex = 0;
    //    var a = d.exec(htmlTpl || "");
    //    while (a && (a[1] || a[2] || a[3])) {
    //        if (a[1]) {
    //            b.push("__.push('", a[1].replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "").replace(/\t/g, "\t").replace(/\//g, "\\/").replace(/'/g, "\\'").replace(/"/g, '\\"'), "');");
    //        }
    //        if (a[2]) {
    //            b.push(a[2]);
    //        }
    //        if (a[3]) {
    //            b.push("__.push(", a[3], ");");
    //        }
    //        a = d.exec(htmlTpl);
    //    }
    //    b.push("return __.join('');");
    //    var f = [],
    //        g = [];
    //    for (var h in data) {
    //        f.push(h);
    //        g.push(data[h]);
    //    }
    //    b = new Function(f.join(","), b.join(""));
    //    return b.apply(null, g);
    //}
    function template(htmlTpl, data) {
        return _.template(htmlTpl)(data);
    }

    function getTimeStamp(timeStamp) {
        var tmp = timeStamp + "";
        if (tmp.length < 11) {
            timeStamp *= 1000;
        }

        return timeStamp;
    }

    /**
     * 获得DOM上的数据，寻找data-[key]的值
     * @param  {Object} elem    DOM元素
     * @param  {String} key     key值
     * @param  {Bollean} upgoing 是否向上寻找，true：向上寻找，false：不用再向上寻找；
     * @return {String}         结果
     * @author linjianghe
     * @date   2015-09-21
     */
    function getDomData(elem, key, upgoing) {
        if (!elem) {
            return;
        }

        var val;

        var data = function (curelem, curkey) {
            var attr = curelem.attributes["data-" + curkey];
            if (attr) {
                return attr.value;
            }
        };

        if (upgoing) {
            while (!elem.is("body")) {
                val = elem.attr("data-" + key);
                if (val) {
                    break;
                } else {
                    elem = elem.parent();
                }
            }
        } else {
            val = elem.attr("data-" + key);
        }
        return val;
    }

    /**
     * 渲染html
     * @param {object} elemObj Zepto/jQuery对象
     * @param {string} tpl html模版代码
     * @param {object} data 数据
     * @param {function} callback 回调
     */
    function render(elemObj, tpl, data, callback) {
        // 必须是Zepto/jQuery对象
        if (!elemObj.length) {
            return;
        }

        // 设置html代码
        elemObj.html(template(tpl, data));

        // 处理回调，适当增加一点延迟
        if ($.isFunction(callback)) {
            setTimeout(function () {
                callback.apply(elemObj);
            }, 20);
        }

    }

    var exports = {
        "template": template,
        "render": render,
        "getTimeStamp": getTimeStamp,
        "getDomData": getDomData
    };

    return exports;

})(window);