var arr; //список свободных узлов
var symbols;
var msgLen;
var archiveLen;

function init() {
  treeDiv = document.getElementById('treeDiv');
  treeDiv.innerHTML = "";
  arr = [];
  symbols = {};
  codes = [];
  codeField = document.getElementById('codes');
  codeField.innerHTML = "";
  archiveLen = 0;
}

function toHuffman(msg) {
  if (msg.length == 0) {
  	alert("Пустое сообщение!");
  	return;
  }	
  var s = String(msg), c, msgLen = msg.length*8;
  var i = 0;
  while (s.length > 0) {
    c = s[0];
    var n = countCharFreq(c, s);
    s = deleteCharFromStr(c, s);
    node = new Node(n ,c);
    node.setPosition((i+1)*80, 60);
    arr.push(node); //занести в массив новый узел
    symbols[c] = {freq: n};
    node.show();
    i++;
  }
  arr = createHufTree(arr);
  getSymbCodes(arr[0]);
  codeField.innerHTML += "Сжатие: "+archiveLen+" бит к "+msgLen+
                        " бит ("+((1 - archiveLen/msgLen)*100).toFixed(2)+" %)<br />";
}

function countCharFreq(c, str) { //посчитать количество вхождений символа в строку
   var n=0;
   for (var i=0; i < str.length; i++) {
   	if (str[i] === c)
   		n++;
   }
   return n;
}

function deleteCharFromStr(c, s) { //удалить символ из строки
	var pos;
	while ((pos = s.indexOf(c)) != -1) { //пока такой символ в строке присутствует
       s = s.slice(0,pos) + s.slice(pos+1); //получаем новую строку из суммы подстроки до этого символа
                                            // и подстроки после символа
	}
	return s;
}

