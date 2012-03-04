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
		colors:[{name:'default',value:'#000000'},
			{name:'keyword',value:'#000080'},
			{name:'value',value:'#FF0000'},
			{name:'comment',value:'#008000'},
			{name:'object',value:'purple'},
			{name:'operator',value:'#000080'},
			{name:'string',value:'#8f9d6a'},
			{name:'regexp',value:'#8000FF'},
			{name:'id',value:'#000000'}]
	}
})(Daisy,Daisy.Theme);