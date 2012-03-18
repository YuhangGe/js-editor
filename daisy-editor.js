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
	var $ = function(id) {
		return document.getElementById(id);
	}
	var ua = navigator.userAgent.toLowerCase();
	var s;
	( s = ua.match(/msie ([\d.]+)/)) ? $.ie = s[1] : ( s = ua.match(/firefox\/([\d.]+)/)) ? $.firefox = s[1] : ( s = ua.match(/chrome\/([\d.]+)/)) ? $.chrome = s[1] : ( s = ua.match(/opera.([\d.]+)/)) ? $.opera = s[1] : ( s = ua.match(/version\/([\d.]+).*safari/)) ? $.safari = s[1] : 0;

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
	$.stopEvent = function(e) {
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		if(e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
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
	$.getFontHeight = function(font) {
		var ele = document.createElement("span"), h = 0;
		ele.style.font = font;
		ele.style.margin = "0px";
		ele.style.padding = "0px";
		ele.style.visibility = "hidden";
		ele.innerHTML = "Abraham 04-02.I Love Daisy.南京大学";
		document.body.appendChild(ele);
		h = ele.offsetHeight;
		document.body.removeChild(ele);
		return h;
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

		var _config = config ? config : {}, _lang = _config.language ? _config.language : 'general', _theme = _config.theme ? _config.theme : 'general', _width = _config.width ? _config.width : 120, _height = _config.height ? _config.height : 100;

		this.SCROLL_STEP = 15;
		this.SCROLL_WIDTH = 21;
		this.PADDING_RIGHT = 10;

		this.width = _width;
		this.canvas_width = _width - this.SCROLL_WIDTH;
		this.height = _height;
		this.canvas_height = _height - this.SCROLL_WIDTH;

		this.read_only = false;

		/*
		 *  光标Caret位置的数据结构。
		 *  line : 0, //当前光标所在行，从0开始计数
		 *	colum : -1, //当前光标在哪一列的后面，如果光标在该行的最左端，则为-1
		 *	left : 0, //当前光标所在的相对canvas的left位置坐标
		 *	top : 0, //当前光标所在的相对canvas的top位置坐标
		 *	index : -1 //index:当前光标在哪个字符的后面，如果在文本的最开始，则为-1
		 *	这里不需要实例，实例都保存在document的saved_caret中，当切换到不同的document时，
		 *  this.caret_position指向不同document的saved_caret
		 * */
		this.caret_position = null;

		this.focused = false;
		this.scroll_top = 0;
		this.scroll_left = 0;
		/*
		 * 得到剪贴板
		 */
		this.clipboard = Daisy.Clipboard.getInstance();
		/*
		 * 初始化dom元素
		 */
		this.canvas = $('d-canvas');
		this.ctx = this.canvas.getContext('2d');
		this.container = $('d-editor');
		this.client = $('d-client');
		this.caret = $('d-caret');
		this.right_scroll = $("d-rightscroll");
		this.right_scroll_body = $("d-rightscroll-body");
		this.bottom_scroll = $("d-bottomscroll");
		this.bottom_scroll_body = $("d-bottomscroll-body");

		/**
		 * 初始化主题信息
		 */
		this.theme_name = _theme.toLowerCase();
		this.theme = null;
		this.palette = null;
		this._loadTheme(this.theme_name);
		 
		/**
		 * 新建document\lexermanager\render实例。这是支撑editor的三大核心元素。
		 */
		this.docs = [];
		this.cur_doc = null;
		this.lexer = new Daisy._LexerManager(this);
		this.render = new Daisy._Render(this);
		/**
		 * 根据配置设置dom元素相关大小。这些大小需要依赖render计算出来的相关大小，
		 * 所以要放在render的初始化之后调用。
		 */
		this._setDomSize();
		/**
		 * 根据主题设置dom元素属性
		 */
		this.caret.style.height = this.theme.font_height + "px";
		this.caret.style.font = this.theme.font;
		this.caret.style.color = this.theme.caret_color;

		this.right_scroll.style.background = this.theme.background;
		this.bottom_scroll.style.background = this.theme.background;

		/**
		 * 设置当前语言。
		 */
		this.lang_name = _lang.toLowerCase();
		/**
		 * 初始化dom元素的事件处理
		 */
		this.initEvent();

		/**
		 * 初始化时默认新建一个doument
		 */
		this.createDocument({
			language : 'javascript'
		});
		this.setActiveDocument(0);

		this.caret.focus();
	}

	Daisy._Editor.prototype = {
		_loadTheme : function(theme_name) {

			var T = Daisy.Theme[theme_name];
			if(T == null)
				throw "not found theme " + theme_name;
			this.theme = {};
			this.theme.font = T.global.font;
			this.theme.color = T.global.color;
			this.theme.background = T.global.background;
			this.theme.select_bg = T.selection.background;
			this.theme.cur_line_bg = T.current_line.background;
			this.theme.caret_color = T.caret.color;
			this.theme.font_height = $.getFontHeight(this.theme.font);
			this.theme.palettes = {};
			for(var name in T.styles) {

				var palette = {
					keys : [],
					values : []
				}
				var j = 1, st = T.styles[name];
				for(var s in st) {
					var s_v = st[s];
					s_v.font = (s_v.bold ? 'bold ' : '') + (s_v.italic ? 'italic ' : '') + (s_v.font != null ? s_v.font : this.theme.font);
					s_v.color = s_v.color == null ? this.theme.color : s_v.color;
					if(s === 'global') {
						palette.keys.global = 0;
						palette.values[0] = s_v;
					} else {
						palette.keys[s] = j;
						palette.values[j] = s_v;
						j++;
					}
				}
				/**
				 * 如果语言的主体没有定义全局字体，则使用整个主题的全局字体。
				 */
				if(palette.keys.global == null) {
					palette.keys.global = 0;
					palette.values[0] = {
						color : this.theme.color,
						font : this.theme.font
					};
				}

				this.theme.palettes[name] = palette;
			}

		},
		_setLanguage : function(language) {
			if(this.lang_name === language)
				return;
			this.lang_name = language;
			this.palette = this.theme.palettes[language];
			/**
			 * 对render的theme（包括font、line_height等）和lexermanager的lexer进行更新。
			 * 由于两个实例都保存了editor的引用（this.editor），所以不再需要传入参数。
			 */
			this.render.resetTheme();
			this.lexer.resetLexer();
		},
		createDocument : function(params) {
			this.docs.push(new Daisy._Document(this,params));
			return this.docs.length - 1;
		},
		setActiveDocument : function(index) {
			if(index < 0 || index >= this.docs.length)
				throw "bad index of document";
			var doc = this.docs[index];
			if(doc === this.cur_doc)
				return;

			if(this.cur_doc !== null){
				this.cur_doc.saved_info.caret = this.caret_position;
				this.cur_doc.saved_info.scroll = {
					left : this.scroll_left,
					top : this.scroll_top
				}
				this.cur_doc.saved_info.language = this.lang_name;
			}
			this.cur_doc = doc;
			this.render.resetDoc();
			this._setLanguage(this.cur_doc.saved_info.language);
		 	this.caret_position = this.cur_doc.saved_info.caret;
			/*
			 * 恢复scrollLeft、scrollTop和caret.
			 * 在_setScroll函数中会调用 _resetCaret设置caret的位置。
			 */
			this._setScroll(this.cur_doc.saved_info.scroll.left,this.cur_doc.saved_info.scroll.top);
		
			this.setFocus(true);
			this.render.paint();
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
		_setDomSize : function() {

			this.container.style.width = this.width + "px";
			this.container.style.height = this.height + "px";
			var l = this.canvas_width, r = this.canvas_height;
			this.right_scroll.style.left = (l) + "px";
			this.right_scroll.style.height = (r) + "px";
			this.right_scroll.style.width = this.SCROLL_WIDTH + 'px';
			this.bottom_scroll.style.width = (l) + "px";
			this.bottom_scroll.style.top = (r) + "px";
			this.bottom_scroll.style.height = this.SCROLL_WIDTH + 'px';
			this.right_scroll.scrollTop = 0;
			this.bottom_scroll.scrollLeft = 0;
			this.client.style.width = this.canvas_width + "px";
			this.client.style.height = this.canvas_height + "px";
			this.canvas.width = this.render.buffer_width;
			this.canvas.height = this.render.buffer_height;

		},
		resize : function(size) {
			//this._setSize();
			//this.measureText();
			//this.render.paint();
		},
		_setCaret : function(pos) {
			//$.log(pos);
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
			//if(x < 0 || y < 0)
				//return;
			this._setCaret(this.cur_doc._getCaret_xy(x, y));
		},
		/**
		 * 移动光标到第line行和colum列，这里line和colum的含义与 this.caret_position中一致，
		 * 参见上面代码注释。特别注意colum为-1的含义。
		 * 如果没有传入colum参数，则移动到line行的末尾.
		 */
		_moveCaret_lc : function(line, colum) {
			//$.log("move_lc:" +line+","+colum);
			//if(line < 0 || line > this.line_number - 1)
				//return;
			this._setCaret(this.cur_doc._getCaret_lc(line, colum));
			
		},
		initEvent : function() {
			var me = this;

			this.__mouse_down__ = false;
			this.__pre_pos__ = null;
			$.addEvent(this.canvas, 'mousedown', function(e) {
				//$.log("down");
				me.cur_doc.select(null);
				var p = me._getEventPoint(e);
				me._moveCaret_xy(p.x, p.y);
				me.__mouse_down__ = true;
				me.__pre_pos__ = me.caret_position;
				me.__down_pos__ = me.caret_position;

				if(me.canvas.setCapture)
					me.canvas.setCapture(true);

				//$.log(me.caret_position);
			});
			$.addEvent(this.canvas, "dblclick", function(e) {
				me.__mouse_down__ = false;
				var p = me._getEventPoint(e);
				me._setCaret(me.cur_doc.selectWord(p.x, p.y));
				me.render.paint();
				//e.preventDefault();
			});
			$.addEvent(this.caret, "dblclick", function(e) {
				me.__mouse_down__ = false;
				var p = me._getEventPoint(e);
				//$.log(e)
				me._setCaret(me.cur_doc.selectWord(this.offsetLeft + p.x, this.offsetTop + p.y));
				me.render.paint();
			});
			$.addEvent(this.canvas, 'mouseup', function(e) {
				//$.log('mup 1');
				me.__mouse_down__ = false;

				me.render.paint();

				if(me.canvas.releaseCapture)
					me.canvas.releaseCapture();

			});

			$.addEvent(this.canvas, 'mousemove', function(e) {
				if(!me.__mouse_down__)
					return;
				var p = me._getEventPoint(e), pos = me.cur_doc._getCaret_xy(p.x, p.y);
				out_if:
				if(pos.line !== me.__pre_pos__.line || pos.colum !== me.__pre_pos__.colum) {
					me._setCaret(pos);
					me.setFocus(true);
					var from = me.__down_pos__, to = pos;
					if(from.line === to.line && from.colum === to.colum && me.select_mode === true) {
						me.cur_doc.select(null);
						break out_if;
					} else if(from.line > to.line || (from.line === to.line && from.colum > to.colum)) {
						from = pos;
						to = me.__down_pos__;

					}
					//$.log("Select " + from.line + "," + from.colum + " to " + to.line + "," + to.colum);
					me.cur_doc.select(from, to);

					me.render.paint();
					me.__pre_pos__ = pos;
				}

				/**
				 * 如果当前游标的位置不在可见区域（即当前行的末尾没有显示），则滚动使之可见.
				 * 当前使用的规则是滚动到当前行宽度减去45的位置。
				 */
				var cur_line = me.cur_doc.line_info[pos.line];
				if(cur_line.width < me.scroll_left)
					me.scrollLeft(cur_line.width - 45);
				/*
				 * 如果当前游标接近边缘，则自动滚动使显示更多
				 */
				// var dl = p.x - me.scroll_left, dr = dl - me.canvas_width, du = p.y - me.scroll_top, dd = du - me.canvas_height;
				// if(dl <= 5) {
					// /*
					 // * 接近左边缘，直接滚动。
					 // */
					// //me._scrollLeft(dl);
					// me.adjustScroll();
				// } else if(dr >= -5 && cur_line.width > me.scroll_left + me.width) {
					// /*
					 // * 接近右边缘，还需要满足当前行未显示到末尾，才滚动
					 // */
					// //me._scrollRight(dr);
					// me.adjustScroll();
				// }
				// if(du <= 5) {
					// me.adjustScroll();
					// //me._scrollUp(du);
				// } else if(dd >= -5) {
					// me.adjustScroll();
					// //me._scrollDown(dd);
					// //$.log("sdown:"+dd);
				// }
 				me.adjustScroll();
				$.stopEvent(e);
			});

			$.addEvent(this.canvas, 'mouseup', function(e) {
				//$.log('focus')
				me.focused = true;
				//me.caret.style.display = "block";
				me.caret.focus();

			});
			$.addEvent(this.caret, 'blur', function(e) {
				/**
				 * hack. 下面条件满足则表明光标的焦点失去，并且不在canvas上，
				 *       即整个editor失去焦点。
				 */
				//$.log('blur');
				if(e.explicitOriginalTarget !== me.canvas) {
					me.focused = false;
					//me.caret.style.display = "none";
				}
			});
			$.addEvent(this.caret, "keydown", function(e) {
				//$.log(e.ctrlKey);
				//$.log(e.keyCode);
				switch(e.keyCode) {
					case 13:
						//回车
						me.insertText("\n");
						/**
						 * 在ie下面要stopEvent，让keypress不要触发，否则回车会多一个\r。由于不影响其它浏览器，统一stopEvent.
						 */
						$.stopEvent(e);
						break;
					case 8:
						//退格（删除）
						me._delOrBack(false);
						break;
					case 9:
						me.insertText("    ");
						$.stopEvent(e);
						break;
					case 46:
						//del键
						me._delOrBack(true);
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
					case 65:
						if(e.ctrlKey) {
							me._setCaret(me.cur_doc.selectAll());
							me.render.paint();
							$.stopEvent(e);
						}
						break;
					case 67:
						if(e.ctrlKey && ($.ie || $.firefox)) {

							me.copy();
							$.stopEvent(e);
						}
						break;
					case 88:
						if(e.ctrlKey && ($.ie || $.firefox)) {

							me.cut();
							$.stopEvent(e);
						}
						break;
				}

			});

			$.addEvent(this.caret, 'input', function(e) {
				//	$.log(e);
				//var f_t = new Date().getTime();

				if(this.value !== "") {
					me.insertText(this.value);
					this.value = "";
				}

				$.stopEvent(e);

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
			$.addEvent(this.caret, 'copy', function(e) {
				me.copy(e);
				$.stopEvent(e);
			});
			$.addEvent(this.caret, 'cut', function(e) {
				me.cut(e);
				$.stopEvent(e);
			});

			$.addEvent(this.caret, 'paste', function(e) {
				/**
				 * paste函数只在firefox下，并且内置的伪clipboard上没有内容的时候才会返回false，
				 * 只有在这种情况下才不取消默认事件。因为firefox没办法直接操作系统clipboard上的数据，
				 * 当copy时只能把数据copy到伪clipboard上（见clipboard.js代码），paste的时候也
				 * 从伪clipboard上获取。但是，firefox用户可以也有从系统的clipboard得到数据的需要，
				 * 为了平衡，就会在伪clipboard数据为空的时候返回false来使this.caret能够得到系统
				 * clipboard上的数据从而触发input事件插入数据。注意一但firefox用户执行过copy操作，则
				 * paste操作将不会得到系统clipboard上的数据。
				 */
				//$.log("paste");

				if(me.paste(e)) {
					$.stopEvent(e);
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
				/*
				 * 滚动到底或者顶时，不需要 event.preventDefault()。这样可以使用户可以继续在浏览器中滚动。
				 */
				if(delta > 0 && me.scroll_top === 0 || delta < 0 && me.scroll_top === me.render.max_scroll_top)
					return;

				me.scrollTop(me.scroll_top - delta * 10);
				$.stopEvent(e);

			});
		},
		copy : function(e) {
			if(this.cur_doc.select_mode)
				this.clipboard.setText(e, this.cur_doc.getSelectText());
		},
		cut : function(e) {
			if(this.cur_doc.select_mode) {
				this.clipboard.setText(e, this.cur_doc.getSelectText());
				var new_pos = this.cur_doc.del(this.caret_position);
				this._moveCaret_lc(new_pos.line, new_pos.colum);
				this.render.paint();
			}
			//$.log("cut")
		},
		paste : function(e) {
			var txt = this.clipboard.getText(e);
			if(txt == null || txt == "") {
				if($.firefox)
					return false;
				else
					return true;
			}
			this.insertText(txt);
			return true;
		},
		/**
		 * 下面的四个函数不再使用。本来是用来当选择文本时光标移动到边缘时自动滚动，
		 * 现在统一使用 this.adjustScroll()来调整滚动位置。
		 *
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
		}, */
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
		_setScroll : function(left,top){
			this.scroll_left = left;
			this.scroll_top = top;
			this.render.scrollLeft(this.scroll_left);
			this.render.scrollTop(this.scroll_top);
			this.canvas.style.left = -this.render.left_page_offset + "px";
			this.canvas.style.top = -this.render.top_page_offset + "px";
			this._resetCaret();
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
					if(this.cur_doc.select_mode && c.index !== this.cur_doc.select_range.from.index)
						this._setCaret(this.cur_doc.select_range.from);
					else
						this.leftCaret(c);
					break;
				case "right":
					if(this.cur_doc.select_mode && c.index !== this.cur_doc.select_range.to.index)
						this._setCaret(this.cur_doc.select_range.to);
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
			this.cur_doc.select_mode = false;
			
			this.adjustScroll();
			
			this.render.paint();
		},
		/**
		 * 跟据光标位置对滚动进行调整。比如当用户通过键盘把光标向下移动到不可见区域时，需要调整scrollTop使其可见。
		 */
		adjustScroll : function(){
			//$.log('adjust');
			var t0 = this.scroll_top - this.caret_position.top,t1 = 0;
			//var t1 =  this.caret_position.top + this.theme.font_height - this.scroll_top - this.render.height;

			if(t0>0){
				 // 光标在上方不可见处
				this._doScrollTop(this.scroll_top - t0)
			}else if((t1=this.theme.font_height - this.render.height - t0) > 0) {
				//光标在下方不可见处
				this._doScrollTop(this.scroll_top + t1);
			}
			
			var t2 = this.scroll_left - this.caret_position.left,t3=0;
			if(t2>0){
				this.scrollLeft(this.scroll_left-t2-100);
			}else if((t3=-this.render.width-t2)>0){
				this.scrollLeft(this.scroll_left+t3+100);
			}

		},
		/**
		 * 向左移动光标
		 */
		leftCaret : function(c) {
			if(c.colum === -1) {
				if(c.line>0)
					this._moveCaret_lc(c.line - 1)
			} else {
				this._moveCaret_lc(c.line, c.colum - 1);
			}
		},
		rightCaret : function(c) {
			if(c.colum === this.cur_doc.line_info[c.line].length - 1) {
				if(c.line<this.cur_doc.line_number-1)
					this._moveCaret_lc(c.line + 1, -1);
			} else {
				this._moveCaret_lc(c.line, c.colum + 1)
			}
		},
		downCaret : function(c) {
			if(c.line<this.cur_doc.line_number-1)
				this._moveCaret_xy(c.left, c.top + this.render.line_height);
		},
		upCaret : function(c) {
			if(c.line>0)
				this._moveCaret_xy(c.left, c.top - this.render.line_height);
		},
		insertText : function(text) {
			var new_pos = this.cur_doc.insert(text, this.caret_position);
			this._moveCaret_lc(new_pos.line, new_pos.colum);
			this.adjustScroll();
			this.render.paint();

			//$.log("insert:"+text);

		},
		appendText : function(text) {
			this.cur_doc.append(text);
			this.render.paint();
		},
		/**
		 * 处理键盘的delete和backspace。如果参数del为true则处理delete键，否则处理backspace键。
		 */
		_delOrBack : function(del){
			var new_pos = null;
			if(del){
				new_pos = this.cur_doc.del(this.caret_position);
			}else{
				new_pos = this.cur_doc.backspace(this.caret_position);	
			}
			this._moveCaret_lc(new_pos.line, new_pos.colum);
			this.adjustScroll();
			this.render.paint();
		},
		focus : function() {
			this.caret.focus();
		}
	}

	Daisy.createEditor = function(textarea, config) {

	}
	Daisy.insertEditor = function(parent_element, config) {

	}
})(Daisy);
