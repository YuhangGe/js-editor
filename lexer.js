if( typeof Daisy === 'undefined')
	Daisy = {};
if( typeof Daisy.Lexer === 'undefined')
	Daisy.Lexer = {};

Daisy.Lexer.ACT_TYPE = {
	NO_ACTION : -1,
	UNKNOW_CHAR : -2,
	UNMATCH_CHAR : -3
}

Daisy.Lexer.Help = {
	_str_to_arr : function(strs, arrs) {
		for(var j = 0; j < strs.length; j++) {
			var str = strs[j], arr = arrs[j], t = str.charCodeAt(0), len = str.length, c = 0;
			for(var i = 1; i < len; i++) {
				if(t === 0)
					arr[i - 1] = str.charCodeAt(i) - 1;
				else {
					var n = str.charCodeAt(i) - 1, v = str.charCodeAt(i + 1) - 1;
					for(var k = 0; k < n; k++) {
						arr[c] = v;
						c++;
					}
					i++;
				}
			}
		}

	}
}

Daisy._LexerManager = function(editor){
	this.DELAY_LEN = 100000;
	this.editor = editor;
	this.lexer_hash = {};
	this.lexer = null;
	this.busy_work = null;
	this.wait = false;
	this.check_line = [];
	//this.lexer_worker = new Worker("lexer_worker.js");
	//this.lexer_worker.onmessage = this.onlexer;
}
Daisy._LexerManager.prototype = {
	setLexer : function(name){
		if(this.lexer_hash[name]==null)
			this.lexer_hash[name]=new Daisy.Lexer[name](this.editor);
		this.lexer = this.lexer_hash[name];
	},
	_delayLex : function(lines){
		var me = this;
		if(lines!=null)
			this.check_line = this.check_line.concat(lines);
		
		if(this.busy_work===null){
			this.busy_work = setTimeout(function(){
				var f_t = new Date().getTime();
				me.lexer.lex();
				//$.log('lex time: '+ (new Date().getTime()-f_t))
				for(var i=0;i<me.check_line.length;i++){
					me.editor.doc.line_info[me.check_line[i]].check_width = true;
				}
				//$.log(me.check_line.length);
				me.check_line.length = 0;
				me.editor.render.paint();
				me.busy_work = null;
				if(me.wait){
					me.wait = false;
					setTimeout(function(){
						me.lex();
					},0);
				}
			},0);
		}else{
			//$.log('busy!');
			this.wait = true;
		}
	},
	lex : function(lines){
		/**
		 * 此处把lex工作交给另外一个线程处理。因为当文本量巨大的时候，lex工作会消耗很多时间。
		 * 注意这里是没有作用的，setTimeout并没有起到多线程的作用，当lex正在执行的时候还是会卡住，这里只是演示一个设计。
		 * 下一个版本会学习并使用javascript 的 Work 类实现多进程。
		 * 具体来说，应该有一个队列维护当前的lex请求，如果队列中只会存在最多两个请求，一个是正在执行的，一个是待执行的，
		 * 如果当前正在执行的 lex 工作未完成，后续的更多的lex请求只接受一个，即最近的一个。
		 */
		//return
		
		//$.log(this.editor.doc.text_array.length)
		/**
		 * 如果文本量少于this.DELAY_LEN，则及时进行lex，这样可以快速地显示颜色，而且不需要进行两次paint
		 * 但当文本量太多时，lex操作反而会影响响应，则需要延迟进行。
		 * 尝试用Worker类未果，因为Worker线程之间数据传输都是structured copy。不能直接共享数据。。。。
		 */
		if(this.editor.doc.text_array.length<this.DELAY_LEN){
			this.lexer.lex();
		}else{
			this._delayLex(lines);
		}
	}
	
}
