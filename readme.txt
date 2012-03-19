/**
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
    for(var i=0;i<10000000000000;i++){
    	//here is line comment.
        say("Hello Daisy. I love you.");
    }
});

var say = function(msg){
    window.alert(msg);
}
/*
 * 目前只在IE9、Firefox、Chrome上测试。其它浏览器可能有bug.
 * 纯基于Html5的Canvas元素绘制，相当于实现了一个简单的Scintilla(http://www.scintilla.org/,notepad++的内核)
 * 支持海量文本编辑（几万行基本不卡，额，是基本，详情见下）、基于AliceLex的词法分析可以支持各种语言的高亮、各种颜色主题可配置（目前只演示了JS的高亮和借用的Aptana的主题）
 *
 * Todo：
 * 选择文本时，如果光标已经移动到了文本可见区域下方（左、右、上），不能自动持续向下滚动以选择更多文本。必须还是要移动鼠标才行。
 * 目前的滚动条的实现有问题，原生的滚动条宽度在不同分辨率的显示器上不兼容。同时不能自己改变滚动条颜色风格，考虑自己重写实现。
 * 其它语言高亮、其它主题.
 * 查找替换。
 * 自动补全括号、大括号、自动缩进、撤销、重做。
 * 双击单词后将相同的单词高亮（类似notepad++）。 * 智能提示（下个版本）
 * chrome下面打开中文输入法后有问题。
 * 
 * PS:
 * 打个小广告，编辑器代码高亮的词法分析器使用的是也是我写的一个项目AliceLex自动生成的。
 * AliceLex是纯基于Javascript的词法分析器自动生成工具（也就是通常意义上的lex）。
 * 是我的毕业设计，欢迎大家通过最下面的链接围观^-^~~~~~~~~~~~~
 */

