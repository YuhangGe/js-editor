$(function(){
	d_editor = new Daisy._Editor({
		width: 400,
		height: 300,
		theme : 'notepadplusplus'
	});
	
	var str=$('#test').val();
	//var s2 ="123456789abcdefgh\n123456789abcdefghigklm\n";//"1234456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ";
	//s2+=s2+s2+s2;
	//for(var i=2;i<8;i++)
		//s2 += ("\n"+i);
	
	//d_editor.appendText(s2);
	//do_test();
	//d_editor.appendText("\n// 我爱\t小扬 a\t\taaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\n\n\n123\n");
	d_editor.appendText("/** 我爱小扬~ */\n");
	d_editor.appendText("\n\n\n\n\n/abcdrrrgdsdsdsdsdddsrrrrrrrrrrrrrrrefgh/\n\\abcdefgh\\\n\n\n//hello world\n\n\nfunction(a)\n{\nalert(\"hello\");\nvar t = new Array(10,1.23),q=/djsjooiiiiksldl/, k = new Int32Array(100), o = [\"jdlsjdlsdjl\",'I love Dasiy.', 'hello, nanjing university'];// test test\n/*\n test\ntest\n */}\n\n\n\n\n\n\n var a=1234");
	//$.log(d_editor.doc.line_info);
	//for(var i=0;i<10;i++)
		//d_editor.appendString(str+str+str);
	//d_editor.appendString("abc 123\ngood 12 + 45\n\naaaa")
});
function deal_input(txt){
	$.log(txt.value);

	//txt.value="";
}
var cur_doc = 0, doc_len = 1;
function c_doc(){
	cur_doc = d_editor.createDocument({
		language : 'visualbasic'
	});
	d_editor.setActiveDocument(cur_doc);
	d_editor.appendText("I Love Daisy!\n");
	doc_len++;
}
function s_doc(){
	cur_doc=(cur_doc+1) % doc_len;
	d_editor.setActiveDocument(cur_doc);
}
function do_test(){
	//d_editor.resize({width:600,height:380});
	 $.get("j-1.5.1.txt",function(data){
		 //$.log(data.length);	
		 var f_t = new Date().getTime();
		 d_editor.appendText(data);
		 $.log("append time:"+(new Date().getTime()-f_t));
	 })
	 
	//d_editor.render.scrollTop(380);
	//d_editor.setFontName("楷体");
	//d_editor.appendString("0123\n0123\n\n0123")
}
function insert(){
	d_editor.insertText("123\n456\nvar a = 10.99;\n");
	d_editor.focus();
}
$.$ = function(id){
	return document.getElementById(id);
}

$.log = function(msg){
	if(console)
		console.log(msg);
}

$.addEvent = function(ele, event, handler) {
		if( typeof ele === 'string')
			ele = $.get(ele);
		if(window.addEventListener) {
			ele.addEventListener(event, handler);
		} else {
			ele.attachEvent('on' + event, handler);
		}
		return handler;
}

$.delEvent = function(ele,event,handler){
	if(typeof ele === 'string')
		ele = $.get(ele);
	if(window.removeEventListener){
		ele.removeEventListener(event,handler);
	}else{
		ele.detachEvent('on'+event,handeler);
	}
}
