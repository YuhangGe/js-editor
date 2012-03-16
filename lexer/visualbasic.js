if( typeof Daisy === 'undefined')
	Daisy = {};
if( typeof Daisy.Lexer === 'undefined')
	Daisy.Lexer = {};
(function(D, L) {
	var DEFAULT = 154, COMMENT = 155, STRING_A = 156;

	L.VB = function(editor) {
		this.editor = editor;
		this.src = null;
		this.theme = editor.theme;
		this.end = 0;
		this.idx = 0;
		this.chr = -1;
		this.i_s = 154;
		this.yydefault = "default";
		this.yystyle = null;
		this.TABLE = {
			_base : (window.Int32Array ? new Int32Array(157) : new Array(157)),
			_default : (window.Int32Array ? new Int32Array(157) : new Array(157)),
			_check : (window.Int32Array ? new Int32Array(3591) : new Array(3591)),
			_next : (window.Int32Array ? new Int32Array(3591) : new Array(3591)),
			_action : (window.Int32Array ? new Int32Array(157) : new Array(157)),
			_eqc : (window.Int32Array ? new Int32Array(256) : new Array(256))
		};

		L.Help._str_to_arr(["\0\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\2\1\1\6\44\76\x58\x72\x8c\xa6\1\xc0\xda\xf4\u010e\u0128\u0142\u015c\u0176\u0190\u01aa\u01c4\u01de\u01f8\u0212\u022c\u0246\u0260\u027a\u0294\u02ae\u02c8\u02e2\u02fc\u0316\u0330\u034a\u0364\u037e\u0398\u03b2\u03cc\u03e6\u0400\u041a\u0434\u044e\u0468\u0482\u049c\u04b6\u04d0\u04ea\u0504\u051e\u0538\u0552\u056c\u0586\u05a0\u05ba\u05d4\u05ee\u0608\u0622\u063c\u0656\u0670\u068a\1\u06a4\u06be\u06d8\u06f2\u070c\u0726\u0740\u075a\u0774\u078e\u07a8\u07c2\u07dc\u07f6\u0810\u082a\u0844\u085e\u0878\u0892\u08ac\u08c6\u08e0\u08fa\u0914\u092e\u0948\u0962\u097c\u0996\u09b0\u09ca\u09e4\u09fe\u0a18\u0a32\u0a4c\u0a66\u0a80\u0a9a\u0ab4\u0ace\u0ae8\u0b02\u0b1c\u0b36\u0b50\u0b6a\u0b84\u0b9e\u0bb8\u0bd2\u0bec\u0c06\u0c20\u0c3a\u0c54\u0c6e\u0c88\u0ca2\u0cbc\u0cd6\u0cf0\u0d0a\u0d24\u0d3e\u0d58\u0d72\u0d8d\u0db6\1\u0ddf", "\1\14\0\2\11\2\12\2\11\3\0\3\13\2\20\7\0\2\30\73\0\2\30\x46\0\2\13\2\x9a\2\0", "\1\2\x9c\2\0\2\12\2\11\3\20\2\23\27\0\2\13\2\21\2\22\3\0\2\23\3\0\3\24\2\0\2\17\27\24\3\25\3\0\27\25\3\26\3\0\27\26\3\27\3\0\27\27\3\30\3\0\27\30\3\31\3\0\27\31\3\33\3\0\27\33\3\34\3\0\27\34\3\35\3\0\27\35\3\36\3\0\27\36\3\37\3\0\27\37\3\40\3\0\27\40\3\41\3\0\27\41\3\42\3\0\27\42\3\43\3\0\27\43\3\44\3\0\27\44\3\45\3\0\27\45\3\46\3\0\27\46\3\47\3\0\27\47\3\50\3\0\27\50\3\51\3\0\27\51\3\52\3\0\27\52\3\53\3\0\27\53\3\54\3\0\27\54\3\55\3\0\27\55\3\56\3\0\27\56\3\57\3\0\27\57\3\60\3\0\27\60\3\61\3\0\27\61\3\62\3\0\27\62\3\63\3\0\27\63\3\64\3\0\27\64\3\65\3\0\27\65\3\66\3\0\27\66\3\67\3\0\27\67\3\70\3\0\27\70\3\71\3\0\27\71\3\72\3\0\27\72\3\73\3\0\27\73\3\74\3\0\27\74\3\75\3\0\27\75\3\76\3\0\27\76\3\77\3\0\27\77\3\x40\3\0\27\x40\3\x41\3\0\27\x41\3\x42\3\0\27\x42\3\x43\3\0\27\x43\3\x44\3\0\27\x44\3\x45\3\0\27\x45\3\x46\3\0\27\x46\3\x47\3\0\27\x47\3\x48\3\0\27\x48\3\x49\3\0\27\x49\3\x4a\3\0\27\x4a\3\x4b\3\0\27\x4b\3\x4c\3\0\27\x4c\3\x4d\3\0\27\x4d\3\x4e\3\0\27\x4e\3\x4f\3\0\27\x4f\3\x50\3\0\27\x50\3\x51\3\0\27\x51\3\x52\3\0\27\x52\3\x53\3\0\27\x53\3\x54\3\0\27\x54\3\x56\3\0\27\x56\3\x57\3\0\27\x57\3\x58\3\0\27\x58\3\x59\3\0\27\x59\3\x5a\3\0\27\x5a\3\x5b\3\0\27\x5b\3\x5c\3\0\27\x5c\3\x5d\3\0\27\x5d\3\x5e\3\0\27\x5e\3\x5f\3\0\27\x5f\3\x60\3\0\27\x60\3\x61\3\0\27\x61\3\x62\3\0\27\x62\3\x63\3\0\27\x63\3\x64\3\0\27\x64\3\x65\3\0\27\x65\3\x66\3\0\27\x66\3\x67\3\0\27\x67\3\x68\3\0\27\x68\3\x69\3\0\27\x69\3\x6a\3\0\27\x6a\3\x6b\3\0\27\x6b\3\x6c\3\0\27\x6c\3\x6d\3\0\27\x6d\3\x6e\3\0\27\x6e\3\x6f\3\0\27\x6f\3\x70\3\0\27\x70\3\x71\3\0\27\x71\3\x72\3\0\27\x72\3\x73\3\0\27\x73\3\x74\3\0\27\x74\3\x75\3\0\27\x75\3\x76\3\0\27\x76\3\x77\3\0\27\x77\3\x78\3\0\27\x78\3\x79\3\0\27\x79\3\x7a\3\0\27\x7a\3\x7b\3\0\27\x7b\3\x7c\3\0\27\x7c\3\x7d\3\0\27\x7d\3\x7e\3\0\27\x7e\3\x7f\3\0\27\x7f\3\x80\3\0\27\x80\3\x81\3\0\27\x81\3\x82\3\0\27\x82\3\x83\3\0\27\x83\3\x84\3\0\27\x84\3\x85\3\0\27\x85\3\x86\3\0\27\x86\3\x87\3\0\27\x87\3\x88\3\0\27\x88\3\x89\3\0\27\x89\3\x8a\3\0\27\x8a\3\x8b\3\0\27\x8b\3\x8c\3\0\27\x8c\3\x8d\3\0\27\x8d\3\x8e\3\0\27\x8e\3\x8f\3\0\27\x8f\3\x90\3\0\27\x90\3\x91\3\0\27\x91\3\x92\3\0\27\x92\3\x93\3\0\27\x93\3\x94\3\0\27\x94\3\x95\3\0\27\x95\3\x96\3\0\27\x96\3\x97\3\0\27\x97\3\x98\3\0\27\x98\3\x99\3\0\27\x99\51\x9a\36\x9b\2\0\14\x9b\52\x9d", "\1\2\5\2\0\2\16\2\11\2\20\2\16\2\15\27\0\4\3\3\0\2\3\3\0\3\x55\2\0\2\6\4\x55\2\x87\25\x55\3\0\6\x55\2\x7a\21\x55\2\x70\2\x55\3\0\31\x55\3\0\3\x55\2\x6d\26\x55\3\0\31\x55\3\0\2\75\30\x55\3\0\2\x55\2\x97\27\x55\3\0\4\x55\2\x95\25\x55\3\0\2\x94\30\x55\3\0\2\x55\2\x94\27\x55\3\0\3\x55\2\x94\26\x55\3\0\3\x55\2\x93\17\x55\2\30\7\x55\3\0\4\x55\2\x90\25\x55\3\0\6\x55\2\x97\23\x55\3\0\6\x55\2\x95\23\x55\3\0\7\x55\2\x94\22\x55\3\0\7\x55\2\x8d\22\x55\3\0\6\x55\2\x8b\23\x55\3\0\2\71\7\x55\2\x97\21\x55\3\0\10\x55\2\x94\21\x55\3\0\2\x42\7\x55\2\x94\21\x55\3\0\10\x55\2\x93\21\x55\3\0\2\x89\30\x55\3\0\4\x55\2\x89\25\x55\3\0\6\x55\2\x89\23\x55\3\0\3\x55\2\x45\3\x55\2\x85\2\x7b\3\x55\2\x95\2\x5a\16\x55\3\0\10\x55\2\x89\21\x55\3\0\2\x55\2\x83\27\x55\3\0\2\x80\30\x55\3\0\2\x55\2\x53\2\x55\2\x83\25\x55\3\0\4\x55\2\x58\6\x55\2\x98\17\x55\3\0\12\x55\2\x88\17\x55\3\0\12\x55\2\x83\15\x55\2\x7c\2\x55\3\0\2\x41\2\x55\2\x6e\2\x44\25\x55\3\0\2\x7d\30\x55\3\0\10\x55\2\x7d\21\x55\3\0\13\x55\2\x82\14\x55\2\x79\2\x55\3\0\31\x55\3\0\2\x77\30\x55\3\0\14\x55\2\x8e\15\x55\3\0\4\x55\2\x74\25\x55\3\0\7\x55\2\x73\10\x55\2\45\12\x55\3\0\11\x55\2\x76\20\x55\3\0\11\x55\2\x75\20\x55\3\0\2\x55\2\x71\27\x55\3\0\17\x55\2\x99\12\x55\3\0\17\x55\2\x97\12\x55\3\0\7\x55\2\x6a\22\x55\3\0\11\x55\2\x6b\20\x55\3\0\13\x55\2\x6c\16\x55\3\0\16\x55\2\x69\13\x55\3\0\4\x55\2\x66\25\x55\3\0\13\x55\2\x64\16\x55\3\0\2\x55\2\x61\27\x55\3\0\17\x55\2\x63\12\x55\3\0\2\x5f\14\x55\2\x50\14\x55\3\0\21\x55\2\x8e\10\x55\3\0\2\x55\2\x56\20\x55\2\x8f\7\x55\3\0\2\x5d\30\x55\3\0\4\x55\2\x5c\25\x55\3\0\7\x55\2\x5d\22\x55\3\0\6\x55\2\x5b\23\x55\3\0\12\x55\2\x58\17\x55\3\0\6\x55\2\x57\23\x55\3\0\4\x55\2\x54\25\x55\3\0\25\x55\2\30\4\x55\3\0\24\x55\2\30\5\x55\3\0\23\x55\2\30\6\x55\3\0\11\x55\2\x52\20\x55\3\0\7\x55\2\x51\22\x55\3\0\2\x55\2\x4f\27\x55\3\0\22\x55\2\30\7\x55\3\0\12\x55\2\x4c\2\x4d\16\x55\3\0\4\x55\2\x4b\25\x55\3\0\4\x55\2\x4a\25\x55\3\0\2\x55\2\x49\27\x55\3\0\2\x55\2\x48\27\x55\3\0\2\x48\30\x55\3\0\20\x55\2\54\11\x55\3\0\3\x55\2\x59\15\x55\2\30\11\x55\3\0\20\x55\2\30\11\x55\3\0\20\x55\2\25\11\x55\3\0\2\x55\2\x5e\2\x47\26\x55\3\0\7\x55\2\x46\22\x55\3\0\4\x55\2\x43\25\x55\3\0\17\x55\2\73\12\x55\3\0\17\x55\2\30\12\x55\3\0\16\x55\2\44\13\x55\3\0\16\x55\2\30\13\x55\3\0\15\x55\2\64\14\x55\3\0\13\x55\2\x40\16\x55\3\0\13\x55\2\77\16\x55\3\0\12\x55\2\77\2\x6e\16\x55\3\0\4\x55\2\74\25\x55\3\0\14\x55\2\34\15\x55\3\0\14\x55\2\32\15\x55\3\0\14\x55\2\30\15\x55\3\0\13\x55\2\65\16\x55\3\0\13\x55\2\55\16\x55\3\0\13\x55\2\44\16\x55\3\0\7\x55\2\70\22\x55\3\0\12\x55\2\42\17\x55\3\0\6\x55\2\x62\4\x55\2\33\17\x55\3\0\12\x55\2\30\17\x55\3\0\4\x55\2\76\6\x55\2\27\2\x59\16\x55\3\0\4\x55\2\61\25\x55\3\0\3\x55\2\60\26\x55\3\0\11\x55\2\47\20\x55\3\0\11\x55\2\37\20\x55\3\0\11\x55\2\30\20\x55\3\0\6\x55\2\57\23\x55\3\0\7\x55\2\52\22\x55\3\0\7\x55\2\50\2\x55\2\x65\20\x55\3\0\7\x55\2\50\22\x55\3\0\2\x55\2\53\27\x55\3\0\10\x55\2\30\21\x55\3\0\3\x55\2\67\4\x55\2\x78\2\30\2\x67\20\x55\3\0\7\x55\2\30\20\x55\2\43\2\x55\3\0\6\x55\2\51\2\x84\3\x55\2\x81\17\x55\3\0\6\x55\2\36\23\x55\3\0\6\x55\2\35\23\x55\3\0\2\x55\2\41\17\x55\2\46\10\x55\3\0\5\x55\2\30\24\x55\3\0\5\x55\2\30\4\x55\2\31\12\x55\2\x6f\4\x55\2\62\2\x55\3\0\2\x55\2\40\27\x55\3\0\4\x55\2\32\25\x55\3\0\4\x55\2\30\25\x55\3\0\2\x55\2\30\27\x55\3\0\2\x55\2\24\17\x55\2\x60\10\x55\3\0\2\30\30\x55\3\0\2\26\26\x55\2\30\2\x55\3\0\27\x55\51\x9a\2\4\2\12\2\x55\2\20\2\14\2\23\2\x92\2\x7f\2\x55\2\x86\2\56\2\x8a\2\x72\2\66\2\63\2\x96\2\x91\2\x55\2\x68\2\x4e\2\x8c\2\x7e\4\x55\2\72\3\x55\2\13\2\0\2\21\2\22\7\3\2\2\2\4\2\1\2\10\50\7\2\17", "\1\2\10\2\5\2\4\2\14\2\7\2\12\2\11\2\13\2\1\3\4\2\14\3\0\2\13\2\1\3\14\2\4\7\2\2\1\x80\3\2\6\2\0\2\6\2\0", "\1\13\50\2\1\27\50\2\43\2\51\2\50\2\34\2\46\2\2\2\47\3\50\2\41\2\35\2\50\2\6\2\5\2\42\13\4\3\50\2\37\2\36\2\40\3\50\33\34\4\50\2\45\2\34\2\50\2\14\2\24\2\25\2\26\2\12\2\13\2\22\2\3\2\21\2\50\2\33\2\15\2\31\2\17\2\20\2\23\2\34\2\10\2\16\2\7\2\11\2\27\2\32\2\34\2\30\2\34\2\50\2\44\x84\50"], [this.TABLE._base, this.TABLE._default, this.TABLE._check, this.TABLE._next, this.TABLE._action, this.TABLE._eqc]);

	}

	L.VB.prototype = {

		read_ch : function() {
			if(this.idx >= this.end)
				return this.chr = -1;
			else {
				/*
				 return this.chr = this.src[this.idx++].charCodeAt(0);
				 */
				this.chr = this.src[this.idx++].charCodeAt(0);
				if(this.chr >= 65 && this.chr <= 90)
					this.chr += 32;
				return this.chr;

			}
		},
		do_lex : function() {
			var go_on = true;
			this.idx = 0;
			while(go_on) {
				var yylen = 0;
				var state = this.i_s, action = L.ACT_TYPE.NO_ACTION;
				var pre_idx = this.idx, pre_action = L.ACT_TYPE.NO_ACTION, pre_act_len = 0;

				while(true) {
					if(this.read_ch() < 0) {
						if(pre_action >= 0) {
							action = pre_action;
							yylen = pre_act_len;
							this.idx = pre_idx + pre_act_len;
						} else if(pre_idx < this.end) {
							action = L.ACT_TYPE.UNMATCH_CHAR;
							this.idx = pre_idx + 1;
						}
						if(pre_idx >= this.end) {
							go_on = false;
						}
						break;
					} else {
						yylen++;
					}
		
					var eqc = this.TABLE._eqc[this.chr];

					if(eqc === undefined) {
						if(pre_action >= 0) {
							action = pre_action;
							yylen = pre_act_len;
							this.idx = pre_idx + pre_act_len;
						}else
							action = L.ACT_TYPE.UNKNOW_CHAR;
						break;
					}
					var offset, next = -1, s = state;

					while(s >= 0) {
						offset = this.TABLE._base[s] + eqc;
						if(this.TABLE._check[offset] === s) {
							next = this.TABLE._next[offset];
							break;
						} else {
							s = this.TABLE._default[s];
						}
					}

					if(next < 0) {
						if(pre_action >= 0) {
							action = pre_action;
							yylen = pre_act_len;
							this.idx = pre_idx + pre_act_len;
						} else {
							action = L.ACT_TYPE.UNMATCH_CHAR;
							this.idx = pre_idx + 1;
						}
						//跳出内层while，执行对应的action动作
						break;
					} else {
						state = next;
						action = this.TABLE._action[next];
						if(action >= 0) {
							/**
							 * 如果action>=0，说明该状态为accept状态。
							 */
							pre_action = action;
							pre_act_len = yylen;
						}
					}
				}

				switch(action) {
	
					case 1:
						this.yystyle = "keyword";
						break;
					case 7:
						this.yystyle = "string";
						this.yydefault = "string";
						this.yygoto(STRING_A);
						break;
					case 4:
						
						this.yystyle = "comment";
						this.yydefault = "comment";
					
						this.yygoto(COMMENT);
						break;
					case 0:
						this.yystyle = "value";
						break;
					case 2:
						this.yystyle = "id";
						break;
					case 3:
						this.yystyle = "operator";
						break;
					case 11:
						this.yystyle = "default";
						break;
					case 6:
						this.yystyle = "comment";
						this.yydefault = "default";
						this.yygoto(DEFAULT);
						break;
					case 5:
						this.yystyle = "comment";
						break;
					case 9:
						this.yystyle = "string";
						break;
					case 8:
						this.yystyle = "string";
						break;
					case 10:
						this.yystyle = "string";
						this.yydefault = "defult";
						this.yygoto(DEFAULT);
						break;

					case L.ACT_TYPE.UNKNOW_CHAR:
					case L.ACT_TYPE.UNMATCH_CHAR:
					default :
						
						this.yystyle = this.yydefault;
						break;
				}
				this.editor.doc.setRangeStyle(pre_idx, yylen, this.yystyle);
			}

		},
		yygoto : function(state) {
			this.i_s = state;
		},
		lex : function() {
			this.src = this.editor.doc.text_array;
			this.end = this.src.length;
			this.i_s = 154;
			this.do_lex();
		}
	}

})(Daisy, Daisy.Lexer);
