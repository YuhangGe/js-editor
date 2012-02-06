if(typeof Daisy==='undefined')
	Daisy = {};
	
(function(Daisy){
	Daisy._Render = function(editor){
		this.editor = editor;
		this.ctx = editor.ctx;
		this.theme = editor.theme;
		this.doc = editor.doc;
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
		this.region = {
			left : 0,
			top : 0,
			right : this.buffer_width,
			bottom : this.buffer_height,
			start_line : 0,
			start_index : 0,
			end_line : Math.floor(this.buffer_height/this.line_height),
			end_index : 0,
			width : this.buffer_width,
			height : this.buffer_height
		};
		
		this.ctx.font = this.theme.font;
		this.line_height = this._getLineHeight();
		
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
		_getStartIndex : function(start_line,end_line){
			var lines = this.doc.line_info,
				len= lines.length,
				ls = len>start_line?start_line:len;
			return  lines[ls].start+1;
		},
		_getEndIndex : function(end_line){
			var lines = this.doc.line_info,
				len= lines.length,
				le = len>end_line?end_line:len-1;
			//$.log(le);
			//$.log(lines)
			//$.log(lines.length);
			return lines[le].start+lines[le].length;
		},
		getTextWidth : function(text){
			return this.ctx.measureText(text).width;
		},
		setContentSize : function(c_width,c_line){
			var c_height = c_line * this.line_height;
			
			this.content_width  = c_width>this.width?c_width:this.width;
			this.content_height = c_height>this.canvas_height?c_height:this.height;
			this.max_scroll_left = this.content_width - this.width;
			this.max_scroll_top = this.content_height - this.height;
			this.editor.bottom_scroll_body.style.width = c_width+"px";
			this.editor.right_scroll_body.style.height = c_height+"px";
			
			this.resetRegionIndex();
			//$.log(c_width+","+c_height);
		},
		paint : function(){
			
			
			this.ctx.clearRect(0,0,this.buffer_width,this.buffer_height);
			
			this.ctx.font = this.theme.font;
			this.ctx.fillStyle = this.theme.color;
			this.ctx.textAlign = "start";
			this.ctx.textBaseline ='middle';
		
			//if(this.editor.select_mode === true)
				//this.renderSelection();
			
			//$.log(this.region);	
			//$.log(this.editor.line_number);
			//$.log(this.region.line_start);
			
			
			var cur_line = this.region.start_line,
				left = -this.region.left, 
				top = this.line_height/2-this.region.top+cur_line*this.line_height;
			
			//$.log("ls:"+ls+", le:"+le);
			this.lexer.start();
			
			var lex_time = 0;
			
			var f_time=new Date().getTime();
			
			
			out_lex: 
			while(this.lexer.hasMore()){
				var ff = new Date().getTime();
				var sr = this.lexer.lex(),
					i=sr.start+1,e=i+sr.length-1;
				//$.log(sr);
				lex_time+=(new Date().getTime()-ff);
				
				if(e<this.region.start_index || i>this.region.end_index)
					continue;
				if(i<this.region.start_index)
					i=this.region.start_index;
				if(e>this.region.end_index)
					e=this.region.end_index;
				
				//$.log("i:"+i+",e:"+e)
				//$.log(sr);
				/*
				 * if(sr.style.bold)
				 * 	...
				 * todo.
				 * 
				 */
				
				
				this.ctx.fillStyle = sr.style.color?sr.style.color:this.theme.color;
				//$.log(this.ctx.fillStyle);
				
				for(;i<=e;i++){
					
					var c = this.doc.text_array[i];
					
					//$.log(c);
					if(c === '\n') {
						top += this.line_height;
						left =  - this.region.left;
					} else {
						var cw = this.ctx.measureText(c).width;
						if(left +cw >0){
					 		this.ctx.fillText(c, left, top);
					 		//if(left>this.region.width){
					 			//i = this.editor.line_info[]
							//}
						}
						left += cw;
					}
				}
			}
			
			//$.log("lex time:"+lex_time);
			//$.log("paint time: "+(new Date().getTime()-f_time));
		},
		resetRegionIndex : function(){
			//$.log(this.region);
			this.region.start_line = Math.floor(this.region.top / this.line_height);
			this.region.end_line = Math.floor(this.region.bottom/this.line_height);
			this.region.start_index = this._getStartIndex(this.region.start_line);
			this.region.end_index = this._getEndIndex(this.region.end_line);
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
				this.resetRegionIndex();
				//$.log("paint top buffer:"+page);
				
				this.paint();
			}
			
		}
	}
})(Daisy);
