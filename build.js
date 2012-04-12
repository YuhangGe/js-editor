(function() {
	var fs = require("fs"),
		jsp = require("./lib/uglify-js").parser,
		pro = require("./lib/uglify-js").uglify,
		cssmin = require("./lib/css-compressor").cssmin;
	
	var log = function(msg){
		console.log(msg);
	}
	
	var orig_code = "var a = 3+6;";
	// parse code and get the initial AST
	var ast = jsp.parse(orig_code);
	// get a new AST with mangled names
	ast = pro.ast_mangle(ast);
	// get an AST with compression optimizations
	ast = pro.ast_squeeze(ast);
	// compressed code here
	var final_code = pro.gen_code(ast);

	console.log(final_code);

})();
