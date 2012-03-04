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
