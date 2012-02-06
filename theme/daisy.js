if(typeof Daisy==='undefined')
	Daisy = {};
if(typeof Daisy.Theme === 'undefined')
	Daisy.Theme = {};
	
(function(D,T){
	T.Daisy = {
		color : 'black',
		font : '18px 宋体',
		font_name : '宋体',
		font_size : 16,
		background : 'white',
		select_background : 'rgba(0,0,255,0.4)',
		colors:[{name:'default',value:'black'},
			{name:'number',value:'red'},
			{name:'word',value:'green'},
			{name:'operator',value:'blue'}]
	}
})(Daisy,Daisy.Theme);