# generator-grunt-h5
Html5 pages with Grunt for Yeoman

基于 `Yeoman` 实现的HTML 5 页面工程项目生成器，使用 `Grunt` 构建，可选择 `Bower` 来管理客户端的包。

## Usage

第一步：确保您已经安装了 `yo`, `grunt-cli`, `bower`，如果没有，请安装之：

```
npm install -g grunt-cli bower yo
```

第二步：以全局方式安装 `generator-grunt-h5`：
```
npm install -g generator-grunt-h5
```


第三步：新建一个目录，然后 `cd` 进入到该目录中：
```
mkdir my-new-project && cd my-new-project
```

第四步：使用 `generator-grunt-h5` ，按照提示新建项目：
```
yo grunt-h5
```
默认情况下，项目建立完成之后，会自动运行 `npm install` 和 `bower install`，如果你想自己来运行，可以选择一个额外的参数 `lazy`，这样就不会运行这两个命令了：
```
yo grunt-h5 --lazy
```

## History Release
2015.12.13  v0.2.1 Show a tip if this directory you want to scaffold into already exist files or folders.

2015.12.06  v0.2.0 Support bower. Support define resource and build path. Support webroot path. Support `--lazy` to not auto install modules.

2015.12.04  v0.1.0 Add more in Gruntfile.js

2015.11.29 v0.0.1 Init