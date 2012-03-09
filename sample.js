$(function(){
	d_editor = new Daisy._Editor({
		width: 700,
		height: 500,
		lexer : Daisy.Lexer.JS,
		theme : Daisy.Theme.Daisy
	});
	
	$.ajax("https://raw.github.com/YuhangGe/daisy-editor/master/readme.txt",function(data){
		 d_editor.appendText(data);
	},"text")
});

function load_jquery(){
	 $.get("https://raw.github.com/YuhangGe/daisy-editor/master/j-1.5.1.txt",function(data){
		 d_editor.appendText(data);
	 })
}
