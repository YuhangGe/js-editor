onmessage = function(event){
	var d = event.data;
	var arr = d.arr;
	 
	arr[5] = 10;
	postMessage(arr);
}
