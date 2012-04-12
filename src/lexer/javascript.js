(function(Daisy, $) {
	/**
	 * javascript 词法解析器。
	 * 由AliceLe词法分析器自动生成工具生成
	 */
	(function(D, L) {
		var DEFAULT = 156, LINE_COMMENT = 157, BLOCK_COMMENT = 158, DOC_COMMENT = 159, STRING_A = 160, STRING_B = 161;
		L.javascript = function(editor) {
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
				_base : (window.Int32Array ? new Int32Array(162) : new Array(162)),
				_default : (window.Int32Array ? new Int32Array(162) : new Array(162)),
				_check : (window.Int32Array ? new Int32Array(4841) : new Array(4841)),
				_next : (window.Int32Array ? new Int32Array(4841) : new Array(4841)),
				_action : (window.Int32Array ? new Int32Array(162) : new Array(162)),
				_eqc : (window.Int32Array ? new Int32Array(256) : new Array(256))
			};

			L.Help._str_to_arr(["\0\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\2\2\2\1\1\1\1\1\1\2\1\1\1\11\10\2\1\1\1\30\1\77\x68\1\x91\1\xba\xe3\u010c\u0135\u015e\u0187\u01b0\u01d9\u0202\u022b\u0254\u027d\u02a6\u02cf\u02f8\u0321\u034a\u0373\u039c\u03c5\u03ee\u0417\u0440\u0469\u0492\u04bb\u04e4\u050d\u0536\u055f\u0588\u05b1\u05da\u0603\u062c\u0655\u067e\u06a7\u06d0\u06f9\u0722\u074b\u0774\1\u079d\u07c6\u07ef\u0818\u0841\u086a\u0893\u08bc\u08e5\u090e\u0937\u0960\u0989\u09b2\u09db\u0a04\u0a2d\u0a56\u0a7f\u0aa8\u0ad1\u0afa\u0b23\u0b4c\u0b75\u0b9e\u0bc7\u0bf0\u0c19\u0c42\u0c6b\u0c94\u0cbd\u0ce6\u0d0f\u0d38\u0d61\u0d8a\u0db3\u0ddc\u0e05\u0e2e\u0e57\u0e80\u0ea9\u0ed2\u0efb\u0f24\u0f4d\u0f76\u0f9f\u0fc8\u0ff1\u101a\1\1\u1043\u107b\u10b3\u10eb\1\u1123\u115b\u1194\u11cd\1\u1206\u123f\u1278\u12b1", "\1\43\0\2\24\3\26\2\43\2\0\3\47\2\0\2\52\3\0\2\55\2\0\2\55\54\0\2\55\67\0\3\55\5\0\2\x95\5\0\2\x9b\5\0", "\1\2\x9e\2\47\2\0\2\53\2\34\3\0\2\35\7\0\2\43\2\36\11\0\3\52\2\x94\3\0\2\46\5\0\3\47\2\0\4\47\2\24\2\46\2\26\2\27\2\30\2\31\2\32\2\33\2\25\2\37\2\40\2\44\2\45\3\0\2\41\2\42\3\52\2\0\4\52\2\54\3\0\27\54\2\0\20\54\2\55\3\0\27\55\2\0\20\55\2\57\3\0\27\57\2\0\20\57\2\61\3\0\27\61\2\0\20\61\2\62\3\0\27\62\2\0\20\62\2\63\3\0\27\63\2\0\20\63\2\64\3\0\27\64\2\0\20\64\2\65\3\0\27\65\2\0\20\65\2\66\3\0\27\66\2\0\20\66\2\67\3\0\27\67\2\0\20\67\2\70\3\0\27\70\2\0\20\70\2\71\3\0\27\71\2\0\20\71\2\72\3\0\27\72\2\0\20\72\2\73\3\0\27\73\2\0\20\73\2\74\3\0\27\74\2\0\20\74\2\75\3\0\27\75\2\0\20\75\2\76\3\0\27\76\2\0\20\76\2\77\3\0\27\77\2\0\20\77\2\x40\3\0\27\x40\2\0\20\x40\2\x41\3\0\27\x41\2\0\20\x41\2\x42\3\0\27\x42\2\0\20\x42\2\x43\3\0\27\x43\2\0\20\x43\2\x44\3\0\27\x44\2\0\20\x44\2\x45\3\0\27\x45\2\0\20\x45\2\x46\3\0\27\x46\2\0\20\x46\2\x47\3\0\27\x47\2\0\20\x47\2\x48\3\0\27\x48\2\0\20\x48\2\x49\3\0\27\x49\2\0\20\x49\2\x4a\3\0\27\x4a\2\0\20\x4a\2\x4b\3\0\27\x4b\2\0\20\x4b\2\x4c\3\0\27\x4c\2\0\20\x4c\2\x4d\3\0\27\x4d\2\0\20\x4d\2\x4e\3\0\27\x4e\2\0\20\x4e\2\x4f\3\0\27\x4f\2\0\20\x4f\2\x50\3\0\27\x50\2\0\20\x50\2\x51\3\0\27\x51\2\0\20\x51\2\x52\3\0\27\x52\2\0\20\x52\2\x53\3\0\27\x53\2\0\20\x53\2\x54\3\0\27\x54\2\0\20\x54\2\x55\3\0\27\x55\2\0\20\x55\2\x56\3\0\27\x56\2\0\20\x56\2\x57\3\0\27\x57\2\0\20\x57\2\x58\3\0\27\x58\2\0\20\x58\2\x59\3\0\27\x59\2\0\20\x59\2\x5a\3\0\27\x5a\2\0\20\x5a\2\x5b\3\0\27\x5b\2\0\20\x5b\2\x5d\3\0\27\x5d\2\0\20\x5d\2\x5e\3\0\27\x5e\2\0\20\x5e\2\x5f\3\0\27\x5f\2\0\20\x5f\2\x60\3\0\27\x60\2\0\20\x60\2\x61\3\0\27\x61\2\0\20\x61\2\x62\3\0\27\x62\2\0\20\x62\2\x63\3\0\27\x63\2\0\20\x63\2\x64\3\0\27\x64\2\0\20\x64\2\x65\3\0\27\x65\2\0\20\x65\2\x66\3\0\27\x66\2\0\20\x66\2\x67\3\0\27\x67\2\0\20\x67\2\x68\3\0\27\x68\2\0\20\x68\2\x69\3\0\27\x69\2\0\20\x69\2\x6a\3\0\27\x6a\2\0\20\x6a\2\x6b\3\0\27\x6b\2\0\20\x6b\2\x6c\3\0\27\x6c\2\0\20\x6c\2\x6d\3\0\27\x6d\2\0\20\x6d\2\x6e\3\0\27\x6e\2\0\20\x6e\2\x6f\3\0\27\x6f\2\0\20\x6f\2\x70\3\0\27\x70\2\0\20\x70\2\x71\3\0\27\x71\2\0\20\x71\2\x72\3\0\27\x72\2\0\20\x72\2\x73\3\0\27\x73\2\0\20\x73\2\x74\3\0\27\x74\2\0\20\x74\2\x75\3\0\27\x75\2\0\20\x75\2\x76\3\0\27\x76\2\0\20\x76\2\x77\3\0\27\x77\2\0\20\x77\2\x78\3\0\27\x78\2\0\20\x78\2\x79\3\0\27\x79\2\0\20\x79\2\x7a\3\0\27\x7a\2\0\20\x7a\2\x7b\3\0\27\x7b\2\0\20\x7b\2\x7c\3\0\27\x7c\2\0\20\x7c\2\x7d\3\0\27\x7d\2\0\20\x7d\2\x7e\3\0\27\x7e\2\0\20\x7e\2\x7f\3\0\27\x7f\2\0\20\x7f\2\x80\3\0\27\x80\2\0\20\x80\2\x81\3\0\27\x81\2\0\20\x81\2\x82\3\0\27\x82\2\0\20\x82\2\x83\3\0\27\x83\2\0\20\x83\2\x84\3\0\27\x84\2\0\20\x84\2\x85\3\0\27\x85\2\0\20\x85\2\x86\3\0\27\x86\2\0\20\x86\2\x87\3\0\27\x87\2\0\20\x87\2\x88\3\0\27\x88\2\0\20\x88\2\x89\3\0\27\x89\2\0\20\x89\2\x8a\3\0\27\x8a\2\0\20\x8a\2\x8b\3\0\27\x8b\2\0\20\x8b\2\x8c\3\0\27\x8c\2\0\20\x8c\2\x8d\3\0\27\x8d\2\0\20\x8d\2\x8e\3\0\27\x8e\2\0\20\x8e\2\x8f\3\0\27\x8f\2\0\20\x8f\2\x90\3\0\27\x90\2\0\20\x90\2\x91\3\0\27\x91\2\0\20\x91\2\x92\3\0\27\x92\2\0\20\x92\71\x95\71\x96\71\x97\71\x98\71\x9a\71\x9b\72\x9c\72\x9d\72\x9f\72\xa0\72\xa1\72\xa2", "\1\2\11\2\47\2\0\2\7\2\1\3\0\2\36\7\0\2\24\2\34\11\0\2\52\2\51\2\35\3\0\2\43\5\0\3\47\2\0\4\47\3\3\2\7\2\26\5\7\2\2\2\12\2\14\2\30\2\7\3\0\2\16\2\21\3\52\2\0\4\52\2\x5c\3\0\27\x5c\2\0\12\x5c\2\x8a\7\x5c\3\0\27\x5c\2\0\21\x5c\3\0\14\x5c\2\x5d\13\x5c\2\0\21\x5c\3\0\4\x5c\2\x93\23\x5c\2\0\21\x5c\3\0\4\x5c\2\x91\23\x5c\2\0\21\x5c\3\0\2\x8f\26\x5c\2\0\21\x5c\3\0\3\x5c\2\x8e\24\x5c\2\0\21\x5c\3\0\2\x5c\2\x8d\15\x5c\2\x42\10\x5c\2\0\21\x5c\3\0\5\x5c\2\x8b\22\x5c\2\0\21\x5c\3\0\6\x5c\2\x90\21\x5c\2\0\21\x5c\3\0\7\x5c\2\x93\20\x5c\2\0\21\x5c\3\0\7\x5c\2\x8e\20\x5c\2\0\21\x5c\3\0\3\x5c\2\x88\2\x73\23\x5c\2\0\21\x5c\3\0\10\x5c\2\x8e\17\x5c\2\0\21\x5c\3\0\7\x5c\2\x86\20\x5c\2\0\21\x5c\3\0\11\x5c\2\x92\16\x5c\2\0\21\x5c\3\0\2\x5c\2\x82\25\x5c\2\0\21\x5c\3\0\2\x80\26\x5c\2\0\21\x5c\3\0\12\x5c\2\x93\15\x5c\2\0\21\x5c\3\0\11\x5c\2\x7d\16\x5c\2\0\21\x5c\3\0\13\x5c\2\x87\14\x5c\2\0\21\x5c\3\0\13\x5c\2\x81\14\x5c\2\0\21\x5c\3\0\5\x5c\2\x7b\22\x5c\2\0\21\x5c\3\0\11\x5c\2\x7a\16\x5c\2\0\21\x5c\3\0\12\x5c\2\x79\15\x5c\2\0\21\x5c\3\0\15\x5c\2\x82\12\x5c\2\0\21\x5c\3\0\2\x76\26\x5c\2\0\21\x5c\3\0\11\x5c\2\x75\16\x5c\2\0\21\x5c\3\0\15\x5c\2\x74\12\x5c\2\0\21\x5c\3\0\11\x5c\2\x72\16\x5c\2\0\21\x5c\3\0\14\x5c\2\x70\13\x5c\2\0\21\x5c\3\0\13\x5c\2\x6f\14\x5c\2\0\21\x5c\3\0\6\x5c\2\x6d\21\x5c\2\0\21\x5c\3\0\2\x5c\2\x6c\25\x5c\2\0\21\x5c\3\0\6\x5c\2\x6b\21\x5c\2\0\21\x5c\3\0\6\x5c\2\x6a\21\x5c\2\0\21\x5c\3\0\2\x5c\2\x69\25\x5c\2\0\21\x5c\3\0\2\x5c\2\x68\25\x5c\2\0\21\x5c\3\0\11\x5c\2\x65\16\x5c\2\0\21\x5c\3\0\2\x5c\2\x64\25\x5c\2\0\21\x5c\3\0\27\x5c\2\0\4\x5c\2\x62\15\x5c\3\0\27\x5c\2\0\2\x5c\2\x61\17\x5c\3\0\27\x5c\2\0\11\x5c\2\x67\10\x5c\3\0\2\x5f\26\x5c\2\0\21\x5c\3\0\27\x5c\2\0\14\x5c\2\x67\5\x5c\3\0\27\x5c\2\0\16\x5c\2\x7f\3\x5c\3\0\3\x5c\2\x5b\24\x5c\2\0\21\x5c\3\0\11\x5c\2\x59\16\x5c\2\0\21\x5c\3\0\27\x5c\2\0\10\x5c\2\x58\3\x5c\2\x5a\2\x5c\2\x67\4\x5c\3\0\4\x5c\2\x57\23\x5c\2\0\21\x5c\3\0\27\x5c\2\0\3\x5c\2\x56\16\x5c\3\0\27\x5c\2\0\5\x5c\2\55\14\x5c\3\0\2\x55\26\x5c\2\0\21\x5c\3\0\13\x5c\2\x54\14\x5c\2\0\21\x5c\3\0\27\x5c\2\0\2\x5c\2\55\17\x5c\3\0\20\x5c\2\x94\7\x5c\2\0\21\x5c\3\0\23\x5c\2\x53\4\x5c\2\0\21\x5c\3\0\2\x5c\2\x51\25\x5c\2\0\21\x5c\3\0\2\x5c\2\x50\25\x5c\2\0\21\x5c\3\0\24\x5c\2\55\3\x5c\2\0\21\x5c\3\0\24\x5c\2\54\3\x5c\2\0\21\x5c\3\0\4\x5c\2\x4e\23\x5c\2\0\21\x5c\3\0\21\x5c\2\60\6\x5c\2\0\21\x5c\3\0\16\x5c\2\x4d\11\x5c\2\0\21\x5c\3\0\2\x4c\26\x5c\2\0\21\x5c\3\0\17\x5c\2\60\10\x5c\2\0\21\x5c\3\0\13\x5c\2\x4b\4\x5c\2\x7c\10\x5c\2\0\21\x5c\3\0\12\x5c\2\x4a\15\x5c\2\0\21\x5c\3\0\16\x5c\2\60\11\x5c\2\0\21\x5c\3\0\16\x5c\2\55\11\x5c\2\0\21\x5c\3\0\14\x5c\2\x48\13\x5c\2\0\21\x5c\3\0\13\x5c\2\x47\14\x5c\2\0\21\x5c\3\0\15\x5c\2\57\12\x5c\2\0\21\x5c\3\0\11\x5c\2\x46\16\x5c\2\0\21\x5c\3\0\4\x5c\2\x44\23\x5c\2\0\21\x5c\3\0\2\x43\26\x5c\2\0\21\x5c\3\0\13\x5c\2\x41\14\x5c\2\0\21\x5c\3\0\13\x5c\2\71\14\x5c\2\0\21\x5c\3\0\4\x5c\2\x40\23\x5c\2\0\21\x5c\3\0\4\x5c\2\77\23\x5c\2\0\21\x5c\3\0\4\x5c\2\75\23\x5c\2\0\21\x5c\3\0\3\x5c\2\76\24\x5c\2\0\21\x5c\3\0\11\x5c\2\64\16\x5c\2\0\21\x5c\3\0\11\x5c\2\60\16\x5c\2\0\21\x5c\3\0\3\x5c\2\x49\3\x5c\2\74\7\x5c\2\x90\12\x5c\2\0\21\x5c\3\0\7\x5c\2\73\13\x5c\2\x7f\5\x5c\2\0\21\x5c\3\0\6\x5c\2\73\7\x5c\2\x45\12\x5c\2\0\21\x5c\3\0\10\x5c\2\61\17\x5c\2\0\21\x5c\3\0\10\x5c\2\56\17\x5c\2\0\21\x5c\3\0\7\x5c\2\70\20\x5c\2\0\21\x5c\3\0\6\x5c\2\63\21\x5c\2\0\21\x5c\3\0\3\x5c\2\66\24\x5c\2\0\21\x5c\3\0\5\x5c\2\62\22\x5c\2\0\21\x5c\3\0\5\x5c\2\60\4\x5c\2\60\16\x5c\2\0\21\x5c\3\0\3\x5c\2\61\24\x5c\2\0\21\x5c\3\0\4\x5c\2\60\23\x5c\2\0\21\x5c\3\0\4\x5c\2\55\23\x5c\2\0\21\x5c\3\0\2\x5c\2\60\25\x5c\2\0\21\x5c\3\0\2\x5c\2\55\25\x5c\2\0\21\x5c\3\0\2\55\26\x5c\2\0\20\x5c\61\x99\2\46\5\x99\2\x9a\52\x99\2\x95\11\x99\2\46\5\x99\2\x9a\20\x99\2\x96\32\x99\2\x95\11\x99\2\46\5\x99\2\x9a\20\x99\2\x96\16\x99\2\x97\14\x99\2\x95\11\x99\2\46\5\x99\2\x9a\63\x99\2\x98\5\x99\2\x9a\3\x99\71\x9b\61\x99\2\25\2\4\10\x99\2\10\2\52\2\50\2\53\2\65\2\x7e\2\x78\2\x84\2\x83\3\x5c\2\x6e\2\72\2\x77\2\x8c\2\x85\2\x5c\2\x71\2\x5c\2\x4f\2\x5c\2\67\2\x52\2\x5c\2\x89\2\x66\2\10\2\x60\5\x5c\2\x63\2\x5e\3\52\2\x5c\4\52\3\x5c\2\27\2\44\2\31\2\45\2\32\2\33\2\7\2\x9c\4\7\3\10\2\6\2\5\61\13\2\37\11\13\61\15\2\40\11\15\2\20\66\17\2\41\2\20\2\17\2\23\66\22\2\42\2\22\2\23", "\1\2\4\2\15\2\20\2\7\2\25\2\21\2\6\2\31\2\10\2\13\2\14\2\16\2\17\2\23\2\22\2\24\2\27\2\26\2\30\2\20\2\12\7\6\4\0\2\14\2\17\2\22\2\26\2\20\3\31\2\20\2\1\2\31\2\0\2\1\2\6\3\4\2\3\3\2\x63\5\2\1\2\5\5\20\3\0\2\11\2\6\2\0\2\11\5\0", "\1\13\66\2\1\27\66\2\63\2\70\2\66\2\52\2\65\2\57\2\71\3\66\2\61\2\55\2\66\2\4\2\3\2\62\2\2\2\46\2\44\2\43\3\2\2\47\2\2\2\50\2\2\3\66\2\56\2\53\2\54\3\66\2\27\2\45\2\52\2\31\2\36\4\52\2\42\6\52\2\32\3\52\2\34\2\41\10\52\2\66\2\67\2\66\2\64\2\52\2\66\2\12\2\24\2\20\2\16\2\10\2\11\2\35\2\23\2\17\2\33\2\25\2\13\2\51\2\15\2\21\2\40\2\52\2\6\2\14\2\5\2\7\2\26\2\22\2\37\2\30\2\52\2\66\2\60\x84\66"], [this.TABLE._base, this.TABLE._default, this.TABLE._check, this.TABLE._next, this.TABLE._action, this.TABLE._eqc]);

		}
		L.javascript.prototype = {

			read_ch : function() {
				if(this.idx >= this.end)
					return this.chr = -1;
				else {

					return this.chr = this.src[this.idx++].charCodeAt(0);
					/*
					 this.chr = this.src[this.idx++].charCodeAt(0);
					 if(this.chr>=65&&this.chr<=90)
					 this.chr += 32;
					 return this.chr;
					 */
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

						case 3:
							this.yystyle = "object";
							break;
						case 2:
							this.yystyle = "param";
							break;
						case 12:
							this.yystyle = "doccomment";
							this.yydefault = "doccomment";
							this.yygoto(DOC_COMMENT);
							break;
						case 15:
							this.yystyle = "regexp";
							break;
						case 6:
							this.yystyle = "comment";
							this.yydefault = "comment";
							this.yygoto(LINE_COMMENT);
							break;
						case 9:
							this.yystyle = "comment";
							this.yydefault = "comment";
							this.yygoto(BLOCK_COMMENT);
							break;
						case 1:
							this.yystyle = "keyword";
							break;
						case 20:
							this.yystyle = "string";
							this.yydefault = "string";
							this.yygoto(STRING_B);
							break;
						case 16:
							this.yystyle = "string";
							this.yydefault = "string";
							this.yygoto(STRING_A);
							break;
						case 4:
							this.yystyle = "id";
							break;
						case 5:
							this.yystyle = "operator";
							break;
						case 0:
							this.yystyle = "value";
							break;
						case 24:
							this.yystyle = "default";
							break;
						case 7:
							this.yystyle = "comment";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 8:
							this.yystyle = "comment";
							break;
						case 10:
							this.yystyle = "comment";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 11:
							this.yystyle = "comment";
							break;
						case 13:
							this.yystyle = "doccomment";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 14:
							this.yystyle = "doccomment";
							break;
						case 18:
							this.yystyle = "string";
							break;
						case 17:
							this.yystyle = "string";
							break;
						case 19:
							this.yystyle = "string";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 22:
							this.yystyle = "string";
							break;
						case 21:
							this.yystyle = "string";
							break;
						case 23:
							this.yystyle = "string";
							this.yydefault = "default";
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
})(Daisy, Daisy.$);
