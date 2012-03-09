$(function(){
	d_editor = new Daisy._Editor({
		width: 700,
		height: 500,
		lexer : Daisy.Lexer.JS,
		theme : Daisy.Theme.Daisy
	});
	
	$.get("readme.txt",function(data){
		 d_editor.appendText(data);
	})
});

function load_jquery(){
	 $.get("j-1.5.1.txt",function(data){
		 d_editor.appendText(data);
	 })
}
