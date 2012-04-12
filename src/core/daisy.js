/***
 * 全局命名空间Daisy.定义了命明空间Daisy和其下的两个子命名空间Lexer和Theme，以及辅助函数类 $ 。
 * 这个文件必须首先引用。之后的文件代码统一使用如下格式：
 * (function(Daisy,$){
 * 	  /*
 *     * code here
 *     */ 
/* })(Daisy,Daisy.$);
 * 
 * 这样单独引用各个源码文件可以正常使用。在将源码文件合并压缩时，
 * 将上面格式中除去首末两行后的代码合并到一起。 
 *
 */
Daisy = {
	Lexer : {
		
	},
	Theme : {
		
	},
	$ : function(id){
		return document.getElementById(id);
	}
};