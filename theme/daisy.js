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
			'keyword' : {color:'#cda869'},
			'value' : {color:'#D16F52'},
			'comment' : {color: '#5f5a60', italic : true},
			'operator': {color: '#CDA869'},
			'string' : {color:'#8f9d6a'},
			'regexp' : {color:'#8000ff',bold:true},
			'id' : {color:'white'}			
		}
	}
})(Daisy,Daisy.Theme);