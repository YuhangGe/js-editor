if( typeof Daisy === 'undefined')
	Daisy = {};
if( typeof Daisy.Lexer === 'undefined')
	Daisy.Lexer = {};
(function(D, L) {
	var DEFAULT = 156, COMMENT = 157, STRING_A = 158;

	L.visualbasic = function(editor) {
		this.editor = editor;
		this.src = null;
		this.theme = editor.theme;
		this.end = 0;
		this.idx = 0;
		this.chr = -1;
		this.i_s = 156;
		this.yydefault = "default";
		this.yystyle = null;
		this.TABLE = {
			_base : (window.Int32Array ? new Int32Array(159) : new Array(159)),
			_default : (window.Int32Array ? new Int32Array(159) : new Array(159)),
			_check : (window.Int32Array ? new Int32Array(3781) : new Array(3781)),
			_next : (window.Int32Array ? new Int32Array(3781) : new Array(3781)),
			_action : (window.Int32Array ? new Int32Array(159) : new Array(159)),
			_eqc : (window.Int32Array ? new Int32Array(256) : new Array(256))
		};

		L.Help._str_to_arr(["\0\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\2\1\1\6\45\x40\x5b\x76\x91\xac\1\xc7\xe2\xfd\u0118\u0133\u014e\u0169\u0184\u019f\u01ba\u01d5\u01f0\u020b\u0226\u0241\u025c\u0277\u0292\u02ad\u02c8\u02e3\u02fe\u0319\u0334\u034f\u036a\u0385\u03a0\u03bb\u03d6\u03f1\u040c\u0427\u0442\u045d\u0478\u0493\u04ae\u04c9\u04e4\u04ff\u051a\u0535\u0550\u056b\u0586\u05a1\u05bc\u05d7\u05f2\u060d\u0628\u0643\u065e\u0679\u0694\u06af\u06ca\u06e5\1\u0700\u071b\u0736\u0751\u076c\u0787\u07a2\u07bd\u07d8\u07f3\u080e\u0829\u0844\u085f\u087a\u0895\u08b0\u08cb\u08e6\u0901\u091c\u0937\u0952\u096d\u0988\u09a3\u09be\u09d9\u09f4\u0a0f\u0a2a\u0a45\u0a60\u0a7b\u0a96\u0ab1\u0acc\u0ae7\u0b02\u0b1d\u0b38\u0b53\u0b6e\u0b89\u0ba4\u0bbf\u0bda\u0bf5\u0c10\u0c2b\u0c46\u0c61\u0c7c\u0c97\u0cb2\u0ccd\u0ce8\u0d03\u0d1e\u0d39\u0d54\u0d6f\u0d8a\u0da5\u0dc0\u0ddb\u0df6\u0e11\u0e2c\u0e48\u0e72\1\u0e9c", "\1\14\0\2\11\2\12\2\11\3\0\3\13\2\20\7\0\2\30\74\0\2\30\x47\0\2\13\2\x9c\2\0", "\1\2\x9e\2\0\2\12\2\11\3\20\2\23\30\0\2\13\2\21\2\22\3\0\2\23\3\0\3\24\2\0\2\17\30\24\3\25\3\0\30\25\3\26\3\0\30\26\3\27\3\0\30\27\3\30\3\0\30\30\3\31\3\0\30\31\3\33\3\0\30\33\3\34\3\0\30\34\3\35\3\0\30\35\3\36\3\0\30\36\3\37\3\0\30\37\3\40\3\0\30\40\3\41\3\0\30\41\3\42\3\0\30\42\3\43\3\0\30\43\3\44\3\0\30\44\3\45\3\0\30\45\3\46\3\0\30\46\3\47\3\0\30\47\3\50\3\0\30\50\3\51\3\0\30\51\3\52\3\0\30\52\3\53\3\0\30\53\3\54\3\0\30\54\3\55\3\0\30\55\3\56\3\0\30\56\3\57\3\0\30\57\3\60\3\0\30\60\3\61\3\0\30\61\3\62\3\0\30\62\3\63\3\0\30\63\3\64\3\0\30\64\3\65\3\0\30\65\3\66\3\0\30\66\3\67\3\0\30\67\3\70\3\0\30\70\3\71\3\0\30\71\3\72\3\0\30\72\3\73\3\0\30\73\3\74\3\0\30\74\3\75\3\0\30\75\3\76\3\0\30\76\3\77\3\0\30\77\3\x40\3\0\30\x40\3\x41\3\0\30\x41\3\x42\3\0\30\x42\3\x43\3\0\30\x43\3\x44\3\0\30\x44\3\x45\3\0\30\x45\3\x46\3\0\30\x46\3\x47\3\0\30\x47\3\x48\3\0\30\x48\3\x49\3\0\30\x49\3\x4a\3\0\30\x4a\3\x4b\3\0\30\x4b\3\x4c\3\0\30\x4c\3\x4d\3\0\30\x4d\3\x4e\3\0\30\x4e\3\x4f\3\0\30\x4f\3\x50\3\0\30\x50\3\x51\3\0\30\x51\3\x52\3\0\30\x52\3\x53\3\0\30\x53\3\x54\3\0\30\x54\3\x55\3\0\30\x55\3\x57\3\0\30\x57\3\x58\3\0\30\x58\3\x59\3\0\30\x59\3\x5a\3\0\30\x5a\3\x5b\3\0\30\x5b\3\x5c\3\0\30\x5c\3\x5d\3\0\30\x5d\3\x5e\3\0\30\x5e\3\x5f\3\0\30\x5f\3\x60\3\0\30\x60\3\x61\3\0\30\x61\3\x62\3\0\30\x62\3\x63\3\0\30\x63\3\x64\3\0\30\x64\3\x65\3\0\30\x65\3\x66\3\0\30\x66\3\x67\3\0\30\x67\3\x68\3\0\30\x68\3\x69\3\0\30\x69\3\x6a\3\0\30\x6a\3\x6b\3\0\30\x6b\3\x6c\3\0\30\x6c\3\x6d\3\0\30\x6d\3\x6e\3\0\30\x6e\3\x6f\3\0\30\x6f\3\x70\3\0\30\x70\3\x71\3\0\30\x71\3\x72\3\0\30\x72\3\x73\3\0\30\x73\3\x74\3\0\30\x74\3\x75\3\0\30\x75\3\x76\3\0\30\x76\3\x77\3\0\30\x77\3\x78\3\0\30\x78\3\x79\3\0\30\x79\3\x7a\3\0\30\x7a\3\x7b\3\0\30\x7b\3\x7c\3\0\30\x7c\3\x7d\3\0\30\x7d\3\x7e\3\0\30\x7e\3\x7f\3\0\30\x7f\3\x80\3\0\30\x80\3\x81\3\0\30\x81\3\x82\3\0\30\x82\3\x83\3\0\30\x83\3\x84\3\0\30\x84\3\x85\3\0\30\x85\3\x86\3\0\30\x86\3\x87\3\0\30\x87\3\x88\3\0\30\x88\3\x89\3\0\30\x89\3\x8a\3\0\30\x8a\3\x8b\3\0\30\x8b\3\x8c\3\0\30\x8c\3\x8d\3\0\30\x8d\3\x8e\3\0\30\x8e\3\x8f\3\0\30\x8f\3\x90\3\0\30\x90\3\x91\3\0\30\x91\3\x92\3\0\30\x92\3\x93\3\0\30\x93\3\x94\3\0\30\x94\3\x95\3\0\30\x95\3\x96\3\0\30\x96\3\x97\3\0\30\x97\3\x98\3\0\30\x98\3\x99\3\0\30\x99\3\x9a\3\0\30\x9a\3\x9b\3\0\30\x9b\52\x9c\37\x9d\2\0\14\x9d\53\x9f", "\1\2\5\2\0\2\16\2\11\2\20\2\16\2\15\30\0\4\3\3\0\2\3\3\0\3\x56\2\0\2\6\4\x56\2\x89\26\x56\3\0\6\x56\2\x7c\22\x56\2\x72\2\x56\3\0\32\x56\3\0\3\x56\2\x6e\27\x56\3\0\32\x56\3\0\2\75\31\x56\3\0\2\x56\2\x99\30\x56\3\0\4\x56\2\x97\26\x56\3\0\2\x96\31\x56\3\0\2\x56\2\x96\30\x56\3\0\3\x56\2\x96\27\x56\3\0\3\x56\2\x95\20\x56\2\30\7\x56\3\0\4\x56\2\x92\26\x56\3\0\6\x56\2\x99\24\x56\3\0\6\x56\2\x97\24\x56\3\0\7\x56\2\x96\23\x56\3\0\7\x56\2\x8f\23\x56\3\0\6\x56\2\x8d\24\x56\3\0\2\71\7\x56\2\x99\22\x56\3\0\10\x56\2\x96\22\x56\3\0\2\x42\7\x56\2\x96\22\x56\3\0\10\x56\2\x95\22\x56\3\0\2\x8b\31\x56\3\0\4\x56\2\x8b\26\x56\3\0\6\x56\2\x8b\24\x56\3\0\3\x56\2\x45\3\x56\2\x87\2\x7d\3\x56\2\x97\2\x5b\17\x56\3\0\10\x56\2\x8b\22\x56\3\0\2\x56\2\x85\30\x56\3\0\2\x82\31\x56\3\0\2\x56\2\x54\2\x56\2\x85\26\x56\3\0\4\x56\2\x4e\6\x56\2\x9a\20\x56\3\0\12\x56\2\x8a\20\x56\3\0\12\x56\2\x85\16\x56\2\x7e\2\x56\3\0\2\x41\2\x56\2\x6f\2\x44\26\x56\3\0\2\x7f\31\x56\3\0\10\x56\2\x7f\22\x56\3\0\13\x56\2\x84\15\x56\2\x7b\2\x56\3\0\32\x56\3\0\2\x79\31\x56\3\0\14\x56\2\x90\16\x56\3\0\4\x56\2\x76\26\x56\3\0\7\x56\2\x75\10\x56\2\45\13\x56\3\0\11\x56\2\x78\21\x56\3\0\11\x56\2\x77\21\x56\3\0\2\x56\2\x73\2\x56\2\x71\26\x56\3\0\17\x56\2\x9b\13\x56\3\0\17\x56\2\x99\13\x56\3\0\7\x56\2\x6b\23\x56\3\0\11\x56\2\x6c\21\x56\3\0\13\x56\2\x6d\17\x56\3\0\16\x56\2\x6a\14\x56\3\0\4\x56\2\x67\26\x56\3\0\13\x56\2\x65\17\x56\3\0\2\x56\2\x62\30\x56\3\0\17\x56\2\x64\13\x56\3\0\2\x60\14\x56\2\x51\15\x56\3\0\21\x56\2\x90\11\x56\3\0\22\x56\2\x99\3\x56\2\30\5\x56\3\0\2\x56\2\x57\21\x56\2\x91\7\x56\3\0\2\x5e\31\x56\3\0\4\x56\2\x5d\26\x56\3\0\7\x56\2\x5e\23\x56\3\0\6\x56\2\x5c\24\x56\3\0\12\x56\2\x59\20\x56\3\0\6\x56\2\x58\24\x56\3\0\4\x56\2\x55\26\x56\3\0\26\x56\2\30\4\x56\3\0\25\x56\2\30\5\x56\3\0\24\x56\2\30\6\x56\3\0\11\x56\2\x53\21\x56\3\0\7\x56\2\x52\23\x56\3\0\2\x56\2\x50\30\x56\3\0\23\x56\2\30\7\x56\3\0\12\x56\2\x4c\2\x4d\17\x56\3\0\4\x56\2\x4b\26\x56\3\0\4\x56\2\x4a\26\x56\3\0\2\x56\2\x49\30\x56\3\0\2\x56\2\x48\30\x56\3\0\2\x48\31\x56\3\0\20\x56\2\54\12\x56\3\0\3\x56\2\x5a\15\x56\2\30\12\x56\3\0\20\x56\2\30\12\x56\3\0\20\x56\2\25\12\x56\3\0\2\x56\2\x5f\2\x47\27\x56\3\0\7\x56\2\x46\23\x56\3\0\4\x56\2\x43\26\x56\3\0\17\x56\2\73\13\x56\3\0\17\x56\2\30\13\x56\3\0\16\x56\2\44\14\x56\3\0\16\x56\2\30\14\x56\3\0\15\x56\2\64\15\x56\3\0\15\x56\2\30\15\x56\3\0\13\x56\2\x40\17\x56\3\0\13\x56\2\77\17\x56\3\0\12\x56\2\77\2\x6f\17\x56\3\0\4\x56\2\74\26\x56\3\0\14\x56\2\34\16\x56\3\0\14\x56\2\32\16\x56\3\0\14\x56\2\30\16\x56\3\0\13\x56\2\65\17\x56\3\0\13\x56\2\55\17\x56\3\0\13\x56\2\44\17\x56\3\0\7\x56\2\70\23\x56\3\0\12\x56\2\42\20\x56\3\0\6\x56\2\x63\4\x56\2\33\20\x56\3\0\12\x56\2\30\20\x56\3\0\4\x56\2\76\6\x56\2\27\2\x5a\17\x56\3\0\4\x56\2\61\26\x56\3\0\3\x56\2\60\27\x56\3\0\11\x56\2\47\21\x56\3\0\11\x56\2\37\21\x56\3\0\11\x56\2\30\21\x56\3\0\6\x56\2\57\24\x56\3\0\7\x56\2\52\23\x56\3\0\7\x56\2\50\2\x56\2\x66\21\x56\3\0\7\x56\2\50\23\x56\3\0\2\x56\2\53\30\x56\3\0\10\x56\2\30\22\x56\3\0\3\x56\2\67\4\x56\2\x7a\2\30\2\x68\21\x56\3\0\7\x56\2\30\21\x56\2\43\2\x56\3\0\6\x56\2\51\2\x86\3\x56\2\x83\20\x56\3\0\6\x56\2\36\24\x56\3\0\6\x56\2\35\24\x56\3\0\2\x56\2\41\17\x56\2\46\11\x56\3\0\5\x56\2\30\25\x56\3\0\5\x56\2\30\4\x56\2\31\13\x56\2\x70\4\x56\2\62\2\x56\3\0\2\x56\2\40\10\x56\2\30\20\x56\3\0\4\x56\2\32\26\x56\3\0\4\x56\2\30\26\x56\3\0\2\x56\2\30\30\x56\3\0\2\x56\2\24\17\x56\2\x61\11\x56\3\0\2\30\31\x56\3\0\2\26\27\x56\2\30\2\x56\3\0\30\x56\52\x9c\2\4\2\12\2\x56\2\20\2\14\2\23\2\x94\2\x81\2\x56\2\x88\2\56\2\x8c\2\x74\2\66\2\63\2\x98\2\x93\2\x56\2\x69\2\x4f\2\x8e\2\x80\5\x56\2\72\3\x56\2\13\2\0\2\21\2\22\7\3\2\2\2\4\2\1\2\10\51\7\2\17", "\1\2\14\2\11\2\4\2\20\2\13\2\16\2\15\2\17\2\1\3\4\2\20\3\0\2\17\2\1\3\20\2\4\7\2\2\1\x82\3\2\12\2\0\2\12\2\0", "\1\13\51\2\1\27\51\2\44\2\52\2\51\2\35\2\47\2\2\2\50\3\51\2\42\2\36\2\51\2\6\2\5\2\43\13\4\3\51\2\40\2\37\2\41\3\51\33\35\4\51\2\46\2\35\2\51\2\14\2\24\2\25\2\26\2\12\2\13\2\22\2\3\2\21\2\51\2\34\2\15\2\32\2\17\2\20\2\23\2\35\2\10\2\16\2\7\2\11\2\27\2\33\2\30\2\31\2\35\2\51\2\45\x84\51"], [this.TABLE._base, this.TABLE._default, this.TABLE._check, this.TABLE._next, this.TABLE._action, this.TABLE._eqc]);

	}

	L.visualbasic.prototype = {

		read_ch : function() {
			if(this.idx >= this.end)
				return this.chr = -1;
			else {
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
						} else
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
					case 11:
						this.yystyle = "string";
						this.yydefault = "string";
						this.yygoto(STRING_A);
						break;
					case 8:
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
					case 15:
						this.yystyle = "default";
						break;
					case 10:
						this.yystyle = "comment";
						this.yydefault = "default";
						this.yygoto(DEFAULT);
						break;
					case 9:
						this.yystyle = "comment";
						break;
					case 13:
						this.yystyle = "string";
						break;
					case 12:
						this.yystyle = "string";
						break;
					case 14:
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
				this.editor.cur_doc.setRangeStyle(pre_idx, yylen, this.yystyle);
			}

		},
		yygoto : function(state) {
			this.i_s = state;
		},
		lex : function() {
			this.src = this.editor.cur_doc.text_array;
			this.end = this.src.length;
			this.i_s = 156;
			this.do_lex();
		}
	}

})(Daisy, Daisy.Lexer);
