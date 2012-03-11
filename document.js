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
	 * check_width:宽度修正。
	 */
	this.line_info = [{
		start : -1,
		length : 0,
		width : 0,
		check_width : false
	}];
	/**
	 * 最大长度的一行。
	 */
	this.max_width_line = this.line_info[0];

	this.text = "";
	/**
	 * 选中的文字区域。
	 * from,to都是Caret数据结构。参考daisy-editor.js中this.caret_position注释。
	 * 由于caret中colum和index属性是指代该位置之前的字符索引，所以from.index所在字符是不包含于选中区域的，
	 * 而to.index,to.colum所在字符是包含于选中区域中的。
	 */
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
	setRangeStyle : function(start, length, style_name) {
		var c = this.editor.palette.keys[style_name];
		//$.log(c);
		if(c == null)
			c = 0;
		for(var i = start; i < start + length; i++) {
			this.style_array[i] = c;
		}
	},
	/**
	 * 在传入游标位置处插入文本。
	 * text:
	 * caret: 游标，通常由editor传入this.caret_position.
	 */
	insert : function(text, caret) {
		
		var c_lines = [],del_num = 0,add_num = 0;
		if(this.select_mode){
			del_num = this._deleteSelect();
			caret = this.select_range.from;
		}
		c_lines.push(caret.line);
		//$.log(this.line_info);
		for(var i=0;i<text.length;i++){
			this.text_array.splice(caret.index+1+i,0,text[i]);
			this.style_array.splice(caret.index+1+i,0,0);
		}		
		var r_line,r_colum;
		var f_l = caret.line,s_lines = text.split("\n"),line=this.line_info[f_l];
		for(var i = f_l + 1; i < this.line_number; i++) {
			this.line_info[i].start+=text.length;
		}
		if(s_lines.length===1){
			line.length += s_lines[0].length;
			line.check_width = true;
			r_line = f_l;
			r_colum = caret.colum+s_lines[0].length;
		}else{
			var r_len = line.length - caret.colum - 1;
			line.length = caret.colum+1+s_lines[0].length;
			line.check_width = true;
			for(var i=1;i<s_lines.length;i++){
				//$.log(s_lines[i]);
				line = {
					start : line.start+line.length+1,
					length : s_lines[i].length,
					width : 0,
					check_width : true
				}
				if(i===s_lines.length-1){
					line.length += r_len;
				}
				this.line_info.splice(f_l+i,0,line);
				c_lines.push(f_l+i);
			}
			this.line_number+=s_lines.length-1;
			add_num = s_lines.length - 1;
			r_line = f_l + add_num;
			r_colum = s_lines[s_lines.length-1].length-1;
		}
		
		if(add_num!==del_num)
			this.editor.render.resetRenderHeight();
		this.editor.render.resetRegion();
		
		//$.log(c_lines);
		this._doLex(c_lines);
		
		//$.log(this.line_info);
		return {
			line:r_line,
			colum:r_colum
		}
	},
	append : function(str) {
		var last_line = this.line_info[this.line_number - 1], lines = str.split("\n"), l = lines[0], size_change = lines.length > 1, pre_max_width = this.max_width_line.width, start_idx = this.text_array.length;
		
		for(var i = 0; i < str.length; i++) {
			this.text_array.push(str[i]);
			this.style_array.push(0);
		}
		
		last_line.length += l.length;
		last_line.check_width = true;
		var ch_l = [this.line_number-1];
		start_idx += l.length;
		for(var i = 1; i < lines.length; i++) {
			// \n after each line except last line.
			start_idx++;
			l = lines[i];
			start_idx += l.length;
			//$.log(l+"  :"+lw+" "+start_idx);
			last_line = {
				start : last_line.start + last_line.length + 1,
				length : l.length,
				width : 0,
				check_width : true
			}
			this.line_info.push(last_line);
			ch_l.push(this.line_number);
			this.line_number++;

		}
		
		this._doLex(ch_l);
		if(lines.length>1)
			this.editor.render.resetRenderHeight();
		this.editor.render.resetRegion();
	},
	
	_deleteChar : function(line, colum) {

		var c_line = this.line_info[line], index = c_line.start + colum + 1;
		//$.dprint("del: %d,%d,%d",line,colum,index)

		for(var i = line + 1; i < this.line_number; i++) {
			this.line_info[i].start--;
		}
		var r_line = line, r_colum = colum - 1;
		if(colum < 0) {
			var p_line = this.line_info[line - 1], cw = p_line.width + c_line.width;
			r_line--;
			r_colum = p_line.length - 1;
			p_line.check_width = true;;
			p_line.length += c_line.length;
			this.line_info.splice(line, 1);
			this.line_number--;
		} else {
			c_line.length--;
			c_line.check_width = true;;
		}
		if(colum<0)
			this.editor.render.resetRenderHeight();
		this.editor.render.resetRegion();
		
		this.text_array.splice(index, 1);
		this.style_array.splice(index, 1);
		this._doLex([r_line]);
		return {
			line : r_line,
			colum : r_colum
		}
	},
	/**
	 * 删除选中区域的文本，返回完全删除的行数（而不是受影响的行数，即如果选中的区域在一行中，则返回值为0）。
	 */
	_deleteSelect : function() {
		
		var f = this.select_range.from, t = this.select_range.to;
		var f_l = f.line, t_l = t.line, f_colum = f.colum, t_colum = t.colum;
		var len = t.index - f.index;
		this.text_array.splice(f.index+1,len);
		this.style_array.splice(f.index+1,len);
		for(var i = t.line + 1; i < this.line_number; i++) {
			this.line_info[i].start -= len;
		}
		this.line_info[f_l].check_width = true;
		for(var i=f_l;i<=t_l;i++){
			if(this.line_info[i]===this.max_width_line)
			{
				/**
				 * 如果选中的行中有最宽行，则把最宽行设置为选中的第一行
				 * 这样在Render的_check_width函数中就一定会执行到_findMaxWidthLine从而重新真正查找最宽行。
				 */
				this.max_width_line=this.line_info[f_l];
				break;
			}
		}
		if(f_l===t_l){
			this.line_info[f_l].length -= len;
		}else{
			this.line_info[f_l].length = f_colum + this.line_info[t_l].length- t_colum; 
			this.line_info.splice(f_l+1,t_l-f_l);
			this.line_number-=t_l-f_l;
			
		}
	
		this.select_mode = false;
		
		return t_l - f_l;
	},
	del : function(caret) {
		if(this.select_mode) {
			if(this._deleteSelect()>0)
				this.editor.render.resetRenderHeight();
			this.editor.render.resetRegion();
			this._doLex([this.select_range.from.line]);
			return {
				line : this.select_range.from.line,
				colum : this.select_range.from.colum
			}
		}
		if(caret.index === this.text_array.length - 1) {
			return {
				line : caret.line,
				colum : caret.colum
			};
		}

		if(caret.colum < this.line_info[caret.line].length - 1) {
			return this._deleteChar(caret.line, caret.colum + 1);
		} else {
			return this._deleteChar(caret.line + 1, -1);
		}

	},
	backspace : function(caret) {
		if(this.select_mode) {
			if(this._deleteSelect()>0)
				this.editor.render.resetRenderHeight();
			this.editor.render.resetRegion();
			this._doLex([this.select_range.from.line]);
			return {
				line : this.select_range.from.line,
				colum : this.select_range.from.colum
			}
		}
		if(caret.index === -1) {
			return {
				line : 0,
				colum : -1
			};
		}
		return this._deleteChar(caret.line, caret.colum);
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
				var cw = this.editor.render.getTextWidth_2(this.text_array[k], k);
				//this.editor.render.getTextWidth(this.text_array[k]);
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

		var left = this.editor.render.getTextWidth_2(s, l.start + 1);
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
	_findMaxWidthLine : function() {
		var i = 0, m_l = this.line_info[i];
		for(i++; i < this.line_info.length; i++) {
			if(m_l.width < this.line_info[i].width)
				m_l = this.line_info[i];
		}
		this.max_width_line = m_l;
	},
	_doLex : function(lines) {

		this.editor.lexer.lex(lines);
	},
}