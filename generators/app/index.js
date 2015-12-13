var fs = require("fs");
var path = require("path");
var generators = require('yeoman-generator');

// 颜色
var chalk = require("chalk");

// yeoman的图标
var yosay = require("yosay");

// underscore 工具
var _ = require("underscore.string");

module.exports = generators.Base.extend({
    constructor: function () {

        generators.Base.apply(this, arguments);

        // This method adds support for a `--coffee` flag
        this.option('lazy', {"desc": "Do not npm install or brower insall."});

        // And you can then access it later on this way; e.g.
        this.lazyInstall = !!this.options.lazy;
    },

    initializing: function () {
        //默认配置，从环境变量中读取
        this.defaultOption = {
            user: process.env.USERNAME || 'nodefaultuser', // TODO windows下是USERNAME，USER貌似没起作用
            curFolderName: this._getValidAppName(path.basename(process.cwd()))
        };

        //this.appPath = this.env.options.appPath;
        return this.pkg = require("../../package.json");
    },

    prompting: function () {

        // 异步调用
        var done = this.async();

        // 欢迎界面
        console.log(yosay("Welcome to the " + chalk.red("GruntH5") + " generator"));

        // https://github.com/helinjiang/generator-grunt-h5/issues/1
        // 如果当前文件夹下还有其他的文件（包括隐藏文件），则需要提示一下！
        if (fs.readdirSync(this.destinationRoot()).length) {
            console.log(chalk.yellow("Warning! This directory you want to scaffold into already exist files or folders! Please be careful!\n"));
        }

        var prompts = [{
            name: "appname", // 应用名称，最终会将生成小驼峰结果
            message: "What's the name of your app?",
            "default": this.defaultOption.curFolderName
        }, {
            name: 'author', // 作者
            message: 'Author:',
            default: this.defaultOption.user
        }, {
            name: 'srcpath', // 构建之前源代码文件夹名称
            message: "Where's the source code path?",
            default: 'resource'
        }, {
            name: 'distpath', // 构建后的文件夹名称
            message: "Where's the build path?",
            default: 'dist'
        }, {
            name: 'webrootpath', // 构建后的文件夹名称
            message: "Where's the web server root path?",
            default: 'dist'
        }, {
            type: "list",
            name: "stylesheet", // 使用哪种stylesheet
            "default": 1,
            message: "What would you like to write stylesheets with?",
            choices: ["CSS", "Less"],
            filter: function (val) {
                return val.toLowerCase();
            }
        }, {
            type: "list",
            name: "cssdeploy", // 发布版本时，css以哪种方式引入
            "default": 1,
            message: "What would you like to deal html when deploy with css link?",
            choices: ["Suffix", "Embed", "Inline"],
            filter: function (val) {
                return val.toLowerCase();
            }
        }, {
            type: "list",
            name: "jsdeploy", // 发布版本时，js以哪种方式引入
            "default": 1,
            message: "What would you like to deal html when deploy with javaScript link?",
            choices: ["Suffix", "Embed", "Inline"],
            filter: function (val) {
                return val.toLowerCase();
            }
        }, {
            type: "confirm",
            name: "usebower",
            "default": true,
            message: "Use Bower?"
        }];

        // 所有的用户参数结果存储于此
        this.userOption = {};

        return this.prompt(prompts, function (answers) {
            this.userOption = answers;

            // 对appname进行处理，不能包括空格等
            this.userOption.appname = this._getValidAppName(this.userOption.appname);

            // 处理这三个path
            this.userOption.srcpath = this._getNormalizePath(this.userOption.srcpath);
            this.userOption.distpath = this._getNormalizePath(this.userOption.distpath);
            this.userOption.webrootpath = this._getNormalizePath(this.userOption.webrootpath);

            // html中的js\css\image相对于html的地址
            this.userOption.basePathInHtml = this._getNormalizePath(this._getRelativePath(this.userOption.webrootpath, this.userOption.distpath));

            // 遍历展现用户选择的结果
            // for (var key in this.userOption) {
            //     this.log(this.userOption[key]);
            // }

            return done();
        }.bind(this));
    },

    writing: function () {
        var basePath = this.userOption.srcpath;

        // 生成 grunt 配置文件 Gruntfile.js
        this.fs.copyTpl(
            this.templatePath('_Gruntfile.js'),
            this.destinationPath('Gruntfile.js'),
            this.userOption
        );

        // 生成 node 配置文件 package.json
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            this.userOption
        );


        // 生成 html 页面
        this.fs.copyTpl(
            this.templatePath('html/index.html'),
            this.destinationPath(basePath + '/html/index.html'),
            this.userOption
        );

        // 拷贝js
        this.fs.copy(
            this.templatePath('js/**/*'),
            this.destinationPath(basePath + '/js')
        );

        // 拷贝css
        this.fs.copy(
            this.templatePath('css/**/*'),
            this.destinationPath(basePath + '/css')
        );

        // 拷贝less，只有在stylesheet=less时才拷贝
        if (this.userOption.stylesheet == "less") {
            this.fs.copy(
                this.templatePath('less/**/*'),
                this.destinationPath(basePath + '/less')
            );
        }

        // 拷贝img
        this.fs.copy(
            this.templatePath('img/**/*'),
            this.destinationPath(basePath + '/img')
        );

        // 生成Bower相关文件
        if (this.userOption.usebower) {
            //this.fs.copyTpl(
            //    this.templatePath('_bower.json'),
            //    this.destinationPath('bower.json'),
            //    this.userOption
            //);
            // 这种写法等效于上面这种
            this.template('_bower.json', 'bower.json', this.userOption);

            this.template('bowerrc', '.bowerrc', this.userOption);
        } else {
            // 不使用bower时，再拷贝外部库到js/lib下面
            this.fs.copy(
                this.templatePath('lib/**/*'),
                this.destinationPath(basePath + '/js/lib')
            );
        }
    },

    install: function () {
        var str = "",
            strInstall = "";

        if (this.userOption.usebower) {
            str = 'Grunt and Bower dependencies';
            strInstall = "npm install & bower install";
        } else {
            str = 'Grunt dependencies';
            strInstall = "npm install";
        }

        // 如果有--lazy选项，则不再自动运行 npm install & bower install
        if (this.lazyInstall) {
            this.log('\nYou should run ' + chalk.yellow(strInstall) + ' yourself to install the required dependencies!');
        } else {
            this.log('\nInstall ' + str + ' ... ');

            this.installDependencies({
                callback: function () {
                    this.log('Install ' + str + ' success!');
                }.bind(this)
            });
        }
    },

    end: function () {
        //存储用户默认配置
        this.config.set(this.userOption);

        return this.config.save(); // 此处调用可以省略
    },

    _getValidAppName: function (name) {
        return _.camelize(_.slugify(_.humanize(name)));
    },

    _getNormalizePath: function (name) {
        return path.normalize(name).replace(/\\/g, "/");
    },

    _getRelativePath: function (from, to) {
        return path.relative(from, to).replace(/\\/g, "/");
    }
});
