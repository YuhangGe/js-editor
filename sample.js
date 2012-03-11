$(function(){
	d_editor = new Daisy._Editor({
		width: 700,
		height: 500,
		lexer : Daisy.Lexer.JS,
		theme : Daisy.Theme.Daisy
	});
	d_editor._moveCaret_lc(0,-1);
	d_editor.focus();
	$.get("readme.txt",function(data){
		 d_editor.appendText(data);
	})
});

function append_jquery(btn){
	$(btn).attr("disabled",true).val("正在从网络加载...");
	 $.get("j-1.5.1.txt",function(data){
		 d_editor.appendText(data);
		 $(btn).attr("disabled",false).val("append jQuery源码");
	 })
}
function insert_text(){
	d_editor.insertText("/*\n * Hello Daisy.\n * I love you!\n */\n");
	d_editor.focus();
}
