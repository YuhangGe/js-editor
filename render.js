if(typeof Daisy==='undefined')
	Daisy = {};
	
(function(Daisy){
	Daisy._Render = function(editor){
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
		this.buffer_width = this.page_width*3;
		this.buffer_height = this.page_height*3;

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
			var ele = document.createElement("span"),h=0;
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
		getCharWidth :function(chr,index){
			var bold = this.styles[this.doc.style_array[index]].bold;
			this.ctx.font = (bold?'Bold ':'')+this.theme.font;
			return this.ctx.measureText(chr).width
		},
		getTextWidth_2 : function(text,index){
			if(text.length === 0)
				return 0;
			var w = 0,a=0,b=0, pre=false,len = text.length,s=this.doc.style_array[index];
			pre = this.styles[s].bold;
			b = 1;
			var i = 1;
				while(i<len){
					s = this.doc.style_array[i+index];
					
					if(this.styles[s].bold == pre){
						b++;
						
					}else{
						w += this._getTextWidth(text.substr(a,b),pre);
						//$.log(a+","+b);
						pre = this.styles[s].bold;
						b = 1;
						a = i;
					}
					i++;
				}

							w += this._getTextWidth(text.substr(a,b),pre);;
							//$.log(a+","+b);
	
						
				
			return w;
		},
		_getTextWidth : function(text,bold){
			this.ctx.font = (bold?'Bold ':'')+this.theme.font;
			return this.ctx.measureText(text).width
		},
		getTextWidth : function(text){
			return this.ctx.measureText(text).width;
		},
		resetContentSize : function(){
			/**
			 * 重新设置内容大小。比如当最长的一行长度发生变化，或者行数发生变化时，
			 * 需要重新设置新的滚动值（scroll_top,scroll_left）等。
			 */
			var c_height = this.doc.line_number * this.line_height,
				c_width = this.doc.max_width_line.width;

			this.content_width  = c_width>this.width?c_width:this.width;
			this.content_height = c_height>this.height?c_height:this.height;
			this.max_scroll_left = this.content_width - this.width;
			this.max_scroll_top = this.content_height - this.height;
			this.editor.bottom_scroll_body.style.width = c_width+"px";
			this.editor.right_scroll_body.style.height = c_height+"px";
			/**
			 * 还需要设置字符区域的大小。见函数注释.
			 */
			this.resetRegion();
		},
		_paintSelect : function(select_range){
			var f=select_range.from,t=select_range.to,lines=this.doc.line_info,t_arr=this.doc.text_array;
			var s,s_colum,s_index,e,e_colum,e_index;
			var left = -this.region.left, 
				top = this.line_height + cur_line*this.line_height - this.region.top;
			if(f.line<this.region.start_line){
				s = this.region.start_line;
				s_colum = -1;
				s_index = lines[s].start + 1;//注意line_info中的start代表该行的前一个字符的位置，因此第一个字符的索引要加1
			}else{
				s = f.line;
				s_colum = f.colum;
				s_index = f.index+1;//f.index加1，因为指代的是之前字符。见document.js中select_range注释
				//$.log(s_l)
			}
			if(t.line>this.region.end_line){
				e = this.region.end_line;
				e_colum = lines[e].length;
				e_index = lines[e].start + lines[e].length+1;//注意line_info中的start代表该行的前一个字符的位置，因此第一个字符的索引要加1
				
			}else{
				e = t.line;
				e_colum = t.colum;
				e_index = t.index;//t.colum不要加1，见document.js中select_range注释
			}
			
			this.ctx.fillStyle = this.theme.selection.background;
			if(s===e){
				$.dprint("%d %d %d %d",s,s_index,e,e_index);
				var lt =t_arr.slice(), st = t_arr.slice(s_index,e_index).join("");
				var left = this.getTextWidth_2()
				var cw = this.getTextWidth_2(txt,s_index);
				this.ctx.fillRect();
			}else{
				
				
			}
				
			
		},
		paint : function(){
			var f_time=new Date().getTime();
			
			this.ctx.fillStyle = this.theme.background;
			this.ctx.fillRect(0,0,this.buffer_width,this.buffer_height);
			
			this.ctx.font = this.theme.font;
			this.ctx.textAlign = "start";
			this.ctx.textBaseline = 'bottom';//'middle';
		
				
			//$.log(this.region);	

			
			var cur_line = this.region.start_line,
				left = -this.region.left, 
				top = this.line_height + cur_line*this.line_height - this.region.top;
		
			
				
			for(var l=this.region.start_line;l<=this.region.end_line;l++){
				var line = this.doc.line_info[l];
				
				for(var i = line.start+1;i<=line.start+line.length;i++){
					var t=this.doc.text_array[i],c = this.doc.style_array[i],s = this.styles[c];
					if(s.italic||s.bold){
						this.ctx.font = (s.bold?'bold ':'')+(s.italic?'italic ':'')+ this.theme.font;
					}else{
						this.ctx.font = this.theme.font;
					}
					
					
					var cw = this.ctx.measureText(t).width;
					/**
					 * 只绘制缓冲区region内的字符。
					 */
					if(left +cw >0){
					
						this.ctx.fillStyle = s.color;
					 	this.ctx.fillText(t, left, top);
					 	if(left>this.region.width){
					 		break;
						}
					}
					left += cw;
				}
				top+=this.line_height;
				left = -this.region.left;
				
			}

			$.log("paint time: "+(new Date().getTime()-f_time));
		},
		resetRegion : function(){
			/*
			 * 设置显示字符区域。通常在document中的内容发生变化（添加删除）后调用。
			 * 包括重新设置显示的行等信息。
			 */
			var lines = this.doc.line_info,	len= lines.length,
				ls = Math.floor(this.region.top / this.line_height),
				le = Math.floor(this.region.bottom/this.line_height),
				ls = len>ls?ls:len,
				le = len>le?le:len-1;
			
			this.region.start_line = ls;
			this.region.end_line = le;

		},
		scrollLeft : function(value){
			var page = Math.floor(value / this.page_width);
			this.left_page_offset = value - page*this.page_width;
			if(page !== this.left_page_size ){
				this.left_page_size = page;
				this.region.left = page*this.page_width;
				this.region.right = this.region.left+this.buffer_width;
				//$.log("paint left buffer:"+page);
				this.paint();
			}
		},
		scrollTop : function(value){
			//$.log("ppp");
			var page = Math.floor(value / this.page_height);
			//$.log("page:"+page);
			this.top_page_offset = value % this.page_height;
			if(page !== this.top_page_size){
				this.top_page_size = page;
				this.region.top = page*this.page_height;
				this.region.bottom = this.region.top+this.buffer_height;
				this.resetRegion();
				//$.log("paint top buffer:"+page);
				
				this.paint();
			}
			
		}
	}
})(Daisy);
