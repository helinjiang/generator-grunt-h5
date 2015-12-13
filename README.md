# generator-grunt-h5
Html5 pages with Grunt for Yeoman

���� `Yeoman` ʵ�ֵ�HTML 5 ҳ�湤����Ŀ��������ʹ�� `Grunt` ��������ѡ�� `Bower` ������ͻ��˵İ���

## Usage

��һ����ȷ�����Ѿ���װ�� `yo`, `grunt-cli`, `bower`�����û�У��밲װ֮��

```
npm install -g grunt-cli bower yo
```

�ڶ�������ȫ�ַ�ʽ��װ `generator-grunt-h5`��
```
npm install -g generator-grunt-h5
```


���������½�һ��Ŀ¼��Ȼ�� `cd` ���뵽��Ŀ¼�У�
```
mkdir my-new-project && cd my-new-project
```

���Ĳ���ʹ�� `generator-grunt-h5` ��������ʾ�½���Ŀ��
```
yo grunt-h5
```
Ĭ������£���Ŀ�������֮�󣬻��Զ����� `npm install` �� `bower install`����������Լ������У�����ѡ��һ������Ĳ��� `lazy`�������Ͳ������������������ˣ�
```
yo grunt-h5 --lazy
```

## History Release
2015.12.13  v0.2.1 Show a tip if this directory you want to scaffold into already exist files or folders.

2015.12.06  v0.2.0 Support bower. Support define resource and build path. Support webroot path. Support `--lazy` to not auto install modules.

2015.12.04  v0.1.0 Add more in Gruntfile.js

2015.11.29 v0.0.1 Init