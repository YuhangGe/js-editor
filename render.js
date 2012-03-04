if(typeof Daisy==='undefined')
	Daisy = {};
	
(function(Daisy){
	Daisy._Render = function(editor){
		this.editor = editor;
		this.ctx = editor.ctx;
		this.theme = editor.theme;
		this.doc = editor.doc;
		this.palete = ['black'];
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
		getTextWidth : function(text){
			return this.ctx.measureText(text).width;
		},
		resetContentSize : function(){
			
			var c_height = this.doc.line_number * this.line_height,
				c_width = this.doc.max_width_line.width;

			this.content_width  = c_width>this.width?c_width:this.width;
			this.content_height = c_height>this.height?c_height:this.height;
			this.max_scroll_left = this.content_width - this.width;
			this.max_scroll_top = this.content_height - this.height;
			this.editor.bottom_scroll_body.style.width = c_width+"px";
			this.editor.right_scroll_body.style.height = c_height+"px";
			this.resetRegion();
		},
		paint : function(){
			
			
			this.ctx.clearRect(0,0,this.buffer_width,this.buffer_height);
			
			this.ctx.font = this.theme.font;
			this.ctx.textAlign = "start";
			this.ctx.textBaseline ='middle';
		
			//if(this.editor.select_mode === true)
				//this.renderSelection();
			
			//$.log(this.region);	

			
			var cur_line = this.region.start_line,
				left = -this.region.left, 
				top = this.line_height/2-this.region.top+cur_line*this.line_height;
			
			var lex_time = 0;
			
			//var f_time=new Date().getTime();
			
			for(var l=this.region.start_line;l<=this.region.end_line;l++){
				var line = this.doc.line_info[l];
				
				for(var i = line.start+1;i<=line.start+line.length;i++){
					var c = this.doc.color_array[i],t=this.doc.text_array[i];
					if(c>=0)
						this.ctx.fillStyle = this.palete[c];
					else
						this.ctx.fillStyle = 'black';
					var cw = this.ctx.measureText(t).width;
					if(left +cw >0){
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

			//$.log("paint time: "+(new Date().getTime()-f_time));
		},
		resetRegion : function(){
			
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
