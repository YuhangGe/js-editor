(function() {
	
	var fs = require("fs"),
		jsp = require("./lib/uglify-js").parser,
		pro = require("./lib/uglify-js").uglify;
	
	var log = function(msg){
		console.log(msg);
	}
	
	var get_js_file = function(name){
		var fc = fs.readFileSync(name,'utf8'), c_len = fc.length - 1,
		    fcl = fc.split("\n"),l_len = fcl.length,
		    start_line = 0,end_line = l_len-1,
		    start_idx = fcl[0].length + 1,
		    end_idx = c_len - fcl[end_line].length - 1;
		while(fcl[start_line].trim()==="" && start_line<l_len){
			start_line++;
			start_idx += fcl[start_line].length+1;
		}
		while(fcl[end_line].trim()==="" && end_line>0){
			end_line--;
			end_idx -= fcl[end_line].length+1;
		}
		
		return fc.substring(start_idx,end_idx)+"\n\n";
	}
	
	var js_file_list = {
		rely_file : 'daisy',
		core_files : ['editor','utility','document','render','event','lexer','clipboard'],
		lexer_files : ['visualbasic','javascript'],
		theme_files : ['aptana3','notepadplusplus']
	}
	
	var orig_code = fs.readFileSync("./src/"+js_file_list.rely_file+".js",'utf8');
	orig_code+="\n(function(Daisy,$){\n";
	for(var i=0;i<js_file_list.core_files.length;i++){
		orig_code += get_js_file("./src/core/"+js_file_list.core_files[i]+".js");
	}
	orig_code += "\n;\n"
	for(var i=0;i<js_file_list.lexer_files.length;i++){
		orig_code += get_js_file("./src/lexer/"+js_file_list.lexer_files[i]+".js");
	}
	orig_code += "\n;\n"
	for(var i=0;i<js_file_list.theme_files.length;i++){
		orig_code += get_js_file("./src/theme/"+js_file_list.theme_files[i]+".js");
	}
	orig_code += "\n})(Daisy,Daisy.$);";
	
	fs.writeFileSync("daisy-editor.js",orig_code,"utf8");
	// parse code and get the initial AST
	var ast = jsp.parse(orig_code);
	// get a new AST with mangled names
	ast = pro.ast_mangle(ast);
	// get an AST with compression optimizations
	ast = pro.ast_squeeze(ast);
	// compressed code here
	var final_code = pro.gen_code(ast);

	fs.writeFileSync("daisy-editor.min.js",final_code,"utf8");

})();
