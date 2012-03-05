if(typeof Daisy==='undefined')
	Daisy = {};
if(typeof Daisy.Theme === 'undefined')
	Daisy.Theme = {};
	
(function(D,T){
	T.Daisy = {
		font : '20px 宋体',
		background : 'black',
		caret_color : 'rgba(255,255,255,0.8)',
		select_background : 'rgba(0,0,255,0.4)',
	/*	styles:[{name:'default',value:'white'},
			{name:'keyword',value:'#cda869'},
			{name:'value',value:'#FF0000'},
			{name:'comment',value:'#008000'},
			{name:'object',value:'purple'},
			{name:'operator',value:'#000080'},
			{name:'string',value:'#8f9d6a'},
			{name:'regexp',value:'#8000FF'},
			{name:'id',value:'white'}] */
		styles : {
			'default' : {color:'white'},
			'keyword' : {color:'#cda869'},
			'value' : {color:'red'},
			'comment' : {color: '#008000', italic : true},
			'operator': {color: '#000080'},
			'string' : {color:'#8f9d6a'},
			'regexp' : {color:'#8000ff',bold:true},
			'id' : {color:'white'}			
		}
	}
})(Daisy,Daisy.Theme);