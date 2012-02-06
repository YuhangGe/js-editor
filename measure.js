if( typeof Daisy === 'undefined')
	Daisy = {};
	
Daisy._Measure = function(editor){
	this.editor = editor;
	this.line_buffer = [];
}

Daisy._Measure.prototype = {
		/**
		 * 计算当前文本区的长和宽(canvas_width,canvas_height)，
		 * 同时得到每一行的信息，包括该行的起始位置，该行的长度。
		 */
		refresh : function() {
			var k = 0, w = 0, len = this.editor.doc.text_array.length,
				line_number = 0, s = 0;
			
			for(var i = 0; i < len + 1; i++) {
				var c = this.editor.doc.text_array[i];
				/*
				 * 注意上面的循环，i<len+1，循环到最后的时候数组越界，会返回c=null
				 * 这样做是为了相当于在文本末尾添加了eof，便于统一地处理每一行的信息
				 */
				if(c === '\n' || c == null) {
					line_number++;
					
					var line_width = 0;
			
					if(k > 0) {
						this.line_buffer.length = k;
						//$.log(tmp_s);
						line_width = this.editor.render.getTextWidth(this.line_buffer.join(""));
						//$.log("tmp_w:"+tmp_w);
						if(line_width > w)
							w = line_width;
					}
					this.editor.doc.line_info[line_number - 1] = {
						start : s - 1,
						length : k,
						width : line_width
					};
					k = 0;
					s = i+1;
				} else {
					this.line_buffer[k] = c;
					if(k === 0)
						s = i;
					k++;
				}
			}
			this.editor.doc.line_number = line_number;
			this.editor.render.setContentSize(w,line_number);
		/*	var h = line_number * this.line_height;
			w = w>this.canvas_width?w:this.canvas_width;
			h = h>this.canvas_height?h:this.canvas_height;
			this.render.setContentSize(w,h);
			
			this.bottom_scroll_body.style.width = w+"px";
			this.right_scroll_body.style.height = h+"px";
			$.log("w:"+w); */
		}
}
