/*
 *
 * tab组件
 *
 *  还需额外包含：
 *  样式：less/widget/tab.less
 *
 * @author linjianghe
 * @date   2015-10-13
 */
window.PAGE = (function() {

    $(function() {
        // 初始化
        _init();
    });

    function _init() {
        // 监听hashchange事件
        $(window).on("hashchange", function(e) {
            console.log("hashchangeed", location.href);
            dealHash();
        });


        dealHash();
    }

    function dealHash() {
        // 要注意这种变态的场景#id=xx&citylist?cityid=11000
        var hash = location.hash,
            arr=hash.split("?"),
            curHash = arr[0],
            cityparam,cityidFromUrl,ignoreCache;

        if(arr.length>1){
            cityparam=arr[1];
            var tarr = cityparam.split("&");
            for(var i=0,length=tarr.length;i<length;i++){
                if(tarr[i].indexOf("cityid=")>-1){
                    cityidFromUrl = tarr[i].split("=")[1];
                    break;
                }
            }
        }

        if(cityidFromUrl){
            GLOBAL_CITY_ID = cityidFromUrl;
            ignoreCache = true;
        }

        // TODO 此处不太严谨
        if (curHash.indexOf('citylist') > -1) {
            // 城市列表
            _initPage('citylist',ignoreCache);
        } else {
            // 城市服务
            _initPage('city',ignoreCache);
        }
    }

    /**
     * 切换到某个tab页面
     * @param {string} tabName tab页面名称：tel\broadband\score\bill
     */
    function _initPage(pageName,ignoreCache) {
        var pageTarget = $("#" + pageName);

        // 移除原有的active页的状态
        $(".page-container.active").removeClass("active");

        // 设置新的active页的状态
        pageTarget.addClass("active");

        // 判断该页面是否加载过数据，如果没加载过，则加载之，反之则不再重复加载
        if (ignoreCache || !pageTarget.data("loaded")) {
            switch (pageName) {
                case "city":
                    CITY.init(GLOBAL_CITY_ID, GLOBAL_CITY);
                    break;
                case "citylist":
                    CITYLIST.init(GLOBAL_CITY_ID, GLOBAL_CITY);
                    break;
                default:
                    console.error("UNKNOWN pageName=" + pageName);
                    break;
            }
            pageTarget.data("loaded", 1);
        }
    }

    /**
     * 切换到某个tab页面
     * @param {string} tabName tab页面名称：tel\broadband\score\bill
     */
    function go(pageName) {
        var curHash = location.hash.split("?")[0],
        hashQuery = location.hash.split("?")[1]; // TODO 此处不严谨

        if (pageName === "citylist") {
            // 在URL中增加#citylist
            // 如果hash中已经存在citylist，则不做任何变化
            // TODO 此处不太严谨
            if (curHash.indexOf("citylist") > -1) {
                return;
            }

            location.hash = curHash + (curHash.length > 1 ? '&' : '') + 'citylist?' + hashQuery;
        } else {
            // 如果hash中没有已经存在citylist，则不做任何变化
            // TODO 此处不太严谨
            if (curHash.indexOf("citylist") < 0) {
                return;
            }

            // TODO 此处不太严谨
            location.hash = curHash.replace('citylist', 'index');
        }
    }

    /**
     * 对外接口
     * @type {{go: go}}
     */
    var exports = {
        "go": go
    };

    return exports;

})();
