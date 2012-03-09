if( typeof Daisy === 'undefined')
	Daisy = {};
(function(Daisy) {
	Daisy._Render = function(editor) {
		this.editor = editor;
		this.ctx = editor.ctx;
		this.theme = editor.theme;
		this.doc = editor.doc;
		this.styles = [];
		//$.log(this.theme);
		this.lexer = editor.lexer;
		this.width = editor.canvas_width;
		this.height = editor.canvas_height;
		this.content_width = 0;
		this.content_height = 0;
		this.max_scroll_left = 0;
		this.max_scroll_top = 0;
		//$.log(this.content_width);
		this.line_height = 0;
		this.page_width = this.width / 2;
		this.page_height = this.height / 2;
		this.buffer_width = this.page_width * 3;
		this.buffer_height = this.page_height * 3;

		this.left_page_size = 0;
		this.left_page_offset = 0;
		this.top_page_size = 0;
		this.top_page_offset = 0;
		//$.log(this.buffer_height);
		//$.log(this.line_height);
		this.ctx.font = this.theme.font;
		this.line_height = this._getLineHeight();

		this.region = {
			left : 0,
			top : 0,
			right : this.buffer_width,
			bottom : this.buffer_height,
			width : this.buffer_width,
			height : this.buffer_height,
			start_line : -1,
			end_line : -1
		};
		this.resetRegion();

	};
	Daisy._Render.prototype = {
		_getLineHeight : function() {
			var ele = document.createElement("span"), h = 0;
			ele.style.font = this.theme.font;
			ele.style.margin = "0px";
			ele.style.padding = "0px";
			ele.style.visibility = "hidden";
			ele.innerHTML = "Abraham 04-02.I Love Daisy.南京大学";
			document.body.appendChild(ele);
			h = ele.offsetHeight;
			document.body.removeChild(ele);
			return h;
		},
		getCharWidth : function(chr, index) {
			var bold = this.styles[this.doc.style_array[index]].bold;
			this.ctx.font = ( bold ? 'Bold ' : '') + this.theme.font;
			return this.ctx.measureText(chr).width
		},
		/**
		 * 得到文本text的宽度。
		 * index是该文本段的起起位置在text_array中的索引，通过这个可以结合style_array得到
		 * 精确的文本宽度，即使该text文本中有加粗的不同样式。
		 *
		 * 当前的实现不够好，因为不需要传入text这样一个string类型的字符串，还得额外传入index。
		 * 所有文本都放在了text_array中，直接传入开始到结束的索引就行了。
		 * 但由于历史原因，以及这样一改动会影响很多地方的代码，暂时没有这样优化，而且目前看到当前实现的效率也可以接受。
		 * 但是目前是没有考虑\t字符的实现的，\t会强制转换成4个真实的空格。在下个版本中会重写。
		 */
		getTextWidth_2 : function(text, index) {
			if(text.length === 0)
				return 0;
			var w = 0, a = 0, b = 0, pre = false, len = text.length, s = this.doc.style_array[index];
			try{
				pre = this.styles[s].bold;
			}catch(e){
				$.log(e);
				throw e;
			}
			b = 1;
			var i = 1;
			while(i < len) {
				s = this.doc.style_array[i + index];

				if(this.styles[s].bold == pre) {
					b++;

				} else {
					w += this._getTextWidth(text.substr(a, b), pre);
					//$.log(a+","+b);
					pre = this.styles[s].bold;
					b = 1;
					a = i;
				}
				i++;
			}
			w += this._getTextWidth(text.substr(a, b), pre);
			;
			//$.log(a+","+b);

			return w;
		},
		_getTextWidth : function(text, bold) {
			this.ctx.font = ( bold ? 'Bold ' : '') + this.theme.font;
			return this.ctx.measureText(text).width
		},
		resetRegion : function() {
			/*
			 * 设置显示字符区域。通常在document中的内容发生变化（添加删除）后调用。
			 * 包括重新设置显示的行等信息。
			 */
			var lines = this.doc.line_info, len = this.doc.line_number, ls = Math.floor(this.region.top / this.line_height), le = Math.floor(this.region.bottom / this.line_height), ls = len > ls ? ls : len, le = len > le ? le : len - 1;

			this.region.start_line = ls;
			this.region.end_line = le;

		},
		resetRenderWidth : function() {
			var c_width = this.doc.max_width_line.width + this.editor.PADDING_RIGHT;

			this.content_width = c_width > this.width ? c_width : this.width;
			this.max_scroll_left = this.content_width - this.width;
			this.editor.bottom_scroll_body.style.width = c_width + "px";
			//$.log(c_width);
		},
		resetRenderHeight : function() {
			var c_height = this.doc.line_number * this.line_height;
			this.content_height = c_height > this.height ? c_height : this.height;
			this.max_scroll_top = this.content_height - this.height;
			this.editor.right_scroll_body.style.height = c_height + "px";

		},
		resetContentSize : function() {
			/**
			 * 重新设置内容大小。比如当最长的一行长度发生变化，或者行数发生变化时，
			 * 需要重新设置新的滚动值（scroll_top,scroll_left）等。
			 */
			this.resetRenderWidth();
			this.resetRenderHeight();
		},
		_paintSelect : function(select_range) {
			var f = select_range.from, t = select_range.to, lines = this.doc.line_info;
			var s, s_colum, e, e_colum;
			/**
			 * 首先确定选择区域的实际绘制区域。通过和this.region比较进行过滤。
			 */
			if(f.line < this.region.start_line) {
				s = this.region.start_line;
				s_colum = -1;
			} else {
				s = f.line;
				s_colum = f.colum;
			}
			if(t.line > this.region.end_line) {
				e = this.region.end_line;
				e_colum = lines[e].length;
			} else {
				e = t.line;
				e_colum = t.colum
			}

			this.ctx.fillStyle = this.theme.selection.background;

			if(s === e) {

				this._paintSelectLine(s, s_colum, e_colum, false);
			} else {

				this._paintSelectLine(s, s_colum, null, true);
				for(var i = s + 1; i < e; i++) {
					//$.log(i)
					this._paintSelectLine(i, null, null, true);
				}
				this._paintSelectLine(e, null, e_colum, false);
			}

		},
		/**
		 * 绘制某一行的选中背景。
		 * line 当前行
		 * colum_from:选中的开始列
		 * colum_to:选中的结束列
		 * cross_line:是否跨行。如果跨行，则在末尾额外添加“\n”字符的宽度的背景。
		 */
		_paintSelectLine : function(line_index, colum_from, colum_to, cross_line) {
			/**
			 * 注意Array.slice(start,end)函数的用法。其区间是[start,end)，不包括end
			 */
			var line = this.doc.line_info[line_index], arr = this.doc.text_array, colum_from = (colum_from == null ? -1 : colum_from), colum_to = (colum_to == null ? line.length - 1 : colum_to);

			var i_from = line.start + colum_from + 1, i_to = line.start + colum_to + 1;
			var w_1 = colum_from < 0 ? 0 : this.getTextWidth_2(arr.slice(line.start + 1, i_from + 1).join(""), line.start + 1);
			var w_2 = colum_to === line.length - 1 ? line.width - w_1 : this.getTextWidth_2(arr.slice(i_from + 1, i_to + 1).join(""), i_from);
			//$.dprint("%d,%d,%d",w_1,w_2,line.width)
			//$.log(arr.slice(i_from, i_to+1 ).join(""))
			w_2 += cross_line ? 10 : 0;
			//先暂时只是简单加10，以后再在初始时计算\n字符宽度。
			/*
			 * 这个地方没有考虑选择区域的宽度超过了显示区域的大小。因为fillRect会自己处理。
			 */
			this.ctx.fillRect(w_1 - this.region.left, line_index * this.line_height - this.region.top, w_2, this.line_height);
		},
		_paintCurrentLine : function() {
			var c_l = this.editor.caret_position.line;
			//$.log(c_l)
			if(c_l >= this.region.start_line && c_l <= this.region.end_line) {
				//$.log(c_l);
				this.ctx.fillStyle = this.theme.current_line.background;
				this.ctx.fillRect(0, c_l * this.line_height - this.region.top, this.buffer_width, this.line_height);
			}
		},
		_check_width : function() {
			var max_change = false,max_line = this.doc.max_width_line;
			for(var i = this.region.start_line; i < this.region.end_line + 1; i++) {
				var line = this.doc.line_info[i];
				if(line.check_width) {
					//$.log('check');
					var lw = this.getTextWidth_2(this.doc.text_array.slice(line.start + 1, line.start + 1 + line.length).join(""), line.start + 1);
					if(line.width !== lw) {
						line.width = lw;
						if(lw > max_line.width || line === max_line)
							max_change = true;
					}
					line.check_width = false;
				}
			}
			if(max_change) {
				this.doc._findMaxWidthLine();
				this.resetRenderWidth();
			}
		},
		paint : function() {

			var f_time = new Date().getTime();

			this._check_width();

			this.ctx.font = this.theme.font;
			this.ctx.textAlign = "start";
			this.ctx.textBaseline = 'bottom';
			/**
			 * 绘制整个背景
			 */
			this.ctx.fillStyle = this.theme.background;
			this.ctx.fillRect(0, 0, this.buffer_width, this.buffer_height);
			/**
			 * 绘制当前行的背景色
			 */
			this._paintCurrentLine();
			/**
			 * 绘制文本选中区域的背景色
			 */
			if(this.doc.select_mode) {
				this._paintSelect(this.doc.select_range);
			}
			/**
			 * 接下来绘制所有文本。
			 * 
			 */
			var cur_line = this.region.start_line, left = -this.region.left, top = this.line_height + cur_line * this.line_height - this.region.top;
			
			var t_arr = this.doc.text_array,s_arr = this.doc.style_array;
			
			line_loop:
			for(var l = this.region.start_line; l <= this.region.end_line; l++) {
				var line = this.doc.line_info[l],idx = line.start+1,idx_e = idx+line.length;
				if(line.length===0){
					top += this.line_height;
					continue;
				}
				var l_s = idx,pre_c = s_arr[idx];
				idx++;
				while(idx<idx_e){
					if(s_arr[idx]!==pre_c){
						this.ctx.font = this.styles[pre_c].font;
						
						var seg = t_arr.slice(l_s,idx).join("");
						//$.log(seg);
						var cw = this.ctx.measureText(seg).width;
						if(left+cw>0){
							this.ctx.fillStyle = this.styles[pre_c].color;
							this.ctx.fillText(seg,left,top);
						}
						l_s = idx;
						pre_c = s_arr[idx];
						left+=cw;
						if(left>this.region.width){
							top += this.line_height;
							left = -this.region.left;
							continue line_loop;
						}
					}
					idx++;
				}
				this.ctx.font = this.styles[pre_c].font;
				this.ctx.fillStyle = this.styles[pre_c].color;
				var seg = t_arr.slice(l_s,idx).join("");
				this.ctx.fillText(seg,left,top);		
				
				top += this.line_height;
				left = -this.region.left;

			}

			//$.log("paint time: " + (new Date().getTime() - f_time));
		},
		scrollLeft : function(value) {
			var page = Math.floor(value / this.page_width);
			this.left_page_offset = value - page * this.page_width;
			if(page !== this.left_page_size) {
				this.left_page_size = page;
				this.region.left = page * this.page_width;
				this.region.right = this.region.left + this.buffer_width;
				//$.log("paint left buffer:"+page);
				this.paint();
			}
		},
		scrollTop : function(value) {
			//$.log("ppp");
			var page = Math.floor(value / this.page_height);
			//$.log("page:"+page);
			this.top_page_offset = value % this.page_height;
			if(page !== this.top_page_size) {
				this.top_page_size = page;
				this.region.top = page * this.page_height;
				this.region.bottom = this.region.top + this.buffer_height;
				this.resetRegion();
				//$.dprint("%d,%d",this.region.start_line,this.region.end_line);
				//$.log("paint top buffer:"+page);

				this.paint();
			}

		}
	}
})(Daisy);
