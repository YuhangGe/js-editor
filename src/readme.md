###代码命名空间及相关约定
1. 在editor/utility.js中会首先定义全司命名空间**Daisy**.这是[editor](http://editor.xiaoge.me)唯一的对外接口。
2. 在剩下的所有代码文件中，代码包装在如下格式中:  
    (function(Daisy,$){  
    &nbsp/**  
    * code here  
    */  
    })(Daisy,Daisy.$);
    
 其中Daisy是全局命名空间，Daisy.$是全局辅助类（包括常用的函数）。在build项目（即将各种源码文件合并后压缩成一个文件）时，会将上面的格式中除去首末两行后的代码提取合并。