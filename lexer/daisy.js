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
	L.Daisy = {
		source : null,
		editor: null,
		theme : null,
		has_more : false,
		cur_range : null,
		index : 0,
		start : function(){
			if(this.source.length>0)
				this.has_more = true;
			else
				this.has_more = false;
			this.index = 0;
		},
		setEditor : function(editor){
			this.editor = editor;
			this.theme = editor.theme;
			this.source = editor.text_array;
			this.start();
		},
		_isNumber : function(c){
			return c>='0' && c<='9';
		},
		_isAlpha : function(c){
			return c>='a' && c<='z' || c>='A' && c<='Z';
		},
		_isWord : function(c){
			return this._isNumber(c) || this._isAlpha(c) || c==='_';
		},
		/**
		 * 每一次调用，返回一个StyleRange
		 */
		lex : function(){
			var c = this.source[this.index],start = this.index-1,length =1,
				rtn = null;
			if(c==='+'|c==='-'){
				rtn = new D.StyleRange(start,length,{color:this.theme.operator});
				this.index++;
			}
			else if(this._isNumber(c)){
				while(this._isNumber(c)){
					this.index++;
					length++;
					if(this.index===this.source.length)
						break;
					c=this.source[this.index];
					
				}
				rtn = new D.StyleRange(start,length-1,{color:this.theme.number});
			}else if(this._isWord(c)){
				while(this._isWord(c)){
					this.index++;
					length++;
					if(this.index===this.source.length)
						break;
					c=this.source[this.index];
		
				}
				rtn = new D.StyleRange(start,length-1,{color:this.theme.word});
			}else{
				rtn = new D.StyleRange(start,length);
				this.index++;
			}
			if(this.index===this.source.length)
				this.has_more = false;
			//$.log(rtn);
			return rtn;
		},
		hasMore : function(){
			return this.has_more;
		}
	}	
})(Daisy,Daisy.Lexer);
