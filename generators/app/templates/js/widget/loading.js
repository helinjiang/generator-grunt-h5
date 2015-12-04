/*
 *
 * 选择月份组件
 *
 *  还需额外包含：
 *  样式：less/widget/loading.less
 *
 * @author linjianghe
 * @date   2015-10-13
 */

window.LOADING = (function () {

    /**
     * 选择月份的html模版
     * @type {string}
     */
    var tmpl = [
        '<div class="loading">',
        '   <div class="loading-box">',
        '       <div><span class="ui-loading"></span></div>',
        '       <p>加载中</p>',
        '   </div>',
        '</div>'
    ].join("");

    /**
     * 组件的dom对象
     * @type {*|jQuery|HTMLElement}
     */
    var container;

    /**
     * 展现加载中
     */
    function show() {
        if (!container || !container.length) {
            // 如果html还未设置，则设置之
            container = $('<div id="loading-container"></div>');
            $("body").append(container);

            UTIL.render(container, tmpl, {});
        } else {
            // 如果html已经设置了，则直接显示即可
            container.show();
        }
    }

    /**
     * 隐藏加载中
     */
    function hide() {
        if (!container || !container.length) {
            return;
        }
        container.hide();
    }

    /**
     * 对外接口
     * @type {{show: show, hide: hide}}
     */
    var exports = {
        "show": show,
        "hide": hide
    };

    return exports;

})();