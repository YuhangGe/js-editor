/*
 * Daisy Editor
 * ——基于canvas的代码高亮编辑器
 *
 * @author      Abraham
 * @website     http://yuhanghome.net
 * @address     software institute, Nanjing University
 * @email       abraham1@163.com | abeyuhang@gmail.com
 * @weibo       http://weibo.com/abeyuhang
 * @copyright   Ge Yuhang, 2012
 *
 * To Daisy, to my love. 
 */
$(function(){
    say("Hello Daisy. I love you.");
});

function say(msg){
    window.alert(msg);
}
/*
 * 目前只在IE9、Firefox、Chrome上测试。其它浏览器可能有bug.
 * 纯基于Html5的Canvas元素绘制，相当于实现了一个简单的Scintilla(http://www.scintilla.org/,notepad++的内核)
 * 支持海量文本编辑（几万行基本不卡，额，是基本，详情见下）、基于AliceLex的词法分析可以支持各种语言的高亮。（目前只演示了JS的高亮）
 *
 * 目前存在以下问题：
 * 1、在Chrome下开启中文输入还有问题。
 * 2、在Chrome下选中文字的时候越出编辑区不能自动滚动（Chrome下没有setCapture函数）
 * 3、IE9下面鼠标点击后的光标位置错误。（但使用键盘移动光标全部正确）
 * 4、目前还没有实现删除选中文字的功能（囧，这个是最基本的吧，正在努力中……）
 * 5、当编辑海量文本（比如加载jquery1.5.1的源码）时，由于词法分析的不可避免耗时，会略显小卡。
 *   在chrome下最流畅、firefox次之、ie9很卡（因为ie9不支持typed array,Int32Array）。
 *   据观察（额，是观察~~），在Aptana下，高亮的词法分析应该是多线程的实现，
 *   我已经使用了setTimeout来模拟，取得了一定效果，但很显然这是伪多线程，所以还是会卡。正在考虑使用js的Worker对象模拟。
 * 6、显示行号、自动换行、复制、粘贴以及其它对外接口功能正在努力中~~~
 * 
 * PS:
 * 打个小广告，编辑器代码高亮的词法分析器使用的是也是我写的一个项目AliceLex自动生成的。
 * AliceLex是纯基于Javascript的词法分析器自动生成工具（也就是通常意义上的lex）。
 * 是我的毕业设计，欢迎大家通过最下面的链接围观^-^~~~~~~~~~~~~
 */

