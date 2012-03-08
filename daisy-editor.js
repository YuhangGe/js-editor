/**
 * @author  Abraham
 * @website http://yuhanghome.net
 * @address software institute, Nanjing University
 * @email   abraham1@163.com | abeyuhang@gmail.com
 * @weibo   http://weibo.com/abeyuhang
 *
 * 两个命中注定孤独的人，
 * 如果无缘走到一起，是上帝想让他们更优秀；
 * 如果有缘走到一起，不是不再孤独，
 * 是上帝让他们更加适应孤独。
 *
 * 基于HTML5的canvas元素的前端代码编辑器，目标是实现一个前端的notepad++。
 * This is a source code editor like Notepad++，
 * but it is written by Javascript，and is based on the Canvas element of HTML5.
 *
 * To Daisy, To my love.
 *
 */
if( typeof Daisy === 'undefined')
	Daisy = {};
(function(Daisy) {
	var $$ = jQuery;
	
	var $ = function(id) {
		return document.getElementById(id);
	}
	$.log = function(msg) {
		if(console.log) {
			console.log(msg);
		}
	}
	$.addEvent = function(ele, event, handler) {
		if( typeof ele === 'string')
			ele = $(ele);
		if(window.addEventListener) {
			ele.addEventListener(event, handler);
		} else {
			ele.attachEvent('on' + event, handler);
		}
	}
	$.delEvent = function(ele, event, handler) {
		if( typeof ele === 'string')
			ele = $(ele);
		if(window.removeEventListener) {
			ele.removeEventListener(event, handler);
		} else {
			ele.detachEvent('on' + event, handeler);
		}
	}
	$.addWheelEvent = function(ele, handler) {
		if( typeof ele === 'string')
			ele = $(ele);
		if(window.addEventListener) {
			ele.addEventListener('mousewheel', handler);
			ele.addEventListener('DOMMouseScroll', handler);
		} else {
			ele.attachEvent('onmousewheel', handler);
		}
	}
	/**
	 * 格式区域，通常由高亮词法器返回
	 * start:区域开始位置，指向区域的前一个字符（
	 *   !!不包括该字符，因此如果区域从文本的第一个字符开始，则start为-1，这一点与其它地方统一。
	 * length: 区域长度。
	 * style: 区域渲染风格，是一个字典Object，包括color(颜色),background(背景色),
	 *        bold(是否加粗)，ital(是否斜体),font(字体),size(字体大小)……等等。
	 *        由于是字典Object，这写属性都是可选的，比如background没有设置(undefined)，
	 * 		    表明不绘制背景。
	 * tag: 该区域的其它属性。保留属性，用来考虑可能的扩展。
	 */
	Daisy.StyleRange = function(start, length, style, tag) {
		this.start = start;
		this.length = length;
		this.style = typeof style === 'undefined' ? {} : style;
		this.tag = tag;
	}

	Daisy._Editor = function(config) {

		var _config = config ? config : {}, _lexer = _config.lexer ? _config.lexer : Daisy.Lexer.General, _theme = _config.theme ? _config.theme : Daisy.Theme.General, _width = _config.width ? _config.width : 120, _height = _config.height ? _config.height : 100;

		this.SCROLL_STEP = 15;
		this.SCROLL_WIDTH = 21;
		this.PADDING_RIGHT = 10;

		this.width = _width;
		this.canvas_width = _width - this.SCROLL_WIDTH;
		this.height = _height;
		this.canvas_height = _height - this.SCROLL_WIDTH;

		this.read_only = false;

		this.caret = null;
		/*
		 * 光标Caret位置的数据结构。
		 */
		this.caret_position = {
			line : -1, //当前光标所在行，从0开始计数
			colum : -1, //当前光标在哪一列的后面，如果光标在该行的最左端，则为-1
			left : 0, //当前光标所在的相对canvas的left位置坐标
			top : 0, //当前光标所在的相对canvas的top位置坐标
			index : -1 //index:当前光标在哪个字符的后面，如果在文本的最开始，则为-1
		};
		this.focused = false;

		this.canvas = $('d-canvas');
		this.ctx = this.canvas.getContext('2d');
		this.container = $('d-editor');
		this.client = $('d-client');
		this.caret = $('d-caret');
		this.right_scroll = $("d-rightscroll");
		this.right_scroll_body = $("d-rightscroll-body");
		this.bottom_scroll = $("d-bottomscroll");
		this.bottom_scroll_body = $("d-bottomscroll-body");

		this.theme = _theme;
		this.scroll_top = 0;
		this.scroll_left = 0;

		this.doc = new Daisy._Document(this);
		this.lexer = new _lexer(this);
		this.render = new Daisy._Render(this);

		this._setSize();

		this.caret.style.height = this.render.line_height + "px";
		this.caret.style.font = this.theme.font;
		this.caret.style.color = this.theme.caret_color;
		//this.right_scroll.style.background = this.theme.background;
		//this.bottom_scroll.style.background = this.theme.background;
		
		this.palette = {
			keys : {},
			values : []
		}
		this._createPalette();
		//$.log(this.palete);
		this.render.styles = this.palette.values;

		this.initEvent();

		//this.measure.refresh();
		this.render.paint();
	}

	Daisy._Editor.prototype = {
		_createPalette : function() {
			var j = 1;
			for(var s in this.theme.styles) {
				if(s === 'default') {
					this.palette.keys['default'] = 0;
					this.palette.values[0] = this.theme.styles[s];
				} else {
					this.palette.keys[s] = j;
					this.palette.values[j] = this.theme.styles[s];
					j++;
				}
			}
			if(this.palette.keys['default']==null){
				throw "主题缺少默认样式！";
			}
		},
		_getEventPoint : function(e) {
			var x = 0, y = 0;
			//$.log(e);
			if( typeof e.offsetX !== 'undefined') {
				x = e.offsetX;
				y = e.offsetY;
			} else if( typeof e.layerX !== 'undefined') {
				x = e.layerX;
				y = e.layerY;
			}
			return {
				x : x + this.scroll_left - this.render.left_page_offset,
				y : y + this.scroll_top - this.render.top_page_offset
			};
		},
		setFontName : function(name) {
			this.font_name = name;
			this.setFont(this.font_size + "px " + name);
		},
		setFontSize : function(size) {
			this.font_size = size;
			this.setFont(size + "px " + this.font_name);
		},
		setFont : function(font) {
			this.theme.font = font;

		},
		_setSize : function() {

			this.container.style.width = this.width + "px";
			this.container.style.height = this.height + "px";
			var l = this.canvas_width , r = this.canvas_height ;
			this.right_scroll.style.left = (l)+"px";
			this.right_scroll.style.height = (r)+"px";
			this.right_scroll.style.width = this.SCROLL_WIDTH + 'px';
			this.bottom_scroll.style.width = (l)+"px";
			this.bottom_scroll.style.top = (r)+"px";
			this.bottom_scroll.style.height = this.SCROLL_WIDTH + 'px';
			this.right_scroll.scrollTop = 0;
			this.bottom_scroll.scrollLeft = 0;
			this.client.style.width = this.canvas_width + "px";
			this.client.style.height = this.canvas_height + "px";
			this.canvas.width = this.render.buffer_width;
			this.canvas.height = this.render.buffer_height;
			this.render.resetContentSize();
		},
		resize : function(size) {
			//this._setSize();
			//this.measureText();
			//this.render.paint();
		},
		_setCaret : function(pos) {
			this.caret_position = pos;
			//$.log(pos);
			this._resetCaret();
		},
		_resetCaret : function() {
			this.caret.style.left = (this.caret_position.left - this.scroll_left) + "px";
			this.caret.style.top = (this.caret_position.top - this.scroll_top) + "px";
		},
		/**
		 * _moveCaret_xy:移动光标到x,y位置对应的字符，
		 *  这里的x,y是鼠标点击相对canvas的坐标，如果坐标在该字符1/2偏左的位置，则光标最后移动到该字符之前；
		 *  否则移动到该字符之后.
		 */
		_moveCaret_xy : function(x, y) {
			if(x < 0 || y < 0)
				return;
			this._setCaret(this.doc._getCaret_xy(x, y));
		},
		/**
		 * 移动光标到第line行和colum列，这里line和colum的含义与 this.caret_position中一致，
		 * 参见上面代码注释。特别注意colum为-1的含义。
		 * 如果没有传入colum参数，则移动到line行的末尾.
		 */
		_moveCaret_lc : function(line, colum) {
			if(line < 0 || line > this.line_number - 1)
				return;
			//$.log("move_lc:" +line+","+colum);
			this._setCaret(this.doc._getCaret_lc(line, colum));
		},
		initEvent : function() {
			var me = this;

			this.__mouse_down__ = false;
			this.__pre_pos__ = null;
			$.addEvent(this.canvas, 'mousedown', function(e) {
				var p = me._getEventPoint(e);
				me._moveCaret_xy(p.x, p.y);
				me.__mouse_down__ = true;
				me.select_mode = false;
				me.__pre_pos__ = me.caret_position;
				me.__down_pos__ = me.caret_position;
				if(me.canvas.setCapture)
					me.canvas.setCapture(true);

				//$.log(me.caret_position);
			});
			$.addEvent(this.canvas, "dblclick", function(e) {
				var p = me._getEventPoint(e);
				me.checkWord(p.x, p.y);
			});
			$.addEvent(this.caret, "dblclick", function(e) {
				var p = this._getEventPoint(e);
				me.checkWord(this.offsetLeft + p.x, this.offsetTop + p.y);
			});
			$.addEvent(this.canvas, 'mouseup', function(e) {
				// $.log('mup');
				me.__mouse_down__ = false;
				/**
				 * todo 不应该每次重绘
				 */
				me.render.paint();
				if(me.canvas.setCapture)
					me.canvas.setCapture(false);
				e.stopPropagation();
			});

			$.addEvent(this.canvas, 'mousemove', function(e) {
				if(!me.__mouse_down__)
					return;
				var p = me._getEventPoint(e), pos = me.doc._getCaret_xy(p.x, p.y); 
				out_if:
				if(pos.line !== me.__pre_pos__.line || pos.colum !== me.__pre_pos__.colum) {
					me._setCaret(pos);
					var from = me.__down_pos__, to = pos;
					if(from.line === to.line && from.colum === to.colum && me.select_mode === true) {
						//me.select_mode = false;
						$.log("select nothing");
						me.doc.select(null);
						break out_if;
					} else if(from.line > to.line || (from.line === to.line && from.colum > to.colum)) {
						from = pos;
						to = me.__down_pos__;
						//$.log(from);
						//$.log(to);
					}
					$.log("Select " + from.line + "," + from.colum + " to " + to.line + "," + to.colum);
					me.doc.select(from, to);
					
					me.render.paint();
					me.__pre_pos__ = pos;
				}

				/**
				 * 如果当前游标的位置不在可见区域（即当前行的末尾没有显示），则滚动使之可见.
				 * 当前使用的规则是滚动到当前行宽度减去15的位置。
				 */
				var cur_line = me.doc.line_info[pos.line];
				if(cur_line.width < me.scroll_left)
					me.scrollLeft(cur_line.width - 15);
				/*
				 * 如果当前游标接近边缘，则自动滚动使显示更多
				 */
				var dl = p.x - me.scroll_left, dr = dl - me.canvas_width, du = p.y - me.scroll_top, dd = du - me.canvas_height;
				if(dl <= 5) {
					/*
					 * 接近左边缘，直接滚动。
					 */
					me._scrollLeft(dl);
				} else if(dr >= -5 && cur_line.width > me.scroll_left + me.width) {
					/*
					 * 接近右边缘，还需要满足当前行未显示到末尾，才滚动
					 */
					me._scrollRight(dr);
				}
				if(du <= 5) {
					me._scrollUp(du);
					//$.log("sup:"+du);
				} else if(dd >= -5) {
					me._scrollDown(dd);
					//$.log("sdown:"+dd);
				}

				e.stopPropagation();
			});

			$.addEvent(this.canvas, 'focus', function(e) {
				me.focused = true;
				me.caret.focus();
				if(me.caretTextChange==null){
					(function(){
						var pre_text = "";
						me.caretTextChange = window.setInterval(function() {
							var cur_text = me.caret.value;
							if(cur_text !== pre_text) {
								me.insertText(cur_text);
								//$.log(cur_text);
								pre_text = "";
								me.caret.value = "";
							}
						}, 100);
					})();
				}
			});
			$.addEvent(this.caret, 'blur', function(e) {
				/**
				 * hack. 下面条件满足则表明光标的焦点失去，并且不在canvas上，
				 *       即整个editor失去焦点。
				 */
				if(e.explicitOriginalTarget !== me.canvas) {
					me.focused = false;
					if(me.caretTextChange!=null){
						window.clearInterval(me.caretTextChange);
						me.caretTextChange = null;
					}
				}
			});

			$.addEvent(this.caret, 'keypress', function(e) {
				//$.log(e);
				switch(e.keyCode) {
					case 13:
						//回车
						var new_pos = me.doc.insertLine(me.caret_position);

						me._moveCaret_lc(new_pos.line, new_pos.colum);
						me.render.paint();
						//$.log(me.doc.line_info);
						break;
					case 8:
						//退格（删除）
						var new_pos = me.doc.backspace(me.caret_position);
						me._moveCaret_lc(new_pos.line, new_pos.colum);
						me.render.paint();
						break;
					case 9:
						me.insertText("    ");
						break;
					case 46:
						//del键
						me.doc.del(me.caret_position);
						me.render.paint();
						break;
					case 37:
						//向左按键
						me.moveCaret("left");
						break;
					case 39:
						//向右s
						me.moveCaret("right");
						break;
					case 38:
						//向上
						me.moveCaret("up");
						break;
					case 40:
						//向下
						me.moveCaret("down");
						break;
					default:
						if(e.charCode > 0) {
							me.doc.insertChar(String.fromCharCode(e.charCode), me.caret_position);
							me.rightCaret(me.caret_position);
							me.render.paint();
						}
				}

				e.preventDefault();
			});

			$.addEvent(this.right_scroll, "scroll", function(e) {

				//$.log(this.scrollTop);
				if(this.scrollTop !== me.scroll_top) {
					me._doScrollTop(this.scrollTop);
				}
			});
			$.addEvent(this.right_scroll, "mousedown", function(e) {
				me.canvas.focus();
			});
			$.addEvent(this.bottom_scroll, "mousedown", function(e) {
				me.canvas.focus();
			});
			$.addEvent(this.bottom_scroll, "scroll", function(e) {

				//$.log(this.scrollLeft);
				//$.log("pp")
				if(this.scrollLeft !== me.scroll_left) {
					//$.log("dpp");
					me._doScrollLeft(this.scrollLeft);
					//me.scroll_left = this.scrollLeft
					//me.render.scrollLeft(this.scrollLeft);
					//me._resetCaret();
				}
			});

			$.addWheelEvent(this.canvas, function(e) {
				//e=window.event|e;

				var delta = 0;
				if(e.wheelDelta) {
					delta = e.wheelDelta / 120;
				} else if(e.detail) {
					delta = -e.detail;
				}
				//$.log(delta);
				me.scrollTop(me.scroll_top - delta*10);
				
				if(e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
				if(e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}

			});
		},
		_scrollUp : function(d) {
			if(this.scroll_top > 0)
				this.scrollTop(this.scroll_top - (this.SCROLL_STEP - d));
		},
		_scrollDown : function(d) {
			if(this.scroll_top < this.render.max_scroll_top)
				this.scrollTop(this.scroll_top + d + this.SCROLL_STEP);
		},
		_scrollRight : function(d) {
			if(this.scroll_left < this.render.max_scroll_left)
				this.scrollLeft(this.scroll_left + d + this.SCROLL_STEP);
		},
		_scrollLeft : function(d) {
			if(this.scroll_left > 0)
				this.scrollLeft(this.scroll_left - (this.SCROLL_STEP - d));
		},
		scrollLeft : function(value) {
			if(!value instanceof Number || value < 0)
				value = 0;
			if(value > this.render.max_scroll_left)
				value = this.render.max_scroll_left;
			if(value === this.scroll_left)
				return;
			this._doScrollLeft(value);
		},
		_doScrollLeft : function(value) {
			this.scroll_left = value;
			this.render.scrollLeft(this.scroll_left);
			this._resetCaret();
			this.bottom_scroll.scrollLeft = value;
			this.canvas.style.left = -this.render.left_page_offset + "px";
		},
		scrollTop : function(value) {
			//$.log(value+","+this.render.max_scroll_top);
			if(!value instanceof Number || value < 0)
				value = 0;
			if(value > this.render.max_scroll_top)
				value = this.render.max_scroll_top;
			if(value === this.scroll_top)
				return;
			//$.log(value);
			this._doScrollTop(value);
		},
		_doScrollTop : function(value) {
			this.scroll_top = value;
			this.render.scrollTop(this.scroll_top);
			this._resetCaret();
			this.right_scroll.scrollTop = value;
			this.canvas.style.top = -this.render.top_page_offset + "px";
		},
		setFocus : function(isFocus) {
			if(isFocus === true) {
				this.focused = true;
				this.caret.focus();
			} else {
				this.focused = false;
				this.caret.blur();
			}
		},
		moveCaret : function(dir) {
			var c = this.caret_position;
			switch(dir) {
				case "left":
					if(this.select_mode && c.index !== this.select_range.from.index)
						this._setCaret(this.select_range.from);
					else
						this.leftCaret(c);
					break;
				case "right":
					if(this.select_mode && c.index !== this.select_range.to.index)
						this._setCaret(this.select_range.to);
					else
						this.rightCaret(c);
					break;
				case "up":
					this.upCaret(c);
					break;
				case "down":
					this.downCaret(c);
					break;
			}
			this.select_mode = false;
			/**
			 * todo 不应该每次重绘
			 */
			this.render.paint();
		},
		/**
		 * 向左移动光标
		 */
		leftCaret : function(c) {
			if(c.colum === -1) {
				this._moveCaret_lc(c.line - 1)
			} else {
				this._moveCaret_lc(c.line, c.colum - 1);
			}
		},
		rightCaret : function(c) {
			if(c.colum === this.doc.line_info[c.line].length - 1) {
				this._moveCaret_lc(c.line + 1, -1);
			} else {
				this._moveCaret_lc(c.line, c.colum + 1)
			}
		},
		downCaret : function(c) {
			this._moveCaret_xy(c.left, c.top + this.render.line_height);
		},
		upCaret : function(c) {
			this._moveCaret_xy(c.left, c.top - this.render.line_height);
		},
		_getCharType : function(c) {
			if(/[0-9a-zA-Z_]/.test(c))
				return this.CHAR_TYPE.WORD;
			else if(c === ' ' || c === '\t')
				return this.CHAR_TYPE.SPACE;
			else if(c < '\xff')
				return this.CHAR_TYPE.ASCII;
			else
				return this.CHAR_TYPE.UNICODE;
		},
		insertText : function(text) {
			/**
			 * 当前版本暂时拆分成单个字符插入。这样在插入少量文本时会有问题，暂时不考虑。
			 * 下个版本会在document.js中的Document类中实现insert插入函数，不会再有性能问题。
			 */
			for(var i=0;i<text.length;i++){
				var c = text[i],new_pos = null;
				if(c==='\n'){
					new_pos = this.doc.insertLine(this.caret_position);
				}else{
					new_pos = this.doc.insertChar(c,this.caret_position);
				}
				this._moveCaret_lc(new_pos.line, new_pos.colum);
			}
			this.render.paint();
			
			//$.log("insert:"+text);
			
		},
		/**
		 * 选中当前光标所在的单词
		 */
		checkWord : function(x, y) {
			var c = this.caret_position, line = this.line_info[c.line];
			if(line.length === 0)
				return;

			var i = this._getChar(x, y), chr = this.text_array[i];
			if(chr === '\n') {
				i--;
				chr = this.text_array[i];
			}
			var chr_type = this._getCharType(chr);

			var l = i - 1, r = i + 1, e = this.text_array.length - 1;
			while(l >= 0 && this._getCharType(this.text_array[l]) === chr_type)
			l--;
			while(r <= e && this._getCharType(this.text_array[r]) === chr_type)
			r++;

			//$.log("check word:"+i+","+l+","+(r-1));
			this.selectByIndex(l, r - 1);
		},
		/**
		 * 选定从from所在字符后的一个字符到to所在的字符，注意没有包括from所在字符，
		 * from如果为-1代表从第一个字符开始选取。
		 */
		selectByIndex : function(from, to) {
			var fc = this.getCaretByIndex(from), tc = this.getCaretByIndex(to);
			this._setCaret(tc);
			this.select_mode = true;
			this.select_range.from = fc;
			this.select_range.to = tc;
			this.render.paint();
		},
		/**
		 * 得到index所指字符的右边位置的游标caret位置。
		 * 如果index为 -1，则返回第一个字符的左边位置，即文本最前端位置
		 * 如果index超过text_array的大小，则返回文本最末端位置
		 */
		getCaretByIndex : function(index) {
			if(index === -1)
				return {
					line : 0,
					colum : -1,
					index : -1,
					left : 0,
					top : 0
				};
			for(var i = 0; i < this.line_number; i++) {
				var line = this.line_info[i];
				if(line.start + line.length >= index) {
					return this._getCaret_lc(i, index - line.start - 1);
				}
			}
		},
		/**
		 * 得到坐标x,y处的字符索引.算法和_getCaret_xy类似，但不一样的在于，
		 * _getCaret_xy是返回x,y处字符对应的游标(caret)位置。
		 */
		_getChar : function(x, y) {
			var row = Math.floor(y / this.line_height), row = row > this.line_number - 1 ? this.line_number - 1 : row, line = this.line_info[row], left = 0, idx = line.start;

			if(line.length > 0) {
				idx = line.start + 1;
				var e = idx + line.length;
				for(; idx < e; idx++) {
					left += this.ctx.measureText(this.text_array[idx]).width;
					if(left >= x)
						break;
				}
			}

			return idx;
		},
	
		/**
		 * 键盘delete按键对应的操作
		 */
		del : function() {
			var c = this.caret_position, start = c.index + 1, length = 1, line = c.line, colum = c.colum;
			if(start === this.text_array.length)
				return;
			if(this.select_mode) {
				var f = this.select_range.from, t = this.select_range.to;
				start = f.index + 1;
				length = t.index - f.index;
				line = f.line;
				colum = f.colum;
				this.select_mode = false;
			}
			this._delete(start, length);
			this._moveCaret_lc(line, colum);
			this.render.paint();
		},
		appendText : function(text) {
			this.doc.append(text);
			this.render.paint();
		}
	}

	Daisy.createEditor = function(textarea, config) {

	}
	Daisy.insertEditor = function(parent_element, config) {

	}
})(Daisy);
