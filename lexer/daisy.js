if(typeof Daisy==='undefined')
	Daisy = {};
if(typeof Daisy.Lexer === 'undefined')
	Daisy.Lexer = {};

	
(function(D,L){
	
	L.Daisy = function(editor) {
		this.editor = editor;
		this.source = null;
		this.index = 0;
	}
	L.Daisy.prototype={
		_isNumber : function(c){
			return c>='0' && c<='9';
		},
		_isAlpha : function(c){
			return c>='a' && c<='z' || c>='A' && c<='Z';
		},
		_isWord : function(c){
			return this._isNumber(c) || this._isAlpha(c) || c==='_';
		},
		lex : function(){
			var f_time=new Date().getTime();
			
			this.source = this.editor.doc.text_array;
			this.index = 0;
			while(true){
				var c = this.source[this.index];
				if(c==='+'|c==='-'){
					this.editor.doc.setColor(this.index,'operator');
					this.index++;
				}
				else if(this._isNumber(c)){
					while(this._isNumber(c)){
						this.editor.doc.setColor(this.index,'number');
						this.index++;
						if(this.index===this.source.length)
							break;
						c=this.source[this.index];
					}
				}else if(this._isWord(c)){
					while(this._isWord(c)){
						this.editor.doc.setColor(this.index,'word');
						this.index++;
						if(this.index===this.source.length)
							break;
						c=this.source[this.index];
					}
				}else{
					this.editor.doc.setColor(this.index,'default');
					this.index++;
				}
				if(this.index===this.source.length)
					break;
			}
			
			$.log("lex time: "+(new Date().getTime()-f_time));
		}
	}	
})(Daisy,Daisy.Lexer);
