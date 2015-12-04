var path = require("path");
var generators = require('yeoman-generator');

// 颜色
var chalk = require("chalk");

// yeoman的图标
var yosay = require("yosay");

// underscore 工具
var _ = require("underscore.string");

module.exports = generators.Base.extend({
    method1: function () {
        console.log('method 1 just ran');
    },
    constructor: function () {

        generators.Base.apply(this, arguments)

        //在这拿到传参和选项
    },

    initializing: function () {
        //默认配置，从环境变量中读取
        this.defaultOption = {
            user: process.env.USERNAME || 'nodefaultuser', // TODO windows下是USERNAME，USER貌似没起作用
            appname: this._getValidAppName(path.basename(process.cwd()))
        };

        //this.appPath = this.env.options.appPath;
        return this.pkg = require("../../package.json");
    },

    prompting: function () {

        // 异步调用
        var done = this.async();

        // 欢迎界面
        console.log(yosay("Welcome to the " + (chalk.red("MyTest")) + " generator"));

        var prompts = [{
            name: "appname", // 应用名称，最终会将生成小驼峰结果
            message: "What's the name of your app?",
            "default": this.defaultOption.appname
        }, {
            name: 'version', // 版本
            message: 'Version:',
            default: '0.0.1'
        }, {
            name: 'author', // 作者
            message: 'Author:',
            default: this.defaultOption.user
        }, {
            type: "list",
            name: "type", // HTML5页面类型
            "default": 0,
            message: "Which type of html5 page do you want to use?",
            choices: ["Basic", "PC"],
            filter: function (val) {
                return val.toLowerCase();
            }
        }, {
            type: "list",
            name: "stylesheet", // 使用哪种stylesheet
            "default": 0,
            message: "What would you like to write stylesheets with?",
            choices: ["CSS", "Less"],
            filter: function (val) {
                return val.toLowerCase();
            }
        }];

        // 所有的用户参数结果存储于此
        this.userOption = {};

        return this.prompt(prompts, function (answers) {
            this.userOption = answers;

            // 对appname进行处理，不能包括空格等
            this.userOption.appname = this._getValidAppName(this.userOption.appname);

            // 遍历展现用户选择的结果
            // for (var key in this.userOption) {
            //     this.log(this.userOption[key]);
            // }

            return done();
        }.bind(this));
    },

    writing: function () {

        //生成 grunt 配置文件 Gruntfile.js
        this.fs.copy(
            this.templatePath('_Gruntfile.js'),
            this.destinationPath('Gruntfile.js')
        );

        //生成 node 配置文件 package.json
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            this.userOption
        );


        //生成 html 页面
        this.fs.copyTpl(
            this.templatePath('html/index.html'),
            this.destinationPath('resource/html/index.html'),
            this.userOption
        );

        //拷贝js
        this.fs.copy(
            this.templatePath('js/**/*'),
            this.destinationPath('resource/js')
        );

        //拷贝css
        this.fs.copy(
            this.templatePath('css/**/*'),
            this.destinationPath('resource/css')
        );

        //拷贝less
        this.fs.copy(
            this.templatePath('less/**/*'),
            this.destinationPath('resource/less')
        );

        //拷贝img
        this.fs.copy(
            this.templatePath('img/**/*'),
            this.destinationPath('resource/img')
        );

    },


    install: function () {
        this.log('Install Grunt plugins ... ');

        // this.installDependencies({
        //     callback: function () {
        //         this.log('grunt 及其插件安装完毕。');


        //     }.bind(this)
        // });
    },


    end: function () {
        //存储用户默认配置
        this.config.set(this.userOption);

        return this.config.save(); // 此处调用可以省略
    },

    _getValidAppName: function (name) {
        return _.camelize(_.slugify(_.humanize(name)));
    }
});
