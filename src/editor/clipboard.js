(function(Daisy, $) {
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
		if(C.__instance__ === null)
			C.__instance__ = new C();
		return C.__instance__;
	}
})(Daisy, Daisy.$);
