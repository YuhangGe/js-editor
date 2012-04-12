/***
 * 全局命名空间Daisy.定义了命明空间Daisy和其下的两个子命名空间Lexer和Theme，以及辅助函数类 $ 。
 * 这个文件必须首先引用。之后的文件代码统一使用如下格式：
 * (function(Daisy,$){
 * 	  /*
 *     * code here
 *     */ 
/* })(Daisy,Daisy.$);
 * 
 * 这样单独引用各个源码文件可以正常使用。在将源码文件合并压缩时，
 * 将上面格式中除去首末两行后的代码合并到一起。 
 *
 */
Daisy = {
	Lexer : {
		
	},
	Theme : {
		
	},
	$ : function(id){
		return document.getElementById(id);
	}
};
(function(Daisy,$){
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
			this.docs.push(new Daisy._Document(this, params));
			return this.docs.length - 1;
		},
		setActiveDocument : function(index) {
			if(index < 0 || index >= this.docs.length)
				throw "bad index of document";
			var doc = this.docs[index];
			if(doc === this.cur_doc)
				return;

			if(this.cur_doc !== null) {
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
			this._setScroll(this.cur_doc.saved_info.scroll.left, this.cur_doc.saved_info.scroll.top);

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
		_getEventPoint_chrome : function(e) {
			//$.log(e);
			var x = e.x, y = e.y;
			//$.log("e : %d,%d,%d,%d",e.y,document.body.scrollTop,this.scroll_top,this.render.top_page_offset)
			x -= this.container.offsetLeft + document.body.scrollLeft;
			y -= this.container.offsetTop + document.body.scrollTop;
			return {
				x : x + this.scroll_left,
				y : y + this.scroll_top
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
			//$.log(value);
			this.scroll_top = value;
			this.render.scrollTop(this.scroll_top);
			this._resetCaret();
			this.right_scroll.scrollTop = value;
			this.canvas.style.top = -this.render.top_page_offset + "px";
		},
		_setScroll : function(left, top) {
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
		adjustScroll : function() {
			//$.log('adjust');
			var t0 = this.scroll_top - this.caret_position.top, t1 = 0;
			//var t1 =  this.caret_position.top + this.theme.font_height - this.scroll_top - this.render.height;

			if(t0 > 0) {
				// 光标在上方不可见处
				this._doScrollTop(this.scroll_top - t0)
			} else if(( t1 = this.theme.font_height - this.render.height - t0) > 0) {
				//光标在下方不可见处
				this._doScrollTop(this.scroll_top + t1);
			}

			var t2 = this.scroll_left - this.caret_position.left, t3 = 0;
			if(t2 > 0) {
				this.scrollLeft(this.scroll_left - t2 - 100);
			} else if(( t3 = -this.render.width - t2) > 0) {
				this.scrollLeft(this.scroll_left + t3 + 100);
			}

		},
		/**
		 * 向左移动光标
		 */
		leftCaret : function(c) {
			if(c.colum === -1) {
				if(c.line > 0)
					this._moveCaret_lc(c.line - 1)
			} else {
				this._moveCaret_lc(c.line, c.colum - 1);
			}
		},
		rightCaret : function(c) {
			if(c.colum === this.cur_doc.line_info[c.line].length - 1) {
				if(c.line < this.cur_doc.line_number - 1)
					this._moveCaret_lc(c.line + 1, -1);
			} else {
				this._moveCaret_lc(c.line, c.colum + 1)
			}
		},
		downCaret : function(c) {
			if(c.line < this.cur_doc.line_number - 1)
				this._moveCaret_xy(c.left, c.top + this.render.line_height);
		},
		upCaret : function(c) {
			if(c.line > 0)
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
		_delOrBack : function(del) {
			var new_pos = null;
			if(del) {
				new_pos = this.cur_doc.del(this.caret_position);
			} else {
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

	/**
	 * 对辅助函数类 $ 进行扩充，实现常用的方法。包括事件绑定和删除，浏览器判断等。
	 * 没有直接使用jQuery或是其它库的原因是希望Daisy Editor的独立性。
	 */
	var ua = navigator.userAgent.toLowerCase();
	var s;
	( s = ua.match(/msie ([\d.]+)/)) ? $.ie = s[1] : ( s = ua.match(/firefox\/([\d.]+)/)) ? $.firefox = s[1] : ( s = ua.match(/chrome\/([\d.]+)/)) ? $.chrome = s[1] : ( s = ua.match(/opera.([\d.]+)/)) ? $.opera = s[1] : ( s = ua.match(/version\/([\d.]+).*safari/)) ? $.safari = s[1] : 0;
	
	
	$.sprintf = function() {
		// http://kevin.vanzonneveld.net
		// +   original by: Ash Searle (http://hexmen.com/blog/)
		// + namespaced by: Michael White (http://getsprink.com)
		// +    tweaked by: Jack
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: Paulo Freitas
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: Brett Zamir (http://brett-zamir.me)
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: sprintf("%01.2f", 123.1);
		// *     returns 1: 123.10
		// *     example 2: sprintf("[%10s]", 'monkey');
		// *     returns 2: '[    monkey]'
		// *     example 3: sprintf("[%'#10s]", 'monkey');
		// *     returns 3: '[####monkey]'
		var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
		var a = arguments, i = 0, format = a[i++];

		// pad()
		var pad = function(str, len, chr, leftJustify) {
			if(!chr) {
				chr = ' ';
			}
			var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
			return leftJustify ? str + padding : padding + str;
		};
		// justify()
		var justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
			var diff = minWidth - value.length;
			if(diff > 0) {
				if(leftJustify || !zeroPad) {
					value = pad(value, minWidth, customPadChar, leftJustify);
				} else {
					value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
				}
			}
			return value;
		};
		// formatBaseX()
		var formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
			// Note: casts negative numbers to positive ones
			var number = value >>> 0;
			prefix = prefix && number && {
			'2': '0b',
			'8': '0',
			'16': '0x'
			}[base] || '';
			value = prefix + pad(number.toString(base), precision || 0, '0', false);
			return justify(value, prefix, leftJustify, minWidth, zeroPad);
		};
		// formatString()
		var formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
			if(precision != null) {
				value = value.slice(0, precision);
			}
			return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
		};
		// doFormat()
		var doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
			var number;
			var prefix;
			var method;
			var textTransform;
			var value;

			if(substring == '%%') {
				return '%';
			}

			// parse flags
			var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
			var flagsl = flags.length;
			for(var j = 0; flags && j < flagsl; j++) {
				switch (flags.charAt(j)) {
					case ' ':
						positivePrefix = ' ';
						break;
					case '+':
						positivePrefix = '+';
						break;
					case '-':
						leftJustify = true;
						break;
					case "'":
						customPadChar = flags.charAt(j + 1);
						break;
					case '0':
						zeroPad = true;
						break;
					case '#':
						prefixBaseX = true;
						break;
				}
			}

			// parameters may be null, undefined, empty-string or real valued
			// we want to ignore null, undefined and empty-string values
			if(!minWidth) {
				minWidth = 0;
			} else if(minWidth == '*') {
				minWidth = +a[i++];
			} else if(minWidth.charAt(0) == '*') {
				minWidth = +a[minWidth.slice(1, -1)];
			} else {
				minWidth = +minWidth;
			}

			// Note: undocumented perl feature:
			if(minWidth < 0) {
				minWidth = -minWidth;
				leftJustify = true;
			}

			if(!isFinite(minWidth)) {
				throw new Error('sprintf: (minimum-)width must be finite');
			}

			if(!precision) {
				precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
			} else if(precision == '*') {
				precision = +a[i++];
			} else if(precision.charAt(0) == '*') {
				precision = +a[precision.slice(1, -1)];
			} else {
				precision = +precision;
			}

			// grab value using valueIndex if required?
			value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

			switch (type) {
				case 's':
					return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
				case 'c':
					return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
				case 'b':
					return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
				case 'o':
					return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
				case 'x':
					return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
				case 'X':
					return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
				case 'u':
					return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
				case 'i':
				case 'd':
					number = (+value) | 0;
					prefix = number < 0 ? '-' : positivePrefix;
					value = prefix + pad(String(Math.abs(number)), precision, '0', false);
					return justify(value, prefix, leftJustify, minWidth, zeroPad);
				case 'e':
				case 'E':
				case 'f':
				case 'F':
				case 'g':
				case 'G':
					number = +value;
					prefix = number < 0 ? '-' : positivePrefix;
					method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
					textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
					value = prefix + Math.abs(number)[method](precision);
					return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
				default:
					return substring;
			}
		};
		return format.replace(regex, doFormat);
	}
	$.log = function(msg,arg1,arg2) {
		if(typeof console === 'undefined')
			return;
		if(arguments.length===1){
			console.log(msg);
		}else{
			console.log($.sprintf.apply(this,arguments));
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
	$.createDelegate = function(instance,func){
		return function(){
			try{
			func.apply(instance,arguments);
			}catch(e){
				console.trace();
				$.log(e);
			}
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
			if($.firefox)
				ele.addEventListener('DOMMouseScroll', handler);
			else
				ele.addEventListener('mousewheel', handler);
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
	$.extend = function(src,ext){
		for(var f in ext){
			if(src[f]==null)
				src[f] = ext[f];
			else
				throw "extend error!"
		}
	}

	Daisy._Document = function(editor, params) {
		this.editor = editor;
		if(params == null || typeof params.name !== 'string')
			this.name = "__daisy_doc_" + (Daisy._Document.__name_id__++) + "__";
		else
			this.name = params.name;
		if(params == null || typeof params.language !== 'string')
			this.language = 'general';
		else
			this.language = params.language;

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
		 *
		 * 初始化时默认有一行宽度为0的行。
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
		/**
		 * 对当前caret的备份，只在切换document的时候使用。
		 * 是editor.caret_position的拷贝。
		 */
		this.saved_info = {
			caret : {
				line : 0, //当前光标所在行，从0开始计数
				colum : -1, //当前光标在哪一列的后面，如果光标在该行的最左端，则为-1
				left : 0, //当前光标所在的相对canvas的left位置坐标
				top : 0, //当前光标所在的相对canvas的top位置坐标
				index : -1 //index:当前光标在哪个字符的后面，如果在文本的最开始，则为-1
			},
			scroll : {
				left : 0,
				top : 0
			},
			language : this.language
		}

	}
	Daisy._Document.CHAR_TYPE = {
		SPACE : 0,
		WORD : 1,
		INVISIBLE : 3,
		ASCII : 4,
		UNICODE : 5
	};
	Daisy._Document.__name_id__ = 0;
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
			/*
			 * 过滤掉\0x1f以下除去\0x10(即\n)之外的字符。
			 * todo. 当前把\t(\0x09)直接替换成了4 个空格，在以后的版本中应该实现\t的处理。
			 */
			text = text.replace(/[\x00-\x08\x0b-\x1f]/g, "").replace(/\t/g, "    ");

			var c_lines = [], del_num = 0, add_num = 0;
			if(this.select_mode) {
				del_num = this._deleteSelect();
				caret = this.select_range.from;
			}
			c_lines.push(caret.line);
			//$.log(this.line_info);
			for(var i = 0; i < text.length; i++) {
				this.text_array.splice(caret.index + 1 + i, 0, text[i]);
				this.style_array.splice(caret.index + 1 + i, 0, 0);
			}
			var r_line, r_colum;
			var f_l = caret.line, s_lines = text.split("\n"), line = this.line_info[f_l];
			for(var i = f_l + 1; i < this.line_number; i++) {
				this.line_info[i].start += text.length;
			}
			if(s_lines.length === 1) {
				line.length += s_lines[0].length;
				line.check_width = true;
				r_line = f_l;
				r_colum = caret.colum + s_lines[0].length;
			} else {
				var r_len = line.length - caret.colum - 1;
				line.length = caret.colum + 1 + s_lines[0].length;
				line.check_width = true;
				for(var i = 1; i < s_lines.length; i++) {
					//$.log(s_lines[i]);
					line = {
						start : line.start + line.length + 1,
						length : s_lines[i].length,
						width : 0,
						check_width : true
					}
					if(i === s_lines.length - 1) {
						line.length += r_len;
					}
					this.line_info.splice(f_l + i, 0, line);
					c_lines.push(f_l + i);
				}
				this.line_number += s_lines.length - 1;
				add_num = s_lines.length - 1;
				r_line = f_l + add_num;
				r_colum = s_lines[s_lines.length - 1].length - 1;
			}

			if(add_num !== del_num)
				this.editor.render.resetRenderHeight();
			this.editor.render.resetRegion();

			//$.log(c_lines);
			this._doLex(c_lines);

			//$.log(this.line_info);
			return {
				line : r_line,
				colum : r_colum
			}
		},
		append : function(str) {
			str = str.replace(/[\x00-\x08\x0b-\x1f]/g, "").replace(/\t/g, "    ");

			var last_line = this.line_info[this.line_number - 1], lines = str.split("\n"), l = lines[0], size_change = lines.length > 1, pre_max_width = this.max_width_line.width, start_idx = this.text_array.length;

			for(var i = 0; i < str.length; i++) {
				this.text_array.push(str[i]);
				this.style_array.push(0);
			}

			last_line.length += l.length;
			last_line.check_width = true;
			var ch_l = [this.line_number - 1];
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
			if(lines.length > 1)
				this.editor.render.resetRenderHeight();
			this.editor.render.resetRegion();
		},
		_deleteChar : function(line, colum) {

			var c_line = this.line_info[line], index = c_line.start + colum + 1, _max = false;

			//$.dprint("del: %d,%d,%d",line,colum,index)

			for(var i = line + 1; i < this.line_number; i++) {
				this.line_info[i].start--;
			}
			var r_line = line, r_colum = colum - 1;
			if(colum < 0) {
				var p_line = this.line_info[line - 1], cw = p_line.width + c_line.width;
				r_line--;
				r_colum = p_line.length - 1;
				p_line.check_width = true;
				p_line.length += c_line.length;
				this.line_info.splice(line, 1);
				this.line_number--;
			} else {
				c_line.length--;
				c_line.check_width = true;
			}
			if(colum < 0)
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
			this.text_array.splice(f.index + 1, len);
			this.style_array.splice(f.index + 1, len);
			for(var i = t.line + 1; i < this.line_number; i++) {
				this.line_info[i].start -= len;
			}
			this.line_info[f_l].width = 0;
			this.line_info[f_l].check_width = true;
			for(var i = f_l; i <= t_l; i++) {
				if(this.line_info[i] === this.max_width_line) {
					/**
					 * 如果选中的行中有最宽行，则把最宽行设置为选中的第一行
					 * 这样在Render的_check_width函数中就一定会执行到_findMaxWidthLine从而重新真正查找最宽行。
					 */
					this.max_width_line = this.line_info[f_l];
					break;
				}
			}
			if(f_l === t_l) {
				this.line_info[f_l].length -= len;
			} else {
				this.line_info[f_l].length = f_colum + this.line_info[t_l].length - t_colum;
				this.line_info.splice(f_l + 1, t_l - f_l);
				this.line_number -= t_l - f_l;

			}

			this.select_mode = false;

			return t_l - f_l;
		},
		del : function(caret) {
			if(this.select_mode) {
				if(this._deleteSelect() > 0)
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
				if(this._deleteSelect() > 0)
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
		selectAll : function() {
			return this.selectByIndex(-1, this.text_array.length - 1);
		},
		getSelectText : function() {
			if(!this.select_mode)
				return "";
			var f = this.select_range.from, t = this.select_range.to;
			return this.text_array.slice(f.index + 1, t.index + 1).join("");
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
		/**
		 * 选中当前光标所在的单词
		 */
		selectWord : function(x, y) {
			var c = this.editor.caret_position, line = this.line_info[c.line];
			if(line.length === 0)
				return;

			var i = this._getCharIndex(x, y), chr = this.text_array[i];
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
			return this.selectByIndex(l, r - 1);
		},
		/**
		 * 选定从from所在字符后的一个字符到to所在的字符，注意没有包括from所在字符，
		 * from如果为-1代表从第一个字符开始选取。
		 */
		selectByIndex : function(from, to) {
			var fc = this.getCaretByIndex(from), tc = this.getCaretByIndex(to);
			//this._setCaret(tc);
			this.select_mode = true;
			this.select_range.from = fc;
			this.select_range.to = tc;
			//this.render.paint();
			return fc;
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
		_getCharIndex : function(x, y) {
			var row = Math.floor(y / this.editor.render.line_height), row = row > this.line_number - 1 ? this.line_number - 1 : row, line = this.line_info[row], left = 0, idx = line.start;

			if(line.length > 0) {
				idx = line.start + 1;
				var e = idx + line.length;
				for(; idx < e; idx++) {
					left += this.editor.render.getTextWidth_2(this.text_array[idx], idx);
					if(left >= x)
						break;
				}
			}

			return idx;
		},
		_getCharType : function(c) {
			if(/[0-9a-zA-Z_]/.test(c))
				return Daisy._Document.CHAR_TYPE.WORD;
			else if(c === ' ' || c === '\t')
				return Daisy._Document.CHAR_TYPE.SPACE;
			else if(c < '\xff')
				return Daisy._Document.CHAR_TYPE.ASCII;
			else
				return Daisy._Document.CHAR_TYPE.UNICODE;
		}
	}

	Daisy._Render = function(editor) {
		this.editor = editor;
		this.ctx = editor.ctx;
		this.theme = null;
		this.doc = null;
		this.styles = null;
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
		
		this.line_height = 0;

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
		

	};
	Daisy._Render.prototype = {
		resetTheme : function(){
			this.theme = this.editor.theme;
			this.ctx.font = this.theme.font;
			this.styles = this.editor.palette.values;
			this.line_height = this.theme.font_height;
			//$.log(this.line_height);
		},
		resetDoc : function(){
			this.doc = this.editor.cur_doc;
			this.resetRegion();
			this.resetRenderWidth();
			this.resetRenderHeight();
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
		// resetContentSize : function() {
			// /**
			 // * 重新设置内容大小。比如当最长的一行长度发生变化，或者行数发生变化时，
			 // * 需要重新设置新的滚动值（scroll_top,scroll_left）等。
			 // */
			// this.resetRenderWidth();
			// this.resetRenderHeight();
		// },
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

			this.ctx.fillStyle = this.theme.select_bg;

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
				this.ctx.fillStyle = this.theme.cur_line_bg;
				this.ctx.fillRect(0, c_l * this.line_height - this.region.top, this.buffer_width, this.line_height);
			}
		},
		_check_width : function() {
			var max_change = false,max_line = this.doc.max_width_line;
			for(var i = this.region.start_line; i < this.region.end_line + 1; i++) {
				var line = this.doc.line_info[i];
				if(line.check_width) {
					var lw = this.getTextWidth_2(this.doc.text_array.slice(line.start + 1, line.start + 1 + line.length).join(""), line.start + 1);				
					if((line.width=lw) > max_line.width || line===max_line)
						max_change = true;
	
					line.check_width = false;
			 
				}
			}
			if(max_change) {
				//$.log("mx")
				this.doc._findMaxWidthLine();
				//$.log(this.doc.max_width_line.width);
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
							//$.log(this.styles[pre_c]);
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

	/**
	 * 事件处理模块
	 */
	$.extend(Daisy._Editor.prototype, {
		_focus_handler : function(e) {

			this.focused = true;
			this.caret.focus();

		},
		_blur_handler : function(e) {
			/**
			 * hack. 下面条件满足则表明光标的焦点失去，并且不在canvas上，
			 *       即整个editor失去焦点。
			 */
			//$.log('blur');
			if(e.explicitOriginalTarget !== this.canvas) {
				this.focused = false;
				//this.caret.style.display = "none";
			}
		},
		_mousedown_handler : function(e) {
			this.cur_doc.select(null);
			var p = this._getEventPoint(e);
			//$.log(p.y)
			this._moveCaret_xy(p.x, p.y);
			this.__mouse_down__ = true;
			this.__pre_pos__ = this.caret_position;
			this.__down_pos__ = this.caret_position;

			if(this.canvas.setCapture)
				this.canvas.setCapture(true);
		},
		_mouseup_handler : function(e) {
			//$.log('mup 1');
			this.__mouse_down__ = false;

			this.render.paint();

			if(this.canvas.releaseCapture)
				this.canvas.releaseCapture();

		},
		_mousemove_handler_deal : function(pos) { out_if:
			if(pos.line !== this.__pre_pos__.line || pos.colum !== this.__pre_pos__.colum) {
				this._setCaret(pos);
				this.setFocus(true);
				var from = this.__down_pos__, to = pos;
				if(from.line === to.line && from.colum === to.colum && this.select_mode === true) {
					this.cur_doc.select(null);
					break out_if;
				} else if(from.line > to.line || (from.line === to.line && from.colum > to.colum)) {
					from = pos;
					to = this.__down_pos__;

				}
				//$.log("Select " + from.line + "," + from.colum + " to " + to.line + "," + to.colum);
				this.cur_doc.select(from, to);

				this.render.paint();
				this.__pre_pos__ = pos;
			}

			/**
			 * 如果当前游标的位置不在可见区域（即当前行的末尾没有显示），则滚动使之可见.
			 * 当前使用的规则是滚动到当前行宽度减去45的位置。
			 */
			var cur_line = this.cur_doc.line_info[pos.line];
			if(cur_line.width < this.scroll_left)
				this.scrollLeft(cur_line.width - 45);
			/**
			 * 调整游标位置使其可见
			 */
			this.adjustScroll();
		},
		_mousemove_handler : function(e) {
			if(!this.__mouse_down__)
				return;
			var p = this._getEventPoint(e), pos = this.cur_doc._getCaret_xy(p.x, p.y);
			this._mousemove_handler_deal(pos);
			$.stopEvent(e);
		},
		_chrome_mousemove_handler : function(e) {
			if(!this.__mouse_down__)
				return;
			//$.log('mv')
			var p = this._getEventPoint_chrome(e);
			//$.log("%d,%d",p.x,p.y);
			var pos = this.cur_doc._getCaret_xy(p.x, p.y);
			//$.log(pos.line)
			this._mousemove_handler_deal(pos);
			$.stopEvent(e);
		},
		_chrome_mouseup_handler : function(e) {

			this.__mouse_down__ = false;

			this.render.paint();

			$.delEvent(document.body, 'mousemove', this.__cmv_handler);
			$.delEvent(document.body, 'mouseup', this.__cmu_handler);

		},
		_chrome_mousedown_handler : function(e) {
			this._mousedown_handler(e);

			$.addEvent(document.body, 'mousemove', this.__cmv_handler);
			$.addEvent(document.body, 'mouseup', this.__cmu_handler);
		},
		_keydown_handler : function(e) {
			//$.log(e.ctrlKey);
			//$.log(e.keyCode);
			switch(e.keyCode) {
				case 13:
					//回车
					this.insertText("\n");
					/**
					 * 在ie下面要stopEvent，让keypress不要触发，否则回车会多一个\r。由于不影响其它浏览器，统一stopEvent.
					 */
					$.stopEvent(e);
					break;
				case 8:
					//退格（删除）
					this._delOrBack(false);
					break;
				case 9:
					this.insertText("    ");
					$.stopEvent(e);
					break;
				case 46:
					//del键
					this._delOrBack(true);
					break;
				case 37:
					//向左按键
					this.moveCaret("left");
					break;
				case 39:
					//向右s
					this.moveCaret("right");
					break;
				case 38:
					//向上
					this.moveCaret("up");
					break;
				case 40:
					//向下
					this.moveCaret("down");
					break;
				case 65:
					if(e.ctrlKey) {
						this._setCaret(this.cur_doc.selectAll());
						this.render.paint();
						$.stopEvent(e);
					}
					break;
				case 67:
					if(e.ctrlKey && ($.ie || $.firefox)) {

						this.copy();
						$.stopEvent(e);
					}
					break;
				case 88:
					if(e.ctrlKey && ($.ie || $.firefox)) {

						this.cut();
						$.stopEvent(e);
					}
					break;
			}

		},
		_input_handler : function(e) {
			//	$.log(e);
			//var f_t = new Date().getTithis();

			if(this.caret.value !== "") {
				this.insertText(this.caret.value);
				this.caret.value = "";
			}

			$.stopEvent(e);

		},
		_wheel_handler : function(e) {
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
			if(delta > 0 && this.scroll_top === 0 || delta < 0 && this.scroll_top === this.render.max_scroll_top)
				return;

			this.scrollTop(this.scroll_top - delta * 10);
			$.stopEvent(e);

		},
		_right_scroll_handler : function(e) {

			//$.log('rs');
			//$.log("%d,%d",this.right_scroll.scrollTop,this.scroll_top)
			if(this.right_scroll.scrollTop !== this.scroll_top) {
				//$.log('rrs')
				this._doScrollTop(this.right_scroll.scrollTop);
			}
		},
		_bottom_scroll_handler : function(e) {

			if(this.bottom_scroll.scrollLeft !== this.scroll_left) {

				this._doScrollLeft(this.bottom_scroll.scrollLeft);

			}
		},
		_copy_handler : function(e) {
			this.copy(e);
			$.stopEvent(e);
		},
		_cut_handler : function(e) {
			this.cut(e);
			$.stopEvent(e);
		},
		_paste_handler : function(e) {
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

			if(this.paste(e)) {
				$.stopEvent(e);
			}

		},
		_caret_dblclick_handler : function(e) {
			this.__mouse_down__ = false;
			var p = this._getEventPoint(e);
			//$.log(e)
			this._setCaret(this.cur_doc.selectWord(this.offsetLeft + p.x, this.offsetTop + p.y));
			this.render.paint();
		},
		_canvas_dblclick_handler : function(e) {
			this.__mouse_down__ = false;
			var p = this._getEventPoint(e);
			this._setCaret(this.cur_doc.selectWord(p.x, p.y));
			this.render.paint();
			//e.preventDefault();
		},
		initEvent : function() {
			var me = this;
			this.__mouse_down__ = false;
			this.__pre_pos__ = null;

			if(this.canvas.setCapture) {
				//$.log('fire')
				$.addEvent(this.canvas, 'mousedown', $.createDelegate(this, this._mousedown_handler));
				$.addEvent(this.canvas, 'mouseup', $.createDelegate(this, this._mouseup_handler));
				$.addEvent(this.canvas, 'mousemove', $.createDelegate(this, this._mousemove_handler));
			} else {
				this.__cmv_handler = $.createDelegate(this, this._chrome_mousemove_handler);
				//$.log(this.__cmv_handler)
				this.__cmu_handler = $.createDelegate(this, this._chrome_mouseup_handler);
				$.addEvent(this.canvas, 'mousedown', $.createDelegate(this, this._chrome_mousedown_handler));
			}
			$.addEvent(this.canvas, "dblclick", $.createDelegate(this, this._canvas_dblclick_handler));
			$.addEvent(this.caret, "dblclick", $.createDelegate(this, this._caret_dblclick_handler));
			$.addEvent(this.canvas, 'mouseup', $.createDelegate(this, this._focus_handler));
			$.addEvent(this.caret, 'blur', $.createDelegate(this, this._blur_handler));
			$.addEvent(this.caret, "keydown", $.createDelegate(this, this._keydown_handler));
			$.addEvent(this.caret, 'input', $.createDelegate(this, this._input_handler));
			$.addEvent(this.right_scroll, "scroll", $.createDelegate(this, this._right_scroll_handler));
			$.addEvent(this.bottom_scroll, "scroll", $.createDelegate(this, this._bottom_scroll_handler));
			$.addEvent(this.caret, 'copy', $.createDelegate(this, this._copy_handler));
			$.addEvent(this.caret, 'cut', $.createDelegate(this, this._cut_handler));

			$.addEvent(this.caret, 'paste', $.createDelegate(this, this._paste_handler));

			$.addWheelEvent(this.canvas, $.createDelegate(this, this._wheel_handler));
		}
	});

	Daisy.Lexer.ACT_TYPE = {
		NO_ACTION : -1,
		UNKNOW_CHAR : -2,
		UNMATCH_CHAR : -3
	}
	Daisy.Lexer.Help = {
		_str_to_arr : function(strs, arrs) {
			for(var j = 0; j < strs.length; j++) {
				var str = strs[j], arr = arrs[j], t = str.charCodeAt(0), len = str.length, c = 0;
				for(var i = 1; i < len; i++) {
					if(t === 0)
						arr[i - 1] = str.charCodeAt(i) - 1;
					else {
						var n = str.charCodeAt(i) - 1, v = str.charCodeAt(i + 1) - 1;
						for(var k = 0; k < n; k++) {
							arr[c] = v;
							c++;
						}
						i++;
					}
				}
			}

		}
	}

	Daisy._LexerManager = function(editor) {
		this.DELAY_LEN = 100000;
		this.editor = editor;
		this.lexer_hash = {};
		this.lexer = null;
		this.busy_work = null;
		this.wait = false;
		this.check_line = [];
		//this.lexer_worker = new Worker("lexer_worker.js");
		//this.lexer_worker.onmessage = this.onlexer;
	}
	Daisy._LexerManager.prototype = {
		resetLexer : function() {
			//$.dprint("r lexs")
			var name = this.editor.lang_name;
			if(this.lexer_hash[name] == null) {
				this.lexer_hash[name] = new Daisy.Lexer[name](this.editor);
				//$.dprint("new lexer : %s",name);
			}
			this.lexer = this.lexer_hash[name];
		},
		_delayLex : function(lines) {
			var me = this;
			if(lines != null)
				this.check_line = this.check_line.concat(lines);

			if(this.busy_work === null) {
				this.busy_work = setTimeout(function() {
					var f_t = new Date().getTime();
					me.lexer.lex();
					//$.log('lex time: '+ (new Date().getTime()-f_t))
					for(var i = 0; i < me.check_line.length; i++) {
						me.editor.cur_doc.line_info[me.check_line[i]].check_width = true;
					}
					//$.log(me.check_line.length);
					me.check_line.length = 0;
					me.editor.render.paint();
					me.busy_work = null;
					if(me.wait) {
						me.wait = false;
						setTimeout(function() {
							me.lex();
						}, 0);
					}
				}, 0);
			} else {
				//$.log('busy!');
				this.wait = true;
			}
		},
		lex : function(lines) {
			/**
			 * 此处把lex工作交给另外一个线程处理。因为当文本量巨大的时候，lex工作会消耗很多时间。
			 * 注意这里是没有作用的，setTimeout并没有起到多线程的作用，当lex正在执行的时候还是会卡住，这里只是演示一个设计。
			 * 下一个版本会学习并使用javascript 的 Work 类实现多进程。
			 * 具体来说，应该有一个队列维护当前的lex请求，如果队列中只会存在最多两个请求，一个是正在执行的，一个是待执行的，
			 * 如果当前正在执行的 lex 工作未完成，后续的更多的lex请求只接受一个，即最近的一个。
			 */
			//return

			//$.log(this.editor.cur_doc.text_array.length)
			/**
			 * 如果文本量少于this.DELAY_LEN，则及时进行lex，这样可以快速地显示颜色，而且不需要进行两次paint
			 * 但当文本量太多时，lex操作反而会影响响应，则需要延迟进行。
			 * 尝试用Worker类未果，因为Worker线程之间数据传输都是structured copy。不能直接共享数据。。。。
			 */
			if(this.editor.cur_doc.text_array.length < this.DELAY_LEN) {
				this.lexer.lex();
			} else {
				this._delayLex(lines);
			}
		}
	}

	/**
	 * 模拟的剪贴板，在firefox下不能直接向系统剪贴板中写入数据。
	 * 使用单例模式。
	 */
	Daisy.Clipboard = function() {
		this.text = "";
	};

	Daisy.Clipboard.prototype = {
		getText : function(e) {
			var clip = window.clipboardData;
			if(e && e.clipboardData)
				clip = e.clipboardData;
			if(clip)
				return clip.getData("text");
			else
				return this.text;
			$.dprint("get clip");
		},
		setText : function(e, txt) {
			if(txt == null || txt == "")
				return;
			var clip = window.clipboardData;
			if(e && e.clipboardData)
				clip = e.clipboardData;
			if(clip)
				clip.setData("text", txt);
			else
				this.text = txt;
			$.dprint("set clip: %s", txt);
		}
	}
	Daisy.Clipboard.__instance__ = null;
	Daisy.Clipboard.getInstance = function() {
		if(Daisy.Clipboard.__instance__ === null)
			Daisy.Clipboard.__instance__ = new Daisy.Clipboard();
		return Daisy.Clipboard.__instance__;
	}


;
	/**
	 * visual basic词法分析器
	 */
	(function(L) {
		var DEFAULT = 156, COMMENT = 157, STRING_A = 158;

		L.visualbasic = function(editor) {
			this.editor = editor;
			this.src = null;
			this.theme = editor.theme;
			this.end = 0;
			this.idx = 0;
			this.chr = -1;
			this.i_s = 156;
			this.yydefault = "default";
			this.yystyle = null;
			this.TABLE = {
				_base : (window.Int32Array ? new Int32Array(159) : new Array(159)),
				_default : (window.Int32Array ? new Int32Array(159) : new Array(159)),
				_check : (window.Int32Array ? new Int32Array(3781) : new Array(3781)),
				_next : (window.Int32Array ? new Int32Array(3781) : new Array(3781)),
				_action : (window.Int32Array ? new Int32Array(159) : new Array(159)),
				_eqc : (window.Int32Array ? new Int32Array(256) : new Array(256))
			};

			L.Help._str_to_arr(["\0\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\2\1\1\6\45\x40\x5b\x76\x91\xac\1\xc7\xe2\xfd\u0118\u0133\u014e\u0169\u0184\u019f\u01ba\u01d5\u01f0\u020b\u0226\u0241\u025c\u0277\u0292\u02ad\u02c8\u02e3\u02fe\u0319\u0334\u034f\u036a\u0385\u03a0\u03bb\u03d6\u03f1\u040c\u0427\u0442\u045d\u0478\u0493\u04ae\u04c9\u04e4\u04ff\u051a\u0535\u0550\u056b\u0586\u05a1\u05bc\u05d7\u05f2\u060d\u0628\u0643\u065e\u0679\u0694\u06af\u06ca\u06e5\1\u0700\u071b\u0736\u0751\u076c\u0787\u07a2\u07bd\u07d8\u07f3\u080e\u0829\u0844\u085f\u087a\u0895\u08b0\u08cb\u08e6\u0901\u091c\u0937\u0952\u096d\u0988\u09a3\u09be\u09d9\u09f4\u0a0f\u0a2a\u0a45\u0a60\u0a7b\u0a96\u0ab1\u0acc\u0ae7\u0b02\u0b1d\u0b38\u0b53\u0b6e\u0b89\u0ba4\u0bbf\u0bda\u0bf5\u0c10\u0c2b\u0c46\u0c61\u0c7c\u0c97\u0cb2\u0ccd\u0ce8\u0d03\u0d1e\u0d39\u0d54\u0d6f\u0d8a\u0da5\u0dc0\u0ddb\u0df6\u0e11\u0e2c\u0e48\u0e72\1\u0e9c", "\1\14\0\2\11\2\12\2\11\3\0\3\13\2\20\7\0\2\30\74\0\2\30\x47\0\2\13\2\x9c\2\0", "\1\2\x9e\2\0\2\12\2\11\3\20\2\23\30\0\2\13\2\21\2\22\3\0\2\23\3\0\3\24\2\0\2\17\30\24\3\25\3\0\30\25\3\26\3\0\30\26\3\27\3\0\30\27\3\30\3\0\30\30\3\31\3\0\30\31\3\33\3\0\30\33\3\34\3\0\30\34\3\35\3\0\30\35\3\36\3\0\30\36\3\37\3\0\30\37\3\40\3\0\30\40\3\41\3\0\30\41\3\42\3\0\30\42\3\43\3\0\30\43\3\44\3\0\30\44\3\45\3\0\30\45\3\46\3\0\30\46\3\47\3\0\30\47\3\50\3\0\30\50\3\51\3\0\30\51\3\52\3\0\30\52\3\53\3\0\30\53\3\54\3\0\30\54\3\55\3\0\30\55\3\56\3\0\30\56\3\57\3\0\30\57\3\60\3\0\30\60\3\61\3\0\30\61\3\62\3\0\30\62\3\63\3\0\30\63\3\64\3\0\30\64\3\65\3\0\30\65\3\66\3\0\30\66\3\67\3\0\30\67\3\70\3\0\30\70\3\71\3\0\30\71\3\72\3\0\30\72\3\73\3\0\30\73\3\74\3\0\30\74\3\75\3\0\30\75\3\76\3\0\30\76\3\77\3\0\30\77\3\x40\3\0\30\x40\3\x41\3\0\30\x41\3\x42\3\0\30\x42\3\x43\3\0\30\x43\3\x44\3\0\30\x44\3\x45\3\0\30\x45\3\x46\3\0\30\x46\3\x47\3\0\30\x47\3\x48\3\0\30\x48\3\x49\3\0\30\x49\3\x4a\3\0\30\x4a\3\x4b\3\0\30\x4b\3\x4c\3\0\30\x4c\3\x4d\3\0\30\x4d\3\x4e\3\0\30\x4e\3\x4f\3\0\30\x4f\3\x50\3\0\30\x50\3\x51\3\0\30\x51\3\x52\3\0\30\x52\3\x53\3\0\30\x53\3\x54\3\0\30\x54\3\x55\3\0\30\x55\3\x57\3\0\30\x57\3\x58\3\0\30\x58\3\x59\3\0\30\x59\3\x5a\3\0\30\x5a\3\x5b\3\0\30\x5b\3\x5c\3\0\30\x5c\3\x5d\3\0\30\x5d\3\x5e\3\0\30\x5e\3\x5f\3\0\30\x5f\3\x60\3\0\30\x60\3\x61\3\0\30\x61\3\x62\3\0\30\x62\3\x63\3\0\30\x63\3\x64\3\0\30\x64\3\x65\3\0\30\x65\3\x66\3\0\30\x66\3\x67\3\0\30\x67\3\x68\3\0\30\x68\3\x69\3\0\30\x69\3\x6a\3\0\30\x6a\3\x6b\3\0\30\x6b\3\x6c\3\0\30\x6c\3\x6d\3\0\30\x6d\3\x6e\3\0\30\x6e\3\x6f\3\0\30\x6f\3\x70\3\0\30\x70\3\x71\3\0\30\x71\3\x72\3\0\30\x72\3\x73\3\0\30\x73\3\x74\3\0\30\x74\3\x75\3\0\30\x75\3\x76\3\0\30\x76\3\x77\3\0\30\x77\3\x78\3\0\30\x78\3\x79\3\0\30\x79\3\x7a\3\0\30\x7a\3\x7b\3\0\30\x7b\3\x7c\3\0\30\x7c\3\x7d\3\0\30\x7d\3\x7e\3\0\30\x7e\3\x7f\3\0\30\x7f\3\x80\3\0\30\x80\3\x81\3\0\30\x81\3\x82\3\0\30\x82\3\x83\3\0\30\x83\3\x84\3\0\30\x84\3\x85\3\0\30\x85\3\x86\3\0\30\x86\3\x87\3\0\30\x87\3\x88\3\0\30\x88\3\x89\3\0\30\x89\3\x8a\3\0\30\x8a\3\x8b\3\0\30\x8b\3\x8c\3\0\30\x8c\3\x8d\3\0\30\x8d\3\x8e\3\0\30\x8e\3\x8f\3\0\30\x8f\3\x90\3\0\30\x90\3\x91\3\0\30\x91\3\x92\3\0\30\x92\3\x93\3\0\30\x93\3\x94\3\0\30\x94\3\x95\3\0\30\x95\3\x96\3\0\30\x96\3\x97\3\0\30\x97\3\x98\3\0\30\x98\3\x99\3\0\30\x99\3\x9a\3\0\30\x9a\3\x9b\3\0\30\x9b\52\x9c\37\x9d\2\0\14\x9d\53\x9f", "\1\2\5\2\0\2\16\2\11\2\20\2\16\2\15\30\0\4\3\3\0\2\3\3\0\3\x56\2\0\2\6\4\x56\2\x89\26\x56\3\0\6\x56\2\x7c\22\x56\2\x72\2\x56\3\0\32\x56\3\0\3\x56\2\x6e\27\x56\3\0\32\x56\3\0\2\75\31\x56\3\0\2\x56\2\x99\30\x56\3\0\4\x56\2\x97\26\x56\3\0\2\x96\31\x56\3\0\2\x56\2\x96\30\x56\3\0\3\x56\2\x96\27\x56\3\0\3\x56\2\x95\20\x56\2\30\7\x56\3\0\4\x56\2\x92\26\x56\3\0\6\x56\2\x99\24\x56\3\0\6\x56\2\x97\24\x56\3\0\7\x56\2\x96\23\x56\3\0\7\x56\2\x8f\23\x56\3\0\6\x56\2\x8d\24\x56\3\0\2\71\7\x56\2\x99\22\x56\3\0\10\x56\2\x96\22\x56\3\0\2\x42\7\x56\2\x96\22\x56\3\0\10\x56\2\x95\22\x56\3\0\2\x8b\31\x56\3\0\4\x56\2\x8b\26\x56\3\0\6\x56\2\x8b\24\x56\3\0\3\x56\2\x45\3\x56\2\x87\2\x7d\3\x56\2\x97\2\x5b\17\x56\3\0\10\x56\2\x8b\22\x56\3\0\2\x56\2\x85\30\x56\3\0\2\x82\31\x56\3\0\2\x56\2\x54\2\x56\2\x85\26\x56\3\0\4\x56\2\x4e\6\x56\2\x9a\20\x56\3\0\12\x56\2\x8a\20\x56\3\0\12\x56\2\x85\16\x56\2\x7e\2\x56\3\0\2\x41\2\x56\2\x6f\2\x44\26\x56\3\0\2\x7f\31\x56\3\0\10\x56\2\x7f\22\x56\3\0\13\x56\2\x84\15\x56\2\x7b\2\x56\3\0\32\x56\3\0\2\x79\31\x56\3\0\14\x56\2\x90\16\x56\3\0\4\x56\2\x76\26\x56\3\0\7\x56\2\x75\10\x56\2\45\13\x56\3\0\11\x56\2\x78\21\x56\3\0\11\x56\2\x77\21\x56\3\0\2\x56\2\x73\2\x56\2\x71\26\x56\3\0\17\x56\2\x9b\13\x56\3\0\17\x56\2\x99\13\x56\3\0\7\x56\2\x6b\23\x56\3\0\11\x56\2\x6c\21\x56\3\0\13\x56\2\x6d\17\x56\3\0\16\x56\2\x6a\14\x56\3\0\4\x56\2\x67\26\x56\3\0\13\x56\2\x65\17\x56\3\0\2\x56\2\x62\30\x56\3\0\17\x56\2\x64\13\x56\3\0\2\x60\14\x56\2\x51\15\x56\3\0\21\x56\2\x90\11\x56\3\0\22\x56\2\x99\3\x56\2\30\5\x56\3\0\2\x56\2\x57\21\x56\2\x91\7\x56\3\0\2\x5e\31\x56\3\0\4\x56\2\x5d\26\x56\3\0\7\x56\2\x5e\23\x56\3\0\6\x56\2\x5c\24\x56\3\0\12\x56\2\x59\20\x56\3\0\6\x56\2\x58\24\x56\3\0\4\x56\2\x55\26\x56\3\0\26\x56\2\30\4\x56\3\0\25\x56\2\30\5\x56\3\0\24\x56\2\30\6\x56\3\0\11\x56\2\x53\21\x56\3\0\7\x56\2\x52\23\x56\3\0\2\x56\2\x50\30\x56\3\0\23\x56\2\30\7\x56\3\0\12\x56\2\x4c\2\x4d\17\x56\3\0\4\x56\2\x4b\26\x56\3\0\4\x56\2\x4a\26\x56\3\0\2\x56\2\x49\30\x56\3\0\2\x56\2\x48\30\x56\3\0\2\x48\31\x56\3\0\20\x56\2\54\12\x56\3\0\3\x56\2\x5a\15\x56\2\30\12\x56\3\0\20\x56\2\30\12\x56\3\0\20\x56\2\25\12\x56\3\0\2\x56\2\x5f\2\x47\27\x56\3\0\7\x56\2\x46\23\x56\3\0\4\x56\2\x43\26\x56\3\0\17\x56\2\73\13\x56\3\0\17\x56\2\30\13\x56\3\0\16\x56\2\44\14\x56\3\0\16\x56\2\30\14\x56\3\0\15\x56\2\64\15\x56\3\0\15\x56\2\30\15\x56\3\0\13\x56\2\x40\17\x56\3\0\13\x56\2\77\17\x56\3\0\12\x56\2\77\2\x6f\17\x56\3\0\4\x56\2\74\26\x56\3\0\14\x56\2\34\16\x56\3\0\14\x56\2\32\16\x56\3\0\14\x56\2\30\16\x56\3\0\13\x56\2\65\17\x56\3\0\13\x56\2\55\17\x56\3\0\13\x56\2\44\17\x56\3\0\7\x56\2\70\23\x56\3\0\12\x56\2\42\20\x56\3\0\6\x56\2\x63\4\x56\2\33\20\x56\3\0\12\x56\2\30\20\x56\3\0\4\x56\2\76\6\x56\2\27\2\x5a\17\x56\3\0\4\x56\2\61\26\x56\3\0\3\x56\2\60\27\x56\3\0\11\x56\2\47\21\x56\3\0\11\x56\2\37\21\x56\3\0\11\x56\2\30\21\x56\3\0\6\x56\2\57\24\x56\3\0\7\x56\2\52\23\x56\3\0\7\x56\2\50\2\x56\2\x66\21\x56\3\0\7\x56\2\50\23\x56\3\0\2\x56\2\53\30\x56\3\0\10\x56\2\30\22\x56\3\0\3\x56\2\67\4\x56\2\x7a\2\30\2\x68\21\x56\3\0\7\x56\2\30\21\x56\2\43\2\x56\3\0\6\x56\2\51\2\x86\3\x56\2\x83\20\x56\3\0\6\x56\2\36\24\x56\3\0\6\x56\2\35\24\x56\3\0\2\x56\2\41\17\x56\2\46\11\x56\3\0\5\x56\2\30\25\x56\3\0\5\x56\2\30\4\x56\2\31\13\x56\2\x70\4\x56\2\62\2\x56\3\0\2\x56\2\40\10\x56\2\30\20\x56\3\0\4\x56\2\32\26\x56\3\0\4\x56\2\30\26\x56\3\0\2\x56\2\30\30\x56\3\0\2\x56\2\24\17\x56\2\x61\11\x56\3\0\2\30\31\x56\3\0\2\26\27\x56\2\30\2\x56\3\0\30\x56\52\x9c\2\4\2\12\2\x56\2\20\2\14\2\23\2\x94\2\x81\2\x56\2\x88\2\56\2\x8c\2\x74\2\66\2\63\2\x98\2\x93\2\x56\2\x69\2\x4f\2\x8e\2\x80\5\x56\2\72\3\x56\2\13\2\0\2\21\2\22\7\3\2\2\2\4\2\1\2\10\51\7\2\17", "\1\2\14\2\11\2\4\2\20\2\13\2\16\2\15\2\17\2\1\3\4\2\20\3\0\2\17\2\1\3\20\2\4\7\2\2\1\x82\3\2\12\2\0\2\12\2\0", "\1\13\51\2\1\27\51\2\44\2\52\2\51\2\35\2\47\2\2\2\50\3\51\2\42\2\36\2\51\2\6\2\5\2\43\13\4\3\51\2\40\2\37\2\41\3\51\33\35\4\51\2\46\2\35\2\51\2\14\2\24\2\25\2\26\2\12\2\13\2\22\2\3\2\21\2\51\2\34\2\15\2\32\2\17\2\20\2\23\2\35\2\10\2\16\2\7\2\11\2\27\2\33\2\30\2\31\2\35\2\51\2\45\x84\51"], [this.TABLE._base, this.TABLE._default, this.TABLE._check, this.TABLE._next, this.TABLE._action, this.TABLE._eqc]);

		}

		L.visualbasic.prototype = {

			read_ch : function() {
				if(this.idx >= this.end)
					return this.chr = -1;
				else {
					this.chr = this.src[this.idx++].charCodeAt(0);
					if(this.chr >= 65 && this.chr <= 90)
						this.chr += 32;
					return this.chr;
				}
			},
			do_lex : function() {
				var go_on = true;
				this.idx = 0;
				while(go_on) {
					var yylen = 0;
					var state = this.i_s, action = L.ACT_TYPE.NO_ACTION;
					var pre_idx = this.idx, pre_action = L.ACT_TYPE.NO_ACTION, pre_act_len = 0;

					while(true) {
						if(this.read_ch() < 0) {
							if(pre_action >= 0) {
								action = pre_action;
								yylen = pre_act_len;
								this.idx = pre_idx + pre_act_len;
							} else if(pre_idx < this.end) {
								action = L.ACT_TYPE.UNMATCH_CHAR;
								this.idx = pre_idx + 1;
							}
							if(pre_idx >= this.end) {
								go_on = false;
							}
							break;
						} else {
							yylen++;
						}
						var eqc = this.TABLE._eqc[this.chr];

						if(eqc === undefined) {
							if(pre_action >= 0) {
								action = pre_action;
								yylen = pre_act_len;
								this.idx = pre_idx + pre_act_len;
							} else
								action = L.ACT_TYPE.UNKNOW_CHAR;
							break;
						}
						var offset, next = -1, s = state;

						while(s >= 0) {
							offset = this.TABLE._base[s] + eqc;
							if(this.TABLE._check[offset] === s) {
								next = this.TABLE._next[offset];
								break;
							} else {
								s = this.TABLE._default[s];
							}
						}

						if(next < 0) {
							if(pre_action >= 0) {
								action = pre_action;
								yylen = pre_act_len;
								this.idx = pre_idx + pre_act_len;
							} else {
								action = L.ACT_TYPE.UNMATCH_CHAR;
								this.idx = pre_idx + 1;
							}
							//跳出内层while，执行对应的action动作
							break;
						} else {
							state = next;
							action = this.TABLE._action[next];
							if(action >= 0) {
								/**
								 * 如果action>=0，说明该状态为accept状态。
								 */
								pre_action = action;
								pre_act_len = yylen;
							}
						}
					}

					switch(action) {

						case 1:
							this.yystyle = "keyword";
							break;
						case 11:
							this.yystyle = "string";
							this.yydefault = "string";
							this.yygoto(STRING_A);
							break;
						case 8:
							this.yystyle = "comment";
							this.yydefault = "comment";
							this.yygoto(COMMENT);
							break;
						case 0:
							this.yystyle = "value";
							break;
						case 2:
							this.yystyle = "id";
							break;
						case 3:
							this.yystyle = "operator";
							break;
						case 15:
							this.yystyle = "default";
							break;
						case 10:
							this.yystyle = "comment";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 9:
							this.yystyle = "comment";
							break;
						case 13:
							this.yystyle = "string";
							break;
						case 12:
							this.yystyle = "string";
							break;
						case 14:
							this.yystyle = "string";
							this.yydefault = "defult";
							this.yygoto(DEFAULT);
							break;

						case L.ACT_TYPE.UNKNOW_CHAR:
						case L.ACT_TYPE.UNMATCH_CHAR:
						default :
							this.yystyle = this.yydefault;
							break;
					}
					this.editor.cur_doc.setRangeStyle(pre_idx, yylen, this.yystyle);
				}

			},
			yygoto : function(state) {
				this.i_s = state;
			},
			lex : function() {
				this.src = this.editor.cur_doc.text_array;
				this.end = this.src.length;
				this.i_s = 156;
				this.do_lex();
			}
		}

	})(Daisy.Lexer);

	/**
	 * javascript 词法解析器。
	 * 由AliceLe词法分析器自动生成工具生成
	 */
	(function(L) {
		var DEFAULT = 156, LINE_COMMENT = 157, BLOCK_COMMENT = 158, DOC_COMMENT = 159, STRING_A = 160, STRING_B = 161;
		L.javascript = function(editor) {
			this.editor = editor;
			this.src = null;
			this.theme = editor.theme;
			this.end = 0;
			this.idx = 0;
			this.chr = -1;
			this.i_s = 156;
			this.yydefault = "default";
			this.yystyle = null;
			this.TABLE = {
				_base : (window.Int32Array ? new Int32Array(162) : new Array(162)),
				_default : (window.Int32Array ? new Int32Array(162) : new Array(162)),
				_check : (window.Int32Array ? new Int32Array(4841) : new Array(4841)),
				_next : (window.Int32Array ? new Int32Array(4841) : new Array(4841)),
				_action : (window.Int32Array ? new Int32Array(162) : new Array(162)),
				_eqc : (window.Int32Array ? new Int32Array(256) : new Array(256))
			};

			L.Help._str_to_arr(["\0\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\1\2\2\2\1\1\1\1\1\1\2\1\1\1\11\10\2\1\1\1\30\1\77\x68\1\x91\1\xba\xe3\u010c\u0135\u015e\u0187\u01b0\u01d9\u0202\u022b\u0254\u027d\u02a6\u02cf\u02f8\u0321\u034a\u0373\u039c\u03c5\u03ee\u0417\u0440\u0469\u0492\u04bb\u04e4\u050d\u0536\u055f\u0588\u05b1\u05da\u0603\u062c\u0655\u067e\u06a7\u06d0\u06f9\u0722\u074b\u0774\1\u079d\u07c6\u07ef\u0818\u0841\u086a\u0893\u08bc\u08e5\u090e\u0937\u0960\u0989\u09b2\u09db\u0a04\u0a2d\u0a56\u0a7f\u0aa8\u0ad1\u0afa\u0b23\u0b4c\u0b75\u0b9e\u0bc7\u0bf0\u0c19\u0c42\u0c6b\u0c94\u0cbd\u0ce6\u0d0f\u0d38\u0d61\u0d8a\u0db3\u0ddc\u0e05\u0e2e\u0e57\u0e80\u0ea9\u0ed2\u0efb\u0f24\u0f4d\u0f76\u0f9f\u0fc8\u0ff1\u101a\1\1\u1043\u107b\u10b3\u10eb\1\u1123\u115b\u1194\u11cd\1\u1206\u123f\u1278\u12b1", "\1\43\0\2\24\3\26\2\43\2\0\3\47\2\0\2\52\3\0\2\55\2\0\2\55\54\0\2\55\67\0\3\55\5\0\2\x95\5\0\2\x9b\5\0", "\1\2\x9e\2\47\2\0\2\53\2\34\3\0\2\35\7\0\2\43\2\36\11\0\3\52\2\x94\3\0\2\46\5\0\3\47\2\0\4\47\2\24\2\46\2\26\2\27\2\30\2\31\2\32\2\33\2\25\2\37\2\40\2\44\2\45\3\0\2\41\2\42\3\52\2\0\4\52\2\54\3\0\27\54\2\0\20\54\2\55\3\0\27\55\2\0\20\55\2\57\3\0\27\57\2\0\20\57\2\61\3\0\27\61\2\0\20\61\2\62\3\0\27\62\2\0\20\62\2\63\3\0\27\63\2\0\20\63\2\64\3\0\27\64\2\0\20\64\2\65\3\0\27\65\2\0\20\65\2\66\3\0\27\66\2\0\20\66\2\67\3\0\27\67\2\0\20\67\2\70\3\0\27\70\2\0\20\70\2\71\3\0\27\71\2\0\20\71\2\72\3\0\27\72\2\0\20\72\2\73\3\0\27\73\2\0\20\73\2\74\3\0\27\74\2\0\20\74\2\75\3\0\27\75\2\0\20\75\2\76\3\0\27\76\2\0\20\76\2\77\3\0\27\77\2\0\20\77\2\x40\3\0\27\x40\2\0\20\x40\2\x41\3\0\27\x41\2\0\20\x41\2\x42\3\0\27\x42\2\0\20\x42\2\x43\3\0\27\x43\2\0\20\x43\2\x44\3\0\27\x44\2\0\20\x44\2\x45\3\0\27\x45\2\0\20\x45\2\x46\3\0\27\x46\2\0\20\x46\2\x47\3\0\27\x47\2\0\20\x47\2\x48\3\0\27\x48\2\0\20\x48\2\x49\3\0\27\x49\2\0\20\x49\2\x4a\3\0\27\x4a\2\0\20\x4a\2\x4b\3\0\27\x4b\2\0\20\x4b\2\x4c\3\0\27\x4c\2\0\20\x4c\2\x4d\3\0\27\x4d\2\0\20\x4d\2\x4e\3\0\27\x4e\2\0\20\x4e\2\x4f\3\0\27\x4f\2\0\20\x4f\2\x50\3\0\27\x50\2\0\20\x50\2\x51\3\0\27\x51\2\0\20\x51\2\x52\3\0\27\x52\2\0\20\x52\2\x53\3\0\27\x53\2\0\20\x53\2\x54\3\0\27\x54\2\0\20\x54\2\x55\3\0\27\x55\2\0\20\x55\2\x56\3\0\27\x56\2\0\20\x56\2\x57\3\0\27\x57\2\0\20\x57\2\x58\3\0\27\x58\2\0\20\x58\2\x59\3\0\27\x59\2\0\20\x59\2\x5a\3\0\27\x5a\2\0\20\x5a\2\x5b\3\0\27\x5b\2\0\20\x5b\2\x5d\3\0\27\x5d\2\0\20\x5d\2\x5e\3\0\27\x5e\2\0\20\x5e\2\x5f\3\0\27\x5f\2\0\20\x5f\2\x60\3\0\27\x60\2\0\20\x60\2\x61\3\0\27\x61\2\0\20\x61\2\x62\3\0\27\x62\2\0\20\x62\2\x63\3\0\27\x63\2\0\20\x63\2\x64\3\0\27\x64\2\0\20\x64\2\x65\3\0\27\x65\2\0\20\x65\2\x66\3\0\27\x66\2\0\20\x66\2\x67\3\0\27\x67\2\0\20\x67\2\x68\3\0\27\x68\2\0\20\x68\2\x69\3\0\27\x69\2\0\20\x69\2\x6a\3\0\27\x6a\2\0\20\x6a\2\x6b\3\0\27\x6b\2\0\20\x6b\2\x6c\3\0\27\x6c\2\0\20\x6c\2\x6d\3\0\27\x6d\2\0\20\x6d\2\x6e\3\0\27\x6e\2\0\20\x6e\2\x6f\3\0\27\x6f\2\0\20\x6f\2\x70\3\0\27\x70\2\0\20\x70\2\x71\3\0\27\x71\2\0\20\x71\2\x72\3\0\27\x72\2\0\20\x72\2\x73\3\0\27\x73\2\0\20\x73\2\x74\3\0\27\x74\2\0\20\x74\2\x75\3\0\27\x75\2\0\20\x75\2\x76\3\0\27\x76\2\0\20\x76\2\x77\3\0\27\x77\2\0\20\x77\2\x78\3\0\27\x78\2\0\20\x78\2\x79\3\0\27\x79\2\0\20\x79\2\x7a\3\0\27\x7a\2\0\20\x7a\2\x7b\3\0\27\x7b\2\0\20\x7b\2\x7c\3\0\27\x7c\2\0\20\x7c\2\x7d\3\0\27\x7d\2\0\20\x7d\2\x7e\3\0\27\x7e\2\0\20\x7e\2\x7f\3\0\27\x7f\2\0\20\x7f\2\x80\3\0\27\x80\2\0\20\x80\2\x81\3\0\27\x81\2\0\20\x81\2\x82\3\0\27\x82\2\0\20\x82\2\x83\3\0\27\x83\2\0\20\x83\2\x84\3\0\27\x84\2\0\20\x84\2\x85\3\0\27\x85\2\0\20\x85\2\x86\3\0\27\x86\2\0\20\x86\2\x87\3\0\27\x87\2\0\20\x87\2\x88\3\0\27\x88\2\0\20\x88\2\x89\3\0\27\x89\2\0\20\x89\2\x8a\3\0\27\x8a\2\0\20\x8a\2\x8b\3\0\27\x8b\2\0\20\x8b\2\x8c\3\0\27\x8c\2\0\20\x8c\2\x8d\3\0\27\x8d\2\0\20\x8d\2\x8e\3\0\27\x8e\2\0\20\x8e\2\x8f\3\0\27\x8f\2\0\20\x8f\2\x90\3\0\27\x90\2\0\20\x90\2\x91\3\0\27\x91\2\0\20\x91\2\x92\3\0\27\x92\2\0\20\x92\71\x95\71\x96\71\x97\71\x98\71\x9a\71\x9b\72\x9c\72\x9d\72\x9f\72\xa0\72\xa1\72\xa2", "\1\2\11\2\47\2\0\2\7\2\1\3\0\2\36\7\0\2\24\2\34\11\0\2\52\2\51\2\35\3\0\2\43\5\0\3\47\2\0\4\47\3\3\2\7\2\26\5\7\2\2\2\12\2\14\2\30\2\7\3\0\2\16\2\21\3\52\2\0\4\52\2\x5c\3\0\27\x5c\2\0\12\x5c\2\x8a\7\x5c\3\0\27\x5c\2\0\21\x5c\3\0\14\x5c\2\x5d\13\x5c\2\0\21\x5c\3\0\4\x5c\2\x93\23\x5c\2\0\21\x5c\3\0\4\x5c\2\x91\23\x5c\2\0\21\x5c\3\0\2\x8f\26\x5c\2\0\21\x5c\3\0\3\x5c\2\x8e\24\x5c\2\0\21\x5c\3\0\2\x5c\2\x8d\15\x5c\2\x42\10\x5c\2\0\21\x5c\3\0\5\x5c\2\x8b\22\x5c\2\0\21\x5c\3\0\6\x5c\2\x90\21\x5c\2\0\21\x5c\3\0\7\x5c\2\x93\20\x5c\2\0\21\x5c\3\0\7\x5c\2\x8e\20\x5c\2\0\21\x5c\3\0\3\x5c\2\x88\2\x73\23\x5c\2\0\21\x5c\3\0\10\x5c\2\x8e\17\x5c\2\0\21\x5c\3\0\7\x5c\2\x86\20\x5c\2\0\21\x5c\3\0\11\x5c\2\x92\16\x5c\2\0\21\x5c\3\0\2\x5c\2\x82\25\x5c\2\0\21\x5c\3\0\2\x80\26\x5c\2\0\21\x5c\3\0\12\x5c\2\x93\15\x5c\2\0\21\x5c\3\0\11\x5c\2\x7d\16\x5c\2\0\21\x5c\3\0\13\x5c\2\x87\14\x5c\2\0\21\x5c\3\0\13\x5c\2\x81\14\x5c\2\0\21\x5c\3\0\5\x5c\2\x7b\22\x5c\2\0\21\x5c\3\0\11\x5c\2\x7a\16\x5c\2\0\21\x5c\3\0\12\x5c\2\x79\15\x5c\2\0\21\x5c\3\0\15\x5c\2\x82\12\x5c\2\0\21\x5c\3\0\2\x76\26\x5c\2\0\21\x5c\3\0\11\x5c\2\x75\16\x5c\2\0\21\x5c\3\0\15\x5c\2\x74\12\x5c\2\0\21\x5c\3\0\11\x5c\2\x72\16\x5c\2\0\21\x5c\3\0\14\x5c\2\x70\13\x5c\2\0\21\x5c\3\0\13\x5c\2\x6f\14\x5c\2\0\21\x5c\3\0\6\x5c\2\x6d\21\x5c\2\0\21\x5c\3\0\2\x5c\2\x6c\25\x5c\2\0\21\x5c\3\0\6\x5c\2\x6b\21\x5c\2\0\21\x5c\3\0\6\x5c\2\x6a\21\x5c\2\0\21\x5c\3\0\2\x5c\2\x69\25\x5c\2\0\21\x5c\3\0\2\x5c\2\x68\25\x5c\2\0\21\x5c\3\0\11\x5c\2\x65\16\x5c\2\0\21\x5c\3\0\2\x5c\2\x64\25\x5c\2\0\21\x5c\3\0\27\x5c\2\0\4\x5c\2\x62\15\x5c\3\0\27\x5c\2\0\2\x5c\2\x61\17\x5c\3\0\27\x5c\2\0\11\x5c\2\x67\10\x5c\3\0\2\x5f\26\x5c\2\0\21\x5c\3\0\27\x5c\2\0\14\x5c\2\x67\5\x5c\3\0\27\x5c\2\0\16\x5c\2\x7f\3\x5c\3\0\3\x5c\2\x5b\24\x5c\2\0\21\x5c\3\0\11\x5c\2\x59\16\x5c\2\0\21\x5c\3\0\27\x5c\2\0\10\x5c\2\x58\3\x5c\2\x5a\2\x5c\2\x67\4\x5c\3\0\4\x5c\2\x57\23\x5c\2\0\21\x5c\3\0\27\x5c\2\0\3\x5c\2\x56\16\x5c\3\0\27\x5c\2\0\5\x5c\2\55\14\x5c\3\0\2\x55\26\x5c\2\0\21\x5c\3\0\13\x5c\2\x54\14\x5c\2\0\21\x5c\3\0\27\x5c\2\0\2\x5c\2\55\17\x5c\3\0\20\x5c\2\x94\7\x5c\2\0\21\x5c\3\0\23\x5c\2\x53\4\x5c\2\0\21\x5c\3\0\2\x5c\2\x51\25\x5c\2\0\21\x5c\3\0\2\x5c\2\x50\25\x5c\2\0\21\x5c\3\0\24\x5c\2\55\3\x5c\2\0\21\x5c\3\0\24\x5c\2\54\3\x5c\2\0\21\x5c\3\0\4\x5c\2\x4e\23\x5c\2\0\21\x5c\3\0\21\x5c\2\60\6\x5c\2\0\21\x5c\3\0\16\x5c\2\x4d\11\x5c\2\0\21\x5c\3\0\2\x4c\26\x5c\2\0\21\x5c\3\0\17\x5c\2\60\10\x5c\2\0\21\x5c\3\0\13\x5c\2\x4b\4\x5c\2\x7c\10\x5c\2\0\21\x5c\3\0\12\x5c\2\x4a\15\x5c\2\0\21\x5c\3\0\16\x5c\2\60\11\x5c\2\0\21\x5c\3\0\16\x5c\2\55\11\x5c\2\0\21\x5c\3\0\14\x5c\2\x48\13\x5c\2\0\21\x5c\3\0\13\x5c\2\x47\14\x5c\2\0\21\x5c\3\0\15\x5c\2\57\12\x5c\2\0\21\x5c\3\0\11\x5c\2\x46\16\x5c\2\0\21\x5c\3\0\4\x5c\2\x44\23\x5c\2\0\21\x5c\3\0\2\x43\26\x5c\2\0\21\x5c\3\0\13\x5c\2\x41\14\x5c\2\0\21\x5c\3\0\13\x5c\2\71\14\x5c\2\0\21\x5c\3\0\4\x5c\2\x40\23\x5c\2\0\21\x5c\3\0\4\x5c\2\77\23\x5c\2\0\21\x5c\3\0\4\x5c\2\75\23\x5c\2\0\21\x5c\3\0\3\x5c\2\76\24\x5c\2\0\21\x5c\3\0\11\x5c\2\64\16\x5c\2\0\21\x5c\3\0\11\x5c\2\60\16\x5c\2\0\21\x5c\3\0\3\x5c\2\x49\3\x5c\2\74\7\x5c\2\x90\12\x5c\2\0\21\x5c\3\0\7\x5c\2\73\13\x5c\2\x7f\5\x5c\2\0\21\x5c\3\0\6\x5c\2\73\7\x5c\2\x45\12\x5c\2\0\21\x5c\3\0\10\x5c\2\61\17\x5c\2\0\21\x5c\3\0\10\x5c\2\56\17\x5c\2\0\21\x5c\3\0\7\x5c\2\70\20\x5c\2\0\21\x5c\3\0\6\x5c\2\63\21\x5c\2\0\21\x5c\3\0\3\x5c\2\66\24\x5c\2\0\21\x5c\3\0\5\x5c\2\62\22\x5c\2\0\21\x5c\3\0\5\x5c\2\60\4\x5c\2\60\16\x5c\2\0\21\x5c\3\0\3\x5c\2\61\24\x5c\2\0\21\x5c\3\0\4\x5c\2\60\23\x5c\2\0\21\x5c\3\0\4\x5c\2\55\23\x5c\2\0\21\x5c\3\0\2\x5c\2\60\25\x5c\2\0\21\x5c\3\0\2\x5c\2\55\25\x5c\2\0\21\x5c\3\0\2\55\26\x5c\2\0\20\x5c\61\x99\2\46\5\x99\2\x9a\52\x99\2\x95\11\x99\2\46\5\x99\2\x9a\20\x99\2\x96\32\x99\2\x95\11\x99\2\46\5\x99\2\x9a\20\x99\2\x96\16\x99\2\x97\14\x99\2\x95\11\x99\2\46\5\x99\2\x9a\63\x99\2\x98\5\x99\2\x9a\3\x99\71\x9b\61\x99\2\25\2\4\10\x99\2\10\2\52\2\50\2\53\2\65\2\x7e\2\x78\2\x84\2\x83\3\x5c\2\x6e\2\72\2\x77\2\x8c\2\x85\2\x5c\2\x71\2\x5c\2\x4f\2\x5c\2\67\2\x52\2\x5c\2\x89\2\x66\2\10\2\x60\5\x5c\2\x63\2\x5e\3\52\2\x5c\4\52\3\x5c\2\27\2\44\2\31\2\45\2\32\2\33\2\7\2\x9c\4\7\3\10\2\6\2\5\61\13\2\37\11\13\61\15\2\40\11\15\2\20\66\17\2\41\2\20\2\17\2\23\66\22\2\42\2\22\2\23", "\1\2\4\2\15\2\20\2\7\2\25\2\21\2\6\2\31\2\10\2\13\2\14\2\16\2\17\2\23\2\22\2\24\2\27\2\26\2\30\2\20\2\12\7\6\4\0\2\14\2\17\2\22\2\26\2\20\3\31\2\20\2\1\2\31\2\0\2\1\2\6\3\4\2\3\3\2\x63\5\2\1\2\5\5\20\3\0\2\11\2\6\2\0\2\11\5\0", "\1\13\66\2\1\27\66\2\63\2\70\2\66\2\52\2\65\2\57\2\71\3\66\2\61\2\55\2\66\2\4\2\3\2\62\2\2\2\46\2\44\2\43\3\2\2\47\2\2\2\50\2\2\3\66\2\56\2\53\2\54\3\66\2\27\2\45\2\52\2\31\2\36\4\52\2\42\6\52\2\32\3\52\2\34\2\41\10\52\2\66\2\67\2\66\2\64\2\52\2\66\2\12\2\24\2\20\2\16\2\10\2\11\2\35\2\23\2\17\2\33\2\25\2\13\2\51\2\15\2\21\2\40\2\52\2\6\2\14\2\5\2\7\2\26\2\22\2\37\2\30\2\52\2\66\2\60\x84\66"], [this.TABLE._base, this.TABLE._default, this.TABLE._check, this.TABLE._next, this.TABLE._action, this.TABLE._eqc]);

		}
		L.javascript.prototype = {

			read_ch : function() {
				if(this.idx >= this.end)
					return this.chr = -1;
				else {

					return this.chr = this.src[this.idx++].charCodeAt(0);
					/*
					 this.chr = this.src[this.idx++].charCodeAt(0);
					 if(this.chr>=65&&this.chr<=90)
					 this.chr += 32;
					 return this.chr;
					 */
				}
			},
			do_lex : function() {
				var go_on = true;
				this.idx = 0;
				while(go_on) {
					var yylen = 0;
					var state = this.i_s, action = L.ACT_TYPE.NO_ACTION;
					var pre_idx = this.idx, pre_action = L.ACT_TYPE.NO_ACTION, pre_act_len = 0;

					while(true) {
						if(this.read_ch() < 0) {
							if(pre_action >= 0) {
								action = pre_action;
								yylen = pre_act_len;
								this.idx = pre_idx + pre_act_len;
							} else if(pre_idx < this.end) {
								action = L.ACT_TYPE.UNMATCH_CHAR;
								this.idx = pre_idx + 1;
							}
							if(pre_idx >= this.end) {
								go_on = false;
							}
							break;
						} else {
							yylen++;
						}
						var eqc = this.TABLE._eqc[this.chr];

						if(eqc === undefined) {
							if(pre_action >= 0) {
								action = pre_action;
								yylen = pre_act_len;
								this.idx = pre_idx + pre_act_len;
							} else
								action = L.ACT_TYPE.UNKNOW_CHAR;
							break;
						}
						var offset, next = -1, s = state;

						while(s >= 0) {
							offset = this.TABLE._base[s] + eqc;
							if(this.TABLE._check[offset] === s) {
								next = this.TABLE._next[offset];
								break;
							} else {
								s = this.TABLE._default[s];
							}
						}

						if(next < 0) {
							if(pre_action >= 0) {
								action = pre_action;
								yylen = pre_act_len;
								this.idx = pre_idx + pre_act_len;
							} else {
								action = L.ACT_TYPE.UNMATCH_CHAR;
								this.idx = pre_idx + 1;
							}
							//跳出内层while，执行对应的action动作
							break;
						} else {
							state = next;
							action = this.TABLE._action[next];
							if(action >= 0) {
								/**
								 * 如果action>=0，说明该状态为accept状态。
								 */
								pre_action = action;
								pre_act_len = yylen;
							}
						}
					}

					switch(action) {

						case 3:
							this.yystyle = "object";
							break;
						case 2:
							this.yystyle = "param";
							break;
						case 12:
							this.yystyle = "doccomment";
							this.yydefault = "doccomment";
							this.yygoto(DOC_COMMENT);
							break;
						case 15:
							this.yystyle = "regexp";
							break;
						case 6:
							this.yystyle = "comment";
							this.yydefault = "comment";
							this.yygoto(LINE_COMMENT);
							break;
						case 9:
							this.yystyle = "comment";
							this.yydefault = "comment";
							this.yygoto(BLOCK_COMMENT);
							break;
						case 1:
							this.yystyle = "keyword";
							break;
						case 20:
							this.yystyle = "string";
							this.yydefault = "string";
							this.yygoto(STRING_B);
							break;
						case 16:
							this.yystyle = "string";
							this.yydefault = "string";
							this.yygoto(STRING_A);
							break;
						case 4:
							this.yystyle = "id";
							break;
						case 5:
							this.yystyle = "operator";
							break;
						case 0:
							this.yystyle = "value";
							break;
						case 24:
							this.yystyle = "default";
							break;
						case 7:
							this.yystyle = "comment";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 8:
							this.yystyle = "comment";
							break;
						case 10:
							this.yystyle = "comment";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 11:
							this.yystyle = "comment";
							break;
						case 13:
							this.yystyle = "doccomment";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 14:
							this.yystyle = "doccomment";
							break;
						case 18:
							this.yystyle = "string";
							break;
						case 17:
							this.yystyle = "string";
							break;
						case 19:
							this.yystyle = "string";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;
						case 22:
							this.yystyle = "string";
							break;
						case 21:
							this.yystyle = "string";
							break;
						case 23:
							this.yystyle = "string";
							this.yydefault = "default";
							this.yygoto(DEFAULT);
							break;

						case L.ACT_TYPE.UNKNOW_CHAR:
						case L.ACT_TYPE.UNMATCH_CHAR:
						default :
							this.yystyle = this.yydefault;
							break;
					}
					this.editor.cur_doc.setRangeStyle(pre_idx, yylen, this.yystyle);
				}

			},
			yygoto : function(state) {
				this.i_s = state;
			},
			lex : function() {
				this.src = this.editor.cur_doc.text_array;
				this.end = this.src.length;
				this.i_s = 156;
				this.do_lex();
			}
		}

	})(Daisy.Lexer);


;
	/**
	 * aptana 3 的主题
	 */
	Daisy.Theme.aptana3 = {
		global : {
			font : '20px consolas',
			background : 'black',
			color : 'white'
		},
		caret : {
			color:'rgba(255,255,255,0.8)'
		},
		selection : {
			background : 'rgba(160,160,160,0.5)'
		},
		current_line : {
			background : 'rgba(210,210,210,0.1)'
		},
		styles : {
			'general' : {
				/**
				 * nothing, just use global.
				 */
			},
			'javascript' :
			 {
				keyword : {color:'#F9EE98'},
				value : {color:'#B4431F'},
				comment : {color: '#5f5a60', italic : true},
				operator: {color: '#CDA869'},
				string : {color:'#8f9d6a'},
				regexp : {color:'#E9C062',bold:true},
				id : {color:'white'},
				object : {color:'#9E89A0'}	,
				param : {color:'#7587A6',italic:true}	
			},
			'visualbasic' :
			{
				keyword : {color:'#F9EE98'},
				value : {color:'#B4431F'},
				comment : {color: '#5f5a60', italic : true},
				operator: {color: '#CDA869'},
				string : {color:'#8f9d6a'},
				id : {color:'white'}
			}
		}
	}

	/**
	 * notepad++的默认主题
	 */
	Daisy.Theme.notepadplusplus = {
		global : {
			font : '20px Courier New',
			background : '#F2F4FF',
			color : 'black'
		},
		caret : {
			color:'rgba(128,0,255,1)'
		},
		selection : {
			background : 'rgba(192,192,192,1)'
		},
		current_line : {
			background : 'rgba(232,232,255,1)'
		},
		styles : {
			'general' : {
				/**
				 * nothing, just use global.
				 */
			},
			'javascript' :
			 {
				keyword : {color:'#000080',italic:true,bold:true},
				value : {color:'#FF0000'},
				comment : {color: '#008000'},
				doccomment : {color:"#008080"},
				operator: {color:'black'},
				string : {color:'#808080'},
				regexp : {color:'#8000FF'},
				id : {color:'black'},
				object : {color:'#275391'}	,
				param : {color:'#275391',italic:true}	
			},
			'visualbasic' :
			{
				keyword : {color:'#0000FF'},
				value : {color:'#ff0000'},
				comment : {color: '#008000'},
				operator: {color: '#000000'},
				string : {color:'#808080'},
				id : {color:'black'}
			}
		}
	}


})(Daisy,Daisy.$);