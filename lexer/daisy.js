if( typeof Daisy === 'undefined')
	Daisy = {};
if( typeof Daisy.Lexer === 'undefined')
	Daisy.Lexer = {};
(function(D, L) {

	var str_to_array = function(strs, arrs) {
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
	var TABLE = {
		_base : new Int32Array(35),
		_default : new Int32Array(35),
		_check : new Int32Array(504),
		_next : new Int32Array(504),
		_action : new Int32Array(35),
		_eqc : new Int32Array(256)
	};

	str_to_array(["\0\1\1\1\1\1\2\30\51\72\x4b\x5c\x6d\x7e\x8f\xa0\xb1\xc2\xd3\1\xe4\xf5\u0106\u0117\u0128\u0139\u014a\u015b\u016c\u017d\u018e\u019f\u01b1\1\u01c9\u01e1", "\1\23\0\2\7\16\0\2\40\2\0\2\5", "\1\3\0\2\3\3\6\20\0\2\4\2\0\3\5\3\7\2\0\17\7\3\10\2\0\17\10\3\11\2\0\17\11\3\12\2\0\17\12\3\13\2\0\17\13\3\14\2\0\17\14\3\15\2\0\17\15\3\16\2\0\17\16\3\17\2\0\17\17\3\20\2\0\17\20\3\21\2\0\17\21\3\22\2\0\17\22\3\24\2\0\17\24\3\25\2\0\17\25\3\26\2\0\17\26\3\27\2\0\17\27\3\30\2\0\17\30\3\31\2\0\17\31\3\32\2\0\17\32\3\33\2\0\17\33\3\34\2\0\17\34\3\35\2\0\17\35\3\36\2\0\17\36\3\37\2\0\17\37\31\40\31\42\27\43\3\0", "\1\3\0\2\3\2\6\2\3\20\0\2\41\2\0\3\5\3\23\2\0\21\23\2\0\2\35\20\23\2\0\5\23\2\35\14\23\2\0\5\23\2\33\14\23\2\0\6\23\2\32\13\23\2\0\13\23\2\36\6\23\2\0\14\23\2\35\5\23\2\0\3\23\2\31\16\23\2\0\6\23\2\30\13\23\2\0\11\23\2\27\10\23\2\0\15\23\2\25\4\23\2\0\13\23\2\24\6\23\2\0\14\23\2\21\5\23\2\0\5\23\2\20\14\23\2\0\16\23\2\17\3\23\2\0\16\23\2\14\3\23\2\0\15\23\2\16\4\23\2\0\2\15\20\23\2\0\11\23\2\7\10\23\2\0\10\23\2\10\11\23\2\0\4\23\2\11\15\23\2\0\6\23\2\7\13\23\2\0\5\23\2\7\14\23\2\0\2\23\2\7\15\23\25\41\2\42\30\41\2\42\2\40\3\41\2\2\2\23\2\6\2\2\2\37\2\26\2\34\2\23\2\13\2\23\2\12\3\23\2\22\5\23\4\1\2\4\3\0", "\1\2\15\2\20\2\12\2\15\2\17\2\11\2\13\31\14\2\16\4\0", "\1\12\1\2\30\2\27\26\1\2\30\12\1\2\25\2\23\2\1\2\24\2\4\2\26\13\3\50\1\2\2\2\13\2\21\2\15\2\11\2\6\2\14\2\10\2\5\5\2\2\12\2\20\2\16\2\2\2\17\2\2\2\7\2\22\6\2\x86\1"], [TABLE._base, TABLE._default, TABLE._check, TABLE._next, TABLE._action, TABLE._eqc]);

	L.Daisy = function(editor) {
		this.editor = editor;
		this.src = null;
		this.theme = editor.theme;
		this.end = 0;
		this.idx = 0;
		this.chr = -1;
		//初始状态，init_state，恒为状态表中的第一个起始状态。
		this.i_s = 34;

	}
	var NO_ACTION = -1, UNKNOW_CHAR = -2, UNMATCH_CHAR = -3;

	L.Daisy.prototype = {
		read_ch : function() {
			if(this.idx >= this.end) {
				return this.chr = -1;
			} else
				return this.chr = this.src[this.idx++].charCodeAt(0);
		},
		do_lex : function() {
			var go_on = true;
			this.idx = 0;
			//$.log("idx:"+this.idx);
			while(go_on) {
				var yylen = 0, yytxt = "";
				var state = this.i_s, action = NO_ACTION;
				var pre_idx = this.idx, pre_action = NO_ACTION, pre_act_len = 0;

				while(true) {
					if(this.read_ch() < 0) {
						if(pre_action >= 0) {
							action = pre_action;
							yylen = pre_act_len;
							this.idx = pre_idx + pre_act_len;
						} else if(pre_idx < this.end) {
							action = UNMATCH_CHAR;
							this.idx = pre_idx + 1;
						}
						if(pre_idx >= this.end) {
							go_on = false;
						}
						break;
					} else {
						yylen++;
					}
					var eqc = TABLE._eqc[this.chr];
					//$.dprint("chr: %d,eqc %d",this.chr,eqc);
					if(eqc === undefined) {
						action = UNKNOW_CHAR;
						break;
					}
					var offset, next = -1, s = state;

					while(s >= 0) {
						offset = TABLE._base[s] + eqc;
						if(TABLE._check[offset] === s) {
							next = TABLE._next[offset];
							break;
						} else {
							s = TABLE._default[s];
						}
					}

					if(next < 0) {
						if(pre_action >= 0) {
							action = pre_action;
							yylen = pre_act_len;
							this.idx = pre_idx + pre_act_len;
						} else {
							action = UNMATCH_CHAR;
							this.idx = pre_idx + 1;
						}
						//跳出内层while，执行对应的action动作
						break;
					} else {
						state = next;
						action = TABLE._action[next];
						if(action >= 0) {
							/**
							 * 如果action>=0，说明该状态为accept状态。
							 */
							pre_action = action;
							pre_act_len = yylen;
						}
					}
				}
				//yytxt = this.src.substr(pre_idx, yylen);
				switch(action) {
					case UNKNOW_CHAR:
						$.dprint("unknow char %d(%c)", this.chr, this.chr);
						break;
					case UNMATCH_CHAR:
						$.dprint("unmath char %d(%c)", this.chr, this.chr);
						break;

					case 12:

						break;
					case 15:

						break;
					case 9:

						break;
					case 14:

						break;
					case 8:

						break;
					case 10:

						break;
					case 11:

						break;
					case 13:

						break;

					default :
						// do nothing...
						break;
				}
			}
			//$.log("idx:"+this.idx);
		},
		lex : function() {
			this.src = this.editor.doc.text_array;
			this.end = this.src.length - 1;
			//$.log("lex!" + this.src.length);
			this.do_lex();
		}
	}

})(Daisy, Daisy.Lexer);
