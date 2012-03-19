$(function() {
	d_editor = new Daisy._Editor({
		width : 700,
		height : 500,
		theme : 'notepadplusplus'
	});
	$.get("readme.txt", function(data) {
		d_editor.appendText(data);
	})
});
function open_jquery() {
	$('#btn_jq').attr("disabled", true).val("正在从网络加载...");
	$.get("j-1.5.1.txt", function(data) {
		cur_doc = d_editor.createDocument({
			language : 'javascript'
		});
		d_editor.setActiveDocument(cur_doc);
		d_editor.appendText(data);
		doc_len++;
		$('#btn_jq').val("打开jQuery源码");
		$('#btn_sw').attr("disabled", false);
	})
}

function insert_text() {
	var str = (cur_doc === 0 ? "\n/**\n * Hello Daisy.\n * Hello World\n **/\n" : "\n''' Hello Daisy\n''' Hello World\n");
	d_editor.insertText(str);
	d_editor.focus();
}

var cur_doc = 0, doc_len = 1;
function new_vb_doc() {
	cur_doc = d_editor.createDocument({
		language : 'visualbasic'
	});
	d_editor.setActiveDocument(cur_doc);
	d_editor.appendText("'这是一个visual basic代码的例子\n'To Daisy, To Love.\nPublic Sub Main()\n\tFor i As Integer = 0 To 100000 Step 1\n\t\tConsole.WriteLine(\"Hello Daisy\")\n\tEnd If\nEnd Sub");
	doc_len++;
	$('#btn_new').attr("disabled", true);
	$('#btn_sw').attr("disabled", false);
}

function switch_doc() {
	cur_doc = (cur_doc + 1) % doc_len;
	d_editor.setActiveDocument(cur_doc);
}