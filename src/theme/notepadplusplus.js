(function(Daisy,$){
	/**
	 * notepad++的默认主题
	 */
	Daisy.Theme.notepadplusplus = {
		global : {
			font : '20px Courier New',
			background : '#F2F4FF',
			color : 'black'
		},
		caret : {
			color:'rgba(128,0,255,1)'
		},
		selection : {
			background : 'rgba(192,192,192,1)'
		},
		current_line : {
			background : 'rgba(232,232,255,1)'
		},
		styles : {
			'general' : {
				/**
				 * nothing, just use global.
				 */
			},
			'javascript' :
			 {
				keyword : {color:'#000080',italic:true,bold:true},
				value : {color:'#FF0000'},
				comment : {color: '#008000'},
				doccomment : {color:"#008080"},
				operator: {color:'black'},
				string : {color:'#808080'},
				regexp : {color:'#8000FF'},
				id : {color:'black'},
				object : {color:'#275391'}	,
				param : {color:'#275391',italic:true}	
			},
			'visualbasic' :
			{
				keyword : {color:'#0000FF'},
				value : {color:'#ff0000'},
				comment : {color: '#008000'},
				operator: {color: '#000000'},
				string : {color:'#808080'},
				id : {color:'black'}
			}
		}
	}
})(Daisy,Daisy.$);