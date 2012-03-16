if(typeof Daisy==='undefined')
	Daisy = {};
if(typeof Daisy.Theme === 'undefined')
	Daisy.Theme = {};
	/dsdsd/g
	A=10;
(function(D,T){  
	T.Daisy = {
		font : '20px consolas',
		background : 'black',
		caret_color : 'rgba(255,255,255,0.8)',
		selection : {
			background : 'rgba(200,200,200,0.4)'
		},
		current_line : {
			background : 'rgba(200,200,200,0.1)'
		},
		
		styles : {
			'default' : {color:'white'},
			'keyword' : {color:'#F9EE98'},
			'value' : {color:'#B4431F'},
			'comment' : {color: '#5f5a60', italic : true},
			'operator': {color: '#CDA869'},
			'string' : {color:'#8f9d6a'},
			'regexp' : {color:'#E9C062',bold:true},
			'id' : {color:'white'},
			'object' : {color:'#9E89A0'}	,
			'param' : {color:'#7587A6',italic:true}	
		}
	}
})(Daisy,Daisy.Theme);