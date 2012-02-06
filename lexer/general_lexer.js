if(typeof Daisy==='undefined')
	Daisy = {};
if(typeof Daisy.Lexer === 'undefined')
	Daisy.Lexer = {};

	
(function(D,L){
	/**
	 * 一个通用高亮词法器，直接返回整个文本区域，不设置任何高亮颜色。
	 * 这个实际上是一个高亮词法器的接口，通过三个公开函数向editor传递高亮规则
	 * setEditor:设置文本源
	 * lex : 词法解析过程.
	 * hasMore: 是否已经解析到末尾。
	 * start: 开始解析
	 * 
	 * 当前版本还未考虑文本折叠的功能。在以后考虑之后可能会在lex模块增加新的接口。
	 */
	L.General = function(editor) {
		this.editor = editor;
		this.source = null;
		this.theme = editor.theme;
		this.has_more = false;
		this.cur_style_range = null;
	}
	L.General.prototype={
		lex : function(){
			this.source = this.editor.doc.text_array;
			for(var i=0;i<this.source.length;i++){
				this.editor.doc.setColor(i,'default');
			}
		}
	}	
})(Daisy,Daisy.Lexer);
