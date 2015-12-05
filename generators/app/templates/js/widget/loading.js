/**
 *
 *  style file：
 *      less/widget/loading.less
 *
 * @author helinjiang
 * @date   2015-12-01
 */

window.LOADING = (function () {

    var tmpl = [
        '<div class="loading">',
        '   <div class="loading-box">',
        '       <div><span class="ui-loading"></span></div>',
        '       <p>Loading..</p>',
        '   </div>',
        '</div>'
    ].join("");

    var container;

    function show() {
        if (!container || !container.length) {
            container = $('<div id="loading-container"></div>');
            $("body").append(container);

            container.append(UTIL.template(tmpl, {}));
        } else {
            container.show();
        }
    }

    function hide() {
        if (!container || !container.length) {
            return;
        }
        container.hide();
    }

    var exports = {
        "show": show,
        "hide": hide
    };

    return exports;

})();