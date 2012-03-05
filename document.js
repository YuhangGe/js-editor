if( typeof Daisy === 'undefined')
	Daisy = {};

Daisy._Document = function(editor) {
	this.editor = editor;
	this.text_array = [];
	this.style_array = [];
	
	/**
	 * 当前行数。初始为1，即一个长度为0的空行。
	 */
	this.line_number = 1;
	/*
	 * line_info:存储每一行的信息，包括
	 * start:该行的起始字符对应的前一个字符在文本中的索引。如果该行是文本的第一行，则为-1.
	 * length: 该行除去\n后的长度，如果为空行则为0 ,
	 * width: 该行的实际长度，使用context.measureText获得
	 * 注意start不是起起字符的索引，是为了能够统一处理当文本全为空即没有一个字符的情况。
	 */
	this.line_info = [{
		start: -1,
		length: 0,
		width: 0
	}];
	/**
	 * 最大长度的一行。
	 */
	this.max_width_line = this.line_info[0];
	
	this.text = "";
	this.select_range = {
		from : null,
		to : null
	};
	this.select_mode = false;
	this.CHAR_TYPE = {
		SPACE : 0,
		WORD : 1,
		INVISIBLE : 3,
		ASCII : 4,
		UNICODE : 5
	};
	
}

Daisy._Document.prototype = {
	setRangeStyle : function(start,length,style_name){
		var c = this.editor.palette.keys[style_name];
		//$.log(c);
		if(c==null)
			c = 0;
		for(var i=start;i<start+length;i++){
			this.style_array[i] = c;
		}
	},
	/*
	 * 替换文本中的内容，功能和参数含义跟Array.splice函数类似。
	 * 从start处开始删除length个元素，再把ele添加进去
	 * 不一样的是，参数ele可以是字符串或单字符，如果是字符串，其中的每个字符都会被添加到text_array
	 */
	_splice : function(start, length, ele) {
		if(ele.length <= 1){
			this.text_array.splice(start, length, ele);
			this.style_array.splice(start,length,-1);
		}
		else{
			this.text_array.splice.apply(this.text_array, [start, length].concat(ele.split("")));
		}
	},
	/**
	 * 替换当前游标所在位置的字符。
	 * 如果当前在选定状态，即有选中的文字，则文字会被替换；
	 * 否则相当于插入字符串。
	 */
	_replace : function(chr,c) {
		var s = this.select_mode, start = c.index + 1, len = 0, new_line = chr === '\n';
		if(s) {
			var f = this.select_range.from, t = this.select_range.to;
			start = f.index + 1;
			len = t.index - f.index;
			c = f;
			this.select_mode = false;
		}
		var line = new_line ? c.line + 1 : c.line, colum = new_line ? -1 : c.colum + chr.length;
		this._splice(start, len, chr);
		return {
			line : line,
			colum : colum
		}
	},
	/**
	 * 在传入游标位置处插入文本。
	 * str:
	 * caret: 游标，通常由editor传入this.caret_position.
	 */
	insertChar : function(chr,caret) {
		this.text_array.splice(caret.index+1,0,chr);
		for(var i=caret.line+1;i<this.line_number;i++){
			//$.log(this.line_info[i].start);
			this.line_info[i].start++;
			//$.log(this.line_info[i].start);
		}
		this.editor.lexer.lex();
		
		var cur_line = this.line_info[caret.line],
			n_w = this.editor.render.getCharWidth(chr,caret.index+1),
			pre_max_width = this.max_width_line.width;
		cur_line.width+=n_w;
		cur_line.length++;
		if(cur_line.width>pre_max_width){
			this.max_width_line = cur_line;
			this.editor.render.resetContentSize();
		}else{
			this.editor.render.resetRegion();
		}
		//$.log(caret);
		//$.log(chr);
		//var f_time=new Date().getTime();
		
		//$.log("lex time: "+(new Date().getTime()-f_time));
		return {
			line:caret.line,
			colum: caret.colum+1
		}
		//return this._replace(str,caret);
	},
	insertLine : function(caret){
		
		this.text_array.splice(caret.index+1,0,'\n');
		this.editor.lexer.lex();
		
		var cur_line = this.line_info[caret.line],
			ls = cur_line.start+1,le=ls+caret.colum,
			rs=le+1,re=cur_line.start+cur_line.length;
		
		var n_s=0,n_l = 0,n_w = 0,n_i=caret.line+1;
		if(le<0){
			//在行首插入新行，如果当前行是空行，也会执行到此。
			n_s = cur_line.start;
			n_i --;
		}else if(re<rs){
			//在行末插入新行
			n_s = rs;
		}else{
			//在一行的中间插入
			n_s = le+1;
			var r_str = this.text_array.slice(rs,re).join(""),
				r_w = this.editor.render.getTextWidth_2(r_str,rs),
				l_w = cur_line.width - r_w;
			n_w = r_w;
			n_l = re-rs+1;
			cur_line.width = l_w;
			cur_line.length = le-ls+1;
		}
		var new_line = {
			start : n_s,
			length: n_l,
			width : n_w
		}
		this.line_info.splice(n_i,0,new_line);
		this.line_number++;
		for(var i=n_i+1;i<this.line_number;i++){
			this.line_info[i].start++;
		}
		if(cur_line===this.max_width_line){
			this._findMaxWidthLine();
		}
		this.editor.render.resetContentSize();
		//$.log(new_line);
		return{
			line: caret.line+1,
			colum : -1
		}
	},
	insertText : function(caret){
		
	},
	
	append : function(str){
		
		
		
		var last_line = this.line_info[this.line_number-1],
			lines = str.split("\n"),
			l = lines[0],size_change=lines.length>1,
			pre_max_width = this.max_width_line.width,
			start_idx = this.text_array.length;
		
		for(var i=0;i<str.length;i++){
			this.text_array.push(str[i]);
			this.style_array.push(0);
		}
		//var f_time=new Date().getTime();
		this.editor.lexer.lex();
		 
		//$.log("lex time: "+(new Date().getTime()-f_time));
		
		var lw = this.editor.render.getTextWidth_2(l,start_idx);
		//var lw2 =  this.editor.render.getTextWidth(l);
		//$.log(lw+","+lw2);
		last_line.width+=lw;
		last_line.length+=l.length;
		//$.log(last_line);
		//$.log(this.max_width_line);
		if(last_line.width>pre_max_width){
			this.max_width_line = last_line;
			pre_max_width = last_line.width;
			size_change = true;
		}
		//$.log(pre_max_width);
		start_idx += l.length;
		for(var i=1;i<lines.length;i++){
			start_idx++; // \n after each line except last line.
			
			l = lines[i];
			lw = this.editor.render.getTextWidth_2(l,start_idx);//this.editor.render.getTextWidth(l);
			start_idx+=l.length;
			//$.log(l+"  :"+lw+" "+start_idx);
			last_line = {
				start : last_line.start+last_line.length+1,
				length: l.length,
				width: lw
			}
			this.line_info.push(last_line);
			this.line_number++;
			if(lw>pre_max_width){
				this.max_width_line = last_line;
				pre_max_width = lw;
			}
			//$.log(lw);
		}
		//$.log(this.max_width_line);
		
		
		if(size_change)
			this.editor.render.resetContentSize();
		
		
	},
	_delete : function(start, length) {
		this.text_array.splice(start, length);
		this.measureText();
	},
	/**
	 * 计算鼠标点击的x,y位置对应的光标位置， 这里的x,y是鼠标点击相对canvas的坐标，
	 *   如果坐标在该点击字符1/2偏左的位置，则返回该字符之前的光标位置；
	 *   否则返回该字符之后的光标位置.
	 * 返回的光标位置的参数（line,colum,left,top,index)意义同this.caret_position,
	 *   请参考上面的代码注释
	 */
	_getCaret_xy : function(x, y) {
		//$.log(x+","+y);
		var line_height = this.editor.render.line_height, row = Math.floor(y / line_height), row = row > this.line_number - 1 ? this.line_number - 1 : row < 0 ? 0 : row;
		//$.log(row);
		var line = this.line_info[row], left = 0, top = row * line_height, col = -1, idx = line.start;

		//$.log(row);
		//$.log(line);
		if(line.length > 0) {
			var k = line.start + 1, e = k + line.length;
			for(; k < e; k++) {
				var cw = this.editor.render.getTextWidth_2(this.text_array[k],k);//this.editor.render.getTextWidth(this.text_array[k]);
				if(left + cw / 2 > x)
					break;
				else
					left += cw;
			}
			idx = k - 1;

			//$.log(left);
			col = idx - line.start - 1;
		}

		return {
			line : row,
			colum : col,
			index : idx,
			left : left,
			top : top
		};
	},
	/**
	 * 计算line行colum列对应的光标位置，
	 *   实际就是计算line行colum列光标所在的相对canvas的位置left和top，
	 *   以及该位置对应的字符索引index
	 * 传入的参数（line,colum）和返回的光标位置的参数（line,colum,left,top,index)
	 *   意义同this.caret_position,请参考上面的代码注释
	 * 如果没有传入colum参数，则返回line行的末尾位置
	 */
	_getCaret_lc : function(line, colum) {

		var l = this.line_info[line], colum = colum === undefined ? l.length : colum + 1, s = this.text_array.slice(l.start + 1, l.start + 1 + colum).join("");

		var left = this.editor.render.getTextWidth_2(s,l.start+1);
		return {
			line : line,
			colum : colum - 1,
			index : l.start + colum,
			left : left,
			top : line * this.editor.render.line_height
		}
	},
	select : function(from, to) {
		if(from === null) {
			this.select_mode = false;
			return;
		}
		this.select_range.from = from;
		this.select_range.to = to;
		this.select_mode = true;
	},
	_findMaxWidthLine : function(){
		var i=0,m_l = this.line_info[i];
		for(i++;i<this.line_info.length;i++){
			if(m_l.width<this.line_info[i].width)
				m_l = this.line_info[i];
		}
		this.max_width_line = m_l;
	}
}