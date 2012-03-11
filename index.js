$(function(){
	d_editor = new Daisy._Editor({
		width: 600,
		height: 400,
		lexer : Daisy.Lexer.JS,
		theme : Daisy.Theme.Daisy
	});
	var str=$('#test').val();
	var s2 ="123456789abcdefgh\n123456789abcdefghigklm";//"1234456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ";
	//s2+=s2+s2+s2;
	//for(var i=2;i<8;i++)
		//s2 += ("\n"+i);
	
	//d_editor.appendText(s2);
	//do_test();
	d_editor.appendText("abc\ndef\n/* 我爱\t小扬 */\n\n\nbedc\ndef");
	//d_editor.appendText("abc");
	//d_editor.appendText("/* love 葛 daisy */\n\n\n\n\n/abcdrrrgdsdsdsdsdddsrrrrrrrrrrrrrrrefgh/\n\\abcdefgh\\\n\n\n//hello world\n\n\nfunction(a)\n{\nalert(\"hello\");\nvar t = new Array(10,1.23),q=/djsjooiiiiksldl/, k = new Int32Array(100), o = [\"jdlsjdlsdjl\",'I love Dasiy.', 'hello, nanjing university'];// test test\n/*\n test\ntest\n */}\n\n\n\n\n\n\n var a=1234");
	//$.log(d_editor.doc.line_info);
	//for(var i=0;i<10;i++)
		//d_editor.appendString(str+str+str);
	//d_editor.appendString("abc 123\ngood 12 + 45\n\naaaa")
});

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
