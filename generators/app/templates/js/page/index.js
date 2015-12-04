/**
 * 处理"城市"tab页的业务。
 *
 * @author linjianghe
 * @date   2015-10-13
 */
window.CITY = (function() {

    /**
     * 初始化
     * @param {String} cityid 城市ID
     * @param {String} city 城市名称
     */
    function init(cityid, city) {
        // 初始化“城市”tab页面的html
        initHtml(cityid, city);

        // 请求外部数据，重新渲染页面的模块
        dealWithData(cityid, city);
    }

    /**
     * 初始化“城市”tab页面的html。
     * 在请求外部数据之前，先展示基本的DOM元素，并提示“加载中”，避免页面呈现“空白”。
     * @param {String} cityid 城市ID
     * @param {String} city 城市名称
     */
    function initHtml(cityid, city) {
        // 初始化“城市”的天气模块
        CITY_WEATHER.render(cityid, city);

        // 初始化“城市服务”模块
        CITY_SERVICE.render();
    }

    /**
     * 请求外部数据，重新渲染页面的模块。
     *
     * 注意：实际上在initHtml()方法之后，页面已经完成了渲染，也可以在此获取到了数据之后，
     * 再通过获取到元素DOM，最后依次设置。但我们不推荐这种做法，考虑到性能因素，需要尽量避免频繁对DOM进行操作，
     * 因此，我们会根据获得的数据和html模版，再重新获得整个模块的代码，重新设置html，只需要一次DOM操作即可。
     *
     * @param {String} cityid 城市ID
     * @param {String} city 城市名称
     */
    function dealWithData(cityid, city) {
        // 天气
        getCityWeather(cityid, function(data) {
            console.log("[city.js][dealWithData] getCityWeather data", data); //@debug

            // 初始化“城市”的天气模块
            CITY_WEATHER.render(cityid, city, data.data);
        });

        // 服务
        getCityService(cityid, function(data) {
            console.log("[city.js][dealWithData] getCityService data", data); //@debug

            // 初始化“城市服务”模块
            CITY_SERVICE.render(data.services);
        });
    }

    /**
     * 获得城市的天气信息之后，调用回调
     * @param {String} cityid 城市ID
     * @param {Function} callback 回调
     */
    function getCityWeather(cityid, callback) {
        // 请求参数
        var option = {
            "cityid": cityid,
            "_": new Date().getTime()
        };

        // 请求地址
        var url = "./dist/data/weather.js?_=" + $.param(option);

        LOADING.show();

        // 发送请求
        $.getJSON(url, function(data) {
            LOADING.hide();

            callback(data);

            // 为了模拟效果，此处延时2秒再回调
            //setTimeout(function (){
            //    LOADING.hide();
            //
            //    callback(data);
            //}, 2000);
        });
    }

    /**
     * 获得城市的服务信息之后，调用回调
     * @param {String} cityid 城市ID
     * @param {Function} callback 回调
     */
    function getCityService(cityid, callback) {
        // 请求参数
        var option = {
            "cityid": cityid,
            "_": new Date().getTime()
        };

        // 请求地址
        var url = "./dist/data/homepage.js?_=" + $.param(option);

        LOADING.show();

        // 发送请求
        $.getJSON(url, function(data) {
            LOADING.hide();

            callback(data.data);

            // 为了模拟效果，此处延时2秒再回调
            //setTimeout(function (){
            //    LOADING.hide();
            //
            //    callback(data);
            //}, 2000);
        });
    }

    /**
     * 对外接口
     * @type {{init: init}}
     */
    var exports = {
        "init": init
    };

    return exports;
})();
