(function(Daisy,$){
	/**
	 * aptana 3 的主题
	 */
	Daisy.Theme.aptana3 = {
		global : {
			font : '20px consolas',
			background : 'black',
			color : 'white'
		},
		caret : {
			color:'rgba(255,255,255,0.8)'
		},
		selection : {
			background : 'rgba(160,160,160,0.5)'
		},
		current_line : {
			background : 'rgba(210,210,210,0.1)'
		},
		styles : {
			'general' : {
				/**
				 * nothing, just use global.
				 */
			},
			'javascript' :
			 {
				keyword : {color:'#F9EE98'},
				value : {color:'#B4431F'},
				comment : {color: '#5f5a60', italic : true},
				operator: {color: '#CDA869'},
				string : {color:'#8f9d6a'},
				regexp : {color:'#E9C062',bold:true},
				id : {color:'white'},
				object : {color:'#9E89A0'}	,
				param : {color:'#7587A6',italic:true}	
			},
			'visualbasic' :
			{
				keyword : {color:'#F9EE98'},
				value : {color:'#B4431F'},
				comment : {color: '#5f5a60', italic : true},
				operator: {color: '#CDA869'},
				string : {color:'#8f9d6a'},
				id : {color:'white'}
			}
		}
	}
})(Daisy,Daisy.$);