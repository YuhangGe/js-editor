if( typeof Daisy === 'undefined')
	Daisy = {};
if( typeof Daisy.Lexer === 'undefined')
	Daisy.Lexer = {};
	
(function(D, L) {
	var DEFAULT = 131, BLOCK_COMMENT = 132, STRING_A = 133, STRING_B = 134;
	
	L.JS = function(editor) {
		this.editor = editor;
		this.src = null;
		this.theme = editor.theme;
		this.end = 0;
		this.idx = 0;
		this.chr = -1;
		this.i_s = 131;
		this.TABLE = {
			_base : new Int32Array(135),
			_default : new Int32Array(135),
			_check : new Int32Array(4981),
			_next : new Int32Array(4981),
			_action : new Int32Array(135),
			_eqc : new Int32Array(256)
		};

		L.Help._str_to_arr(["\0\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\2\2\2\1\1\1\1\1\1\1\1\6\6\1\1\1\31\1\77\x71\1\xa3\xd5\u0107\u0139\u016b\u019d\u01cf\u0201\u0233\u0265\u0297\u02c9\u02fb\u032d\u035f\u0391\u03c3\u03f5\u0427\u0459\u048b\u04bd\u04ef\u0521\u0553\u0585\u05b7\u05e9\u061b\u064d\u067f\u06b1\u06e3\u0715\u0747\u0779\u07ab\u07dd\u080f\1\u0841\u0873\u08a5\u08d7\u0909\u093b\u096d\u099f\u09d1\u0a03\u0a35\u0a67\u0a99\u0acb\u0afd\u0b2f\u0b61\u0b93\u0bc5\u0bf7\u0c29\u0c5b\u0c8d\u0cbf\u0cf1\u0d23\u0d55\u0d87\u0db9\u0deb\u0e1d\u0e4f\u0e81\u0eb3\u0ee5\u0f17\u0f49\u0f7b\u0fad\u0fdf\u1011\u1043\u1075\u10a7\u10d9\u110b\1\3\u1140\u1178\u11b0\u11e8\1\u1220\u1259\u1292\u12cb\u1304\u133d", "\1\33\0\3\17\2\0\3\35\2\0\2\40\3\0\2\43\50\0\2\43\57\0\3\43\5\0\2\x7d\7\0", "\1\2\0\2\35\2\0\2\41\2\25\3\0\2\26\11\0\2\27\11\0\3\40\2\x7c\6\0\3\35\2\0\4\35\2\0\2\17\2\20\2\21\2\22\2\23\2\24\2\33\2\30\2\34\6\0\2\31\2\0\2\32\3\40\2\0\4\40\2\42\3\0\26\42\2\0\17\42\14\0\2\43\2\0\2\42\26\43\2\0\17\43\14\0\2\45\2\0\2\43\26\45\2\0\17\45\14\0\2\46\2\0\2\45\26\46\2\0\17\46\14\0\2\47\2\0\2\46\26\47\2\0\17\47\14\0\2\50\2\0\2\47\26\50\2\0\17\50\14\0\2\51\2\0\2\50\26\51\2\0\17\51\14\0\2\52\2\0\2\51\26\52\2\0\17\52\14\0\2\53\2\0\2\52\26\53\2\0\17\53\14\0\2\54\2\0\2\53\26\54\2\0\17\54\14\0\2\55\2\0\2\54\26\55\2\0\17\55\14\0\2\56\2\0\2\55\26\56\2\0\17\56\14\0\2\57\2\0\2\56\26\57\2\0\17\57\14\0\2\60\2\0\2\57\26\60\2\0\17\60\14\0\2\61\2\0\2\60\26\61\2\0\17\61\14\0\2\62\2\0\2\61\26\62\2\0\17\62\14\0\2\63\2\0\2\62\26\63\2\0\17\63\14\0\2\64\2\0\2\63\26\64\2\0\17\64\14\0\2\65\2\0\2\64\26\65\2\0\17\65\14\0\2\66\2\0\2\65\26\66\2\0\17\66\14\0\2\67\2\0\2\66\26\67\2\0\17\67\14\0\2\70\2\0\2\67\26\70\2\0\17\70\14\0\2\71\2\0\2\70\26\71\2\0\17\71\14\0\2\72\2\0\2\71\26\72\2\0\17\72\14\0\2\73\2\0\2\72\26\73\2\0\17\73\14\0\2\74\2\0\2\73\26\74\2\0\17\74\14\0\2\75\2\0\2\74\26\75\2\0\17\75\14\0\2\76\2\0\2\75\26\76\2\0\17\76\14\0\2\77\2\0\2\76\26\77\2\0\17\77\14\0\2\x40\2\0\2\77\26\x40\2\0\17\x40\14\0\2\x41\2\0\2\x40\26\x41\2\0\17\x41\14\0\2\x42\2\0\2\x41\26\x42\2\0\17\x42\14\0\2\x43\2\0\2\x42\26\x43\2\0\17\x43\14\0\2\x44\2\0\2\x43\26\x44\2\0\17\x44\14\0\2\x45\2\0\2\x44\26\x45\2\0\17\x45\14\0\2\x46\2\0\2\x45\26\x46\2\0\17\x46\14\0\2\x47\2\0\2\x46\26\x47\2\0\17\x47\14\0\2\x48\2\0\2\x47\26\x48\2\0\17\x48\14\0\2\x49\2\0\2\x48\26\x49\2\0\17\x49\14\0\2\x4a\2\0\2\x49\26\x4a\2\0\17\x4a\14\0\2\x4b\2\0\2\x4a\26\x4b\2\0\17\x4b\14\0\2\x4d\2\0\2\x4b\26\x4d\2\0\17\x4d\14\0\2\x4e\2\0\2\x4d\26\x4e\2\0\17\x4e\14\0\2\x4f\2\0\2\x4e\26\x4f\2\0\17\x4f\14\0\2\x50\2\0\2\x4f\26\x50\2\0\17\x50\14\0\2\x51\2\0\2\x50\26\x51\2\0\17\x51\14\0\2\x52\2\0\2\x51\26\x52\2\0\17\x52\14\0\2\x53\2\0\2\x52\26\x53\2\0\17\x53\14\0\2\x54\2\0\2\x53\26\x54\2\0\17\x54\14\0\2\x55\2\0\2\x54\26\x55\2\0\17\x55\14\0\2\x56\2\0\2\x55\26\x56\2\0\17\x56\14\0\2\x57\2\0\2\x56\26\x57\2\0\17\x57\14\0\2\x58\2\0\2\x57\26\x58\2\0\17\x58\14\0\2\x59\2\0\2\x58\26\x59\2\0\17\x59\14\0\2\x5a\2\0\2\x59\26\x5a\2\0\17\x5a\14\0\2\x5b\2\0\2\x5a\26\x5b\2\0\17\x5b\14\0\2\x5c\2\0\2\x5b\26\x5c\2\0\17\x5c\14\0\2\x5d\2\0\2\x5c\26\x5d\2\0\17\x5d\14\0\2\x5e\2\0\2\x5d\26\x5e\2\0\17\x5e\14\0\2\x5f\2\0\2\x5e\26\x5f\2\0\17\x5f\14\0\2\x60\2\0\2\x5f\26\x60\2\0\17\x60\14\0\2\x61\2\0\2\x60\26\x61\2\0\17\x61\14\0\2\x62\2\0\2\x61\26\x62\2\0\17\x62\14\0\2\x63\2\0\2\x62\26\x63\2\0\17\x63\14\0\2\x64\2\0\2\x63\26\x64\2\0\17\x64\14\0\2\x65\2\0\2\x64\26\x65\2\0\17\x65\14\0\2\x66\2\0\2\x65\26\x66\2\0\17\x66\14\0\2\x67\2\0\2\x66\26\x67\2\0\17\x67\14\0\2\x68\2\0\2\x67\26\x68\2\0\17\x68\14\0\2\x69\2\0\2\x68\26\x69\2\0\17\x69\14\0\2\x6a\2\0\2\x69\26\x6a\2\0\17\x6a\14\0\2\x6b\2\0\2\x6a\26\x6b\2\0\17\x6b\14\0\2\x6c\2\0\2\x6b\26\x6c\2\0\17\x6c\14\0\2\x6d\2\0\2\x6c\26\x6d\2\0\17\x6d\14\0\2\x6e\2\0\2\x6d\26\x6e\2\0\17\x6e\14\0\2\x6f\2\0\2\x6e\26\x6f\2\0\17\x6f\14\0\2\x70\2\0\2\x6f\26\x70\2\0\17\x70\14\0\2\x71\2\0\2\x70\26\x71\2\0\17\x71\14\0\2\x72\2\0\2\x71\26\x72\2\0\17\x72\14\0\2\x73\2\0\2\x72\26\x73\2\0\17\x73\14\0\2\x74\2\0\2\x73\26\x74\2\0\17\x74\14\0\2\x75\2\0\2\x74\26\x75\2\0\17\x75\14\0\2\x76\2\0\2\x75\26\x76\2\0\17\x76\14\0\2\x77\2\0\2\x76\26\x77\2\0\17\x77\14\0\2\x78\2\0\2\x77\26\x78\2\0\17\x78\14\0\2\x79\2\0\2\x78\26\x79\2\0\17\x79\14\0\2\x7a\2\0\2\x79\26\x7a\2\0\17\x7a\16\0\2\x7a\63\x7d\2\0\6\x7d\63\x7e\2\0\6\x7e\63\x7f\2\0\6\x7f\63\x80\2\0\6\x80\71\x82\72\x83\72\x84\72\x85\72\x86\72\x87","\1\2\0\2\35\2\0\2\5\2\1\3\0\2\27\11\0\2\25\11\0\2\40\2\37\2\26\6\0\3\35\2\0\4\35\2\0\2\5\2\17\5\5\2\21\2\7\2\5\6\0\2\11\2\0\2\14\3\40\2\0\4\40\2\x4c\3\0\26\x4c\2\0\12\x4c\2\x74\5\x4c\14\0\2\x4c\2\0\27\x4c\2\0\17\x4c\14\0\2\x4c\2\0\5\x4c\2\x7b\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\5\x4c\2\x7a\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\4\x4c\2\x78\23\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x77\12\x4c\2\64\12\x4c\2\0\17\x4c\14\0\2\x4c\2\0\6\x4c\2\x75\21\x4c\2\0\17\x4c\14\0\2\x4c\2\0\7\x4c\2\x79\20\x4c\2\0\17\x4c\14\0\2\x4c\2\0\10\x4c\2\x7b\17\x4c\2\0\17\x4c\14\0\2\x4c\2\0\10\x4c\2\x78\17\x4c\2\0\17\x4c\14\0\2\x4c\2\0\4\x4c\2\x73\2\x5e\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\11\x4c\2\x78\16\x4c\2\0\17\x4c\14\0\2\x4c\2\0\10\x4c\2\x71\17\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x6d\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\2\x4c\2\x6b\25\x4c\2\0\17\x4c\14\0\2\x4c\2\0\13\x4c\2\x7b\14\x4c\2\0\17\x4c\14\0\2\x4c\2\0\12\x4c\2\x69\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\14\x4c\2\x72\13\x4c\2\0\17\x4c\14\0\2\x4c\2\0\14\x4c\2\x6c\13\x4c\2\0\17\x4c\14\0\2\x4c\2\0\6\x4c\2\x67\21\x4c\2\0\17\x4c\14\0\2\x4c\2\0\12\x4c\2\x66\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\13\x4c\2\x65\14\x4c\2\0\17\x4c\14\0\2\x4c\2\0\15\x4c\2\x68\12\x4c\2\0\17\x4c\14\0\2\x4c\2\0\16\x4c\2\x63\11\x4c\2\0\17\x4c\14\0\2\x4c\2\0\14\x4c\2\x62\13\x4c\2\0\17\x4c\14\0\2\x4c\2\0\17\x4c\2\x6d\10\x4c\2\0\17\x4c\14\0\2\x4c\2\0\2\x4c\2\x60\25\x4c\2\0\17\x4c\14\0\2\x4c\2\0\12\x4c\2\x5f\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\7\x4c\2\x5c\20\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x5b\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\7\x4c\2\x5a\20\x4c\2\0\17\x4c\14\0\2\x4c\2\0\7\x4c\2\x59\20\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x58\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x57\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\12\x4c\2\x54\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x53\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\27\x4c\2\0\4\x4c\2\x51\13\x4c\14\0\2\x4c\2\0\27\x4c\2\0\2\x4c\2\x50\15\x4c\14\0\2\x4c\2\0\27\x4c\2\0\11\x4c\2\x56\6\x4c\14\0\2\x4c\2\0\2\x4c\2\x4e\25\x4c\2\0\17\x4c\14\0\2\x4c\2\0\27\x4c\2\0\14\x4c\2\x56\3\x4c\14\0\2\x4c\2\0\12\x4c\2\x4a\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\27\x4c\2\0\10\x4c\2\x49\3\x4c\2\x4b\2\x4c\2\x56\2\x4c\14\0\2\x4c\2\0\5\x4c\2\x48\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\27\x4c\2\0\3\x4c\2\x47\14\x4c\14\0\2\x4c\2\0\27\x4c\2\0\5\x4c\2\43\12\x4c\14\0\2\x4c\2\0\2\x4c\2\x46\25\x4c\2\0\17\x4c\14\0\2\x4c\2\0\14\x4c\2\x45\13\x4c\2\0\17\x4c\14\0\2\x4c\2\0\27\x4c\2\0\2\x4c\2\43\15\x4c\14\0\2\x4c\2\0\21\x4c\2\x7c\6\x4c\2\0\17\x4c\14\0\2\x4c\2\0\24\x4c\2\x44\3\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x42\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\x41\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\25\x4c\2\43\2\x4c\2\0\17\x4c\14\0\2\x4c\2\0\25\x4c\2\42\2\x4c\2\0\17\x4c\14\0\2\x4c\2\0\5\x4c\2\77\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\22\x4c\2\44\5\x4c\2\0\17\x4c\14\0\2\x4c\2\0\20\x4c\2\73\7\x4c\2\0\17\x4c\14\0\2\x4c\2\0\20\x4c\2\44\7\x4c\2\0\17\x4c\14\0\2\x4c\2\0\16\x4c\2\75\11\x4c\2\0\17\x4c\14\0\2\x4c\2\0\14\x4c\2\74\13\x4c\2\0\17\x4c\14\0\2\x4c\2\0\17\x4c\2\44\10\x4c\2\0\17\x4c\14\0\2\x4c\2\0\2\x4c\2\72\25\x4c\2\0\17\x4c\14\0\2\x4c\2\0\15\x4c\2\44\12\x4c\2\0\17\x4c\14\0\2\x4c\2\0\12\x4c\2\70\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\5\x4c\2\66\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\2\x4c\2\65\25\x4c\2\0\17\x4c\14\0\2\x4c\2\0\14\x4c\2\63\13\x4c\2\0\17\x4c\14\0\2\x4c\2\0\14\x4c\2\54\13\x4c\2\0\17\x4c\14\0\2\x4c\2\0\5\x4c\2\62\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\5\x4c\2\61\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\4\x4c\2\60\23\x4c\2\0\17\x4c\14\0\2\x4c\2\0\12\x4c\2\47\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\12\x4c\2\44\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\4\x4c\2\76\3\x4c\2\57\10\x4c\2\x79\10\x4c\2\0\17\x4c\14\0\2\x4c\2\0\10\x4c\2\56\17\x4c\2\0\17\x4c\14\0\2\x4c\2\0\7\x4c\2\56\10\x4c\2\67\10\x4c\2\0\17\x4c\14\0\2\x4c\2\0\11\x4c\2\45\16\x4c\2\0\17\x4c\14\0\2\x4c\2\0\11\x4c\2\44\16\x4c\2\0\17\x4c\14\0\2\x4c\2\0\10\x4c\2\53\17\x4c\2\0\17\x4c\14\0\2\x4c\2\0\4\x4c\2\51\23\x4c\2\0\17\x4c\14\0\2\x4c\2\0\6\x4c\2\46\21\x4c\2\0\17\x4c\14\0\2\x4c\2\0\6\x4c\2\44\4\x4c\2\44\15\x4c\2\0\17\x4c\14\0\2\x4c\2\0\4\x4c\2\45\23\x4c\2\0\17\x4c\14\0\2\x4c\2\0\5\x4c\2\44\22\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\44\24\x4c\2\0\17\x4c\14\0\2\x4c\2\0\3\x4c\2\43\24\x4c\2\0\17\x4c\16\0\2\x4c\57\x81\2\x80\4\x81\2\0\64\x81\2\x80\4\x81\2\0\2\x81\2\x7d\21\x81\2\x7e\41\x81\2\x80\4\x81\2\0\2\x81\2\x7d\21\x81\2\x7e\15\x81\2\x7f\24\x81\2\x80\4\x81\2\0\2\x81\2\x7d\4\x81\71\x82\57\x81\2\2\2\x82\12\x81\2\6\2\40\2\36\2\41\2\50\2\x6a\2\x64\2\x6f\2\x6e\3\x4c\2\x5d\2\55\2\x61\2\x76\2\x4c\2\x70\2\x4c\2\71\2\x40\2\x4c\2\52\2\x43\2\x4c\2\x55\2\6\2\x4f\5\x4c\2\x52\2\x4d\3\40\2\x4c\4\40\2\x4c\2\20\2\33\2\22\2\34\2\23\2\24\2\5\2\x83\4\5\3\6\2\x4c\2\4\2\6\2\3\57\10\2\30\13\10\2\13\66\12\2\13\2\31\2\12\2\16\67\15\2\32\2\16", "\1\2\3\2\7\2\17\2\13\2\5\2\23\2\10\2\11\2\15\2\14\2\16\2\21\2\20\2\22\7\5\4\0\2\11\2\14\2\20\3\23\2\1\2\23\2\0\2\1\2\5\3\3\2\2\x57\4\2\1\2\4\5\12\2\0\2\6\2\5\5\0", "\1\12\65\2\64\2\1\4\64\23\65\2\64\2\61\2\67\2\65\2\50\2\63\2\55\2\71\3\65\2\57\2\53\2\65\2\4\2\3\2\60\2\2\2\45\2\43\2\42\3\2\2\46\2\2\2\47\2\2\3\65\2\54\2\51\2\52\3\65\2\27\2\44\3\50\2\35\4\50\2\41\6\50\2\31\3\50\2\33\2\40\10\50\2\65\2\70\2\65\2\62\2\50\2\65\2\12\2\24\2\21\2\16\2\10\2\11\2\34\2\20\2\17\2\32\2\25\2\13\2\66\2\15\2\22\2\37\2\50\2\6\2\14\2\5\2\7\2\26\2\23\2\36\2\30\2\50\2\65\2\56\x84\65"], [this.TABLE._base, this.TABLE._default, this.TABLE._check, this.TABLE._next, this.TABLE._action, this.TABLE._eqc]);

	}

	L.JS.prototype = {
	
		read_ch : function() {
			if(this.idx >= this.end) {
				return this.chr = -1;
			} else
				return this.chr = this.src[this.idx++].charCodeAt(0);
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
	
				var yystyle = "default";
				switch(action) {
					

					case 2:
yystyle="object";
break;
case 9:
yystyle="regexp";
break;
case 5:
yystyle="comment";
break;
case 6:
yystyle="comment";this.yygoto(BLOCK_COMMENT);
break;
case 1:
yystyle="keyword";
break;
case 14:
yystyle="string";this.yygoto(STRING_B);
break;
case 10:
yystyle="string";this.yygoto(STRING_A);
break;
case 3:
yystyle="id";
break;
case 4:
yystyle="operator";
break;
case 0:
yystyle="value";
break;
case 18:
yystyle="default";
break;
case 7:
yystyle="comment";this.yygoto(DEFAULT);
break;
case 8:
yystyle="comment";
break;
case 12:
yystyle="string";
break;
case 11:
yystyle="string";
break;
case 13:
yystyle="string";this.yygoto(DEFAULT);
break;
case 16:
yystyle="string";
break;
case 15:
yystyle="string";
break;
case 17:
yystyle="string";this.yygoto(DEFAULT);
break;

					
					case L.ACT_TYPE.UNKNOW_CHAR:
					case L.ACT_TYPE.UNMATCH_CHAR:
					default :
						yystyle = "default";
						break;
				}
				this.editor.doc.setRangeStyle(pre_idx,yylen,yystyle);
			}
			
		},
		yygoto: function(state){
			this.i_s = state;
		},
		lex : function() {
			this.src = this.editor.doc.text_array;
			this.end = this.src.length;
			this.i_s = 131;
			this.do_lex();
		}
	}

})(Daisy, Daisy.Lexer);

