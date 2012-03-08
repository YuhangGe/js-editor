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
	 * str:
	 * caret: 游标，通常由editor传入this.caret_position.
	 */
	insertChar : function(chr, caret) {
		/**
		 * 注意这个地方的实际增加和lex操作要放在最前面。
		 * 因为getTextWidth_2是依赖lex之后的style_array的，
		 * 需要先lex才能具体得到增加的字符的宽度属性。
		 */
		this.text_array.splice(caret.index + 1, 0, chr);
		this.style_array.splice(caret.index + 1, 0, 0);
		//this.editor.lexer.lex();
		
		
		for(var i = caret.line + 1; i < this.line_number; i++) {
			this.line_info[i].start++;
		}
		var cur_line = this.line_info[caret.line];
		cur_line.check_width = true;
		cur_line.length++;
		
		this.editor.render.resetRegion();
		this._doLex([caret.line]);
		return {
			line : caret.line,
			colum : caret.colum + 1
		}

	},
	insertLine : function(caret) {
		this.text_array.splice(caret.index + 1, 0, '\n');
		this.style_array.splice(caret.index + 1, 0, 0);
		
		var cur_line = this.line_info[caret.line], ls = cur_line.start + 1, le = ls + caret.colum, rs = le + 1, re = cur_line.start + cur_line.length;

		var n_s = 0, n_l = 0, n_w = 0, n_i = caret.line + 1;
		if(le < 0) {
			//在行首插入新行，如果当前行是空行，也会执行到此。
			n_s = cur_line.start;
			n_i--;
		} else if(re < rs) {
			//在行末插入新行
			n_s = rs;
		} else {
			//在一行的中间插入
			n_s = le + 1;
			n_l = re - rs + 1;
			cur_line.check_width = true;
			cur_line.length = le - ls + 1;
		}
		var new_line = {
			start : n_s,
			length : n_l,
			check_width : true
		}
		this.line_info.splice(n_i, 0, new_line);
		this.line_number++;
		for(var i = n_i + 1; i < this.line_number; i++) {
			this.line_info[i].start++;
		}
		this.editor.render.resetRenderHeight();
		this.editor.render.resetRegion();

		this._doLex([caret.line,n_i]);

		return {
			line : caret.line + 1,
			colum : -1
		}
	},
	insertText : function(text, caret) {
		// to do...
	},
	append : function(str) {
		var last_line = this.line_info[this.line_number - 1], lines = str.split("\n"), l = lines[0], size_change = lines.length > 1, pre_max_width = this.max_width_line.width, start_idx = this.text_array.length;
		
		for(var i = 0; i < str.length; i++) {
			this.text_array.push(str[i]);
			this.style_array.push(0);
		}
		
		
		var lw = this.editor.render.getTextWidth_2(l, start_idx);
		
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
	check_width : function(start_line, end_line) {
		var max_change = false;
		for(var i = start_line; i < end_line + 1; i++) {
			var line = this.line_info[i];
			if(line.check_width) {
				//$.log('check');
				var lw = this.editor.render.getTextWidth_2(this.text_array.slice(line.start+1,line.start+1+line.length).join(""),line.start+1);
				if(line.width!==lw){
					line.width=lw;
					if(lw>this.max_width_line.width||line===this.max_width_line)
						max_change = true;
				}
				line.check_width = false;
			}
		}
		if(max_change){
			this._findMaxWidthLine();
			this.editor.render.resetRenderWidth();
		}
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
			p_line.width += c_line.width;
			this.line_info.splice(line, 1);
			this.line_number--;
		} else {
			var cw = this.editor.render.getTextWidth_2(this.text_array[index], index);
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
	_deleteSelect : function() {
		var f = this.select_range.from, t = this.select_range.to;
		var f_l = f.line, t_l = t.line, f_colum = f.colum, t_colum = t.colum;

		var len = t.index - f.index;
		for(var i = t.line + 1; i < this.line_number; i++) {
			this.line_info[i].start -= len;
		}
		/**
		 * to do...
		 */
		this.select_mode = false;
		return {
			line : 0,
			colum : 0
		}
	},
	del : function(caret) {
		if(this.select_mode) {
			return this._deleteSelect();
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
			return this._deleteSelect();
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