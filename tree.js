var cur = null, codeField, level, treeDiv;

var Node = function(freq,val) { //объявляем объект
	this.val = val;
	this.freq = freq;
	this.parentLeft = null;
	this.parentRight = null;
	this._x = -1;
	this._y = -1;
	this.domEl = null;
	this.line1 = null;
	this.line2 = null;
	this.noteDiv = null;
	this.child = null;
	this.addParents = function(left, right) {
		this.parentLeft = left;
		this.parentRight = right;
		this.parentLeft.addChild(this);
		this.parentRight.addChild(this);
		this._x = parseInt((left.getPosition()[0] + right.getPosition()[0])/2);
		this._y = level*60;
	}
 
	this.show = function() {
	   this.domEl = document.createElement('div');
	   this.domEl.className = 'node';
       this.domEl.style.left = ""+this._x+"px";
       this.domEl.style.top = ""+this._y+"px";
       this.domEl.innerHTML = this.freq;
       if (this.hasParents()) {
       	  this.showLines(treeDiv);
       }
       this.domEl.onmouseover = function(obj) {
       	  	return function() {
       	  	   if (obj.hasParents()) {	
                  obj.line1.style.borderColor = obj.line2.style.borderColor = '#f00';
                  obj.line1.style.borderWidth = obj.line2.style.borderWidth = '2px';
               }
               obj.showNote();
       	  	}
       	  }(this);
       this.domEl.onmouseout = function(obj) {
       	  	return function() {	
       	  	  if (obj.hasParents()) {	
                  obj.line1.style.borderColor = obj.line2.style.borderColor = '#000';
                  obj.line1.style.borderWidth = obj.line2.style.borderWidth = '1px';
               }
               obj.hideNote();
       	  	}
       	  }(this);
       treeDiv.appendChild(this.domEl);
	}

	this.showNote = function() {
      this.noteDiv = document.createElement('div');
      this.noteDiv.className = 'note';
      document.body.appendChild(this.noteDiv);
      this.noteDiv.innerHTML = "";
      if (this.hasParents()) {
      	this.noteDiv.innerHTML += 'Левый родитель: '+this.parentLeft.getFreq()+"<br />"+
                                 'Правый родитель: '+this.parentRight.getFreq()+"<br />";
      }
      if (this.hasChild()) {
      	this.noteDiv.innerHTML += "Потомок: "+this.child.getFreq()+"<br />";
      }
      cStyle = getComputedStyle(this.domEl,null);
      nX = cStyle.getPropertyValue('left');
      nW = cStyle.getPropertyValue('width');
      nY = cStyle.getPropertyValue('top');
      nH = cStyle.getPropertyValue('height');     
      tStyle = getComputedStyle(treeDiv, null);
      tX = tStyle.getPropertyValue('left');
      tY = tStyle.getPropertyValue('top');       
      ntStyle = getComputedStyle(this.noteDiv,null);
      ntW = ntStyle.getPropertyValue('width');
      ntH = ntStyle.getPropertyValue('height');               
      x = parseInt(tX) + parseInt(nX) - parseInt(ntW) - parseInt(nW)/2;
      y = parseInt(tY) + parseInt(nY) - parseInt(ntH) - parseInt(nH)/2;
      this.noteDiv.style = 'left: '+x+'px; top: '+y+'px';                                                   
	}

	this.hideNote = function() {
      document.body.removeChild(this.noteDiv);
	}
    
    this.showLines = function(target) {
      var pos1, pos2, x1, y1, x2, y2, w1, h1, w2, h2;
          this.line1 = document.createElement('div');
          this.line2 = document.createElement('div');
          pos1 = this.parentLeft.getPosition();
          pos2 = this.parentRight.getPosition();
          if (Math.abs(pos1[0] - pos2[0]) < 30) {
            if (pos1[0] < pos2[0]) {
          	this.line1.className = "line left top";
          	this.line2.className = "line right top";
          	x1 = pos1[0] - 30;
          	x2 = pos2[0] + 15;
          	w1 = Math.abs(this._x - pos1[0])+30;
          	w2 = Math.abs(this._x - pos2[0])+45;
          }
          else {
          	this.line1.className = "line right top";
          	this.line2.className = "line left top";	
          	x1 = pos2[0] + 15;
          	x2 = pos1[0] - 30;
          	w1 = Math.abs(this._x - pos2[0])+45;
          	w2 = Math.abs(this._x - pos1[0])+30;
          }
          h1 = Math.abs(this._y - pos1[1]);
          h2 = Math.abs(this._y - pos2[1]);
         }
         else {
          if (pos1[0] < pos2[0]) {
          	this.line1.className = "line left";
          	this.line2.className = "line right";
            x1 = pos1[0]+15;
            x2 = this._x+15;
           }
           else if (pos1[0] > pos2[0]) {
          	this.line1.className = "line right";
          	this.line2.className = "line left";
          	x1 = this._x+15;
          	x2 = pos2[0]+15;
           }
           w1 = Math.abs(this._x - pos1[0]);
           h1 = Math.abs(this._y - pos1[1]);
           w2 = Math.abs(this._x - pos2[0]);
           h2 = Math.abs(this._y - pos2[1]);
          }
          y1 = pos1[1]+15;
          y2 = pos2[1]+15;
          this.line1.style = "width: "+w1+"px; "+
                         "height: "+h1+"px;"+
                         "left: "+x1+"px; top: "+y1+"px";
          this.line2.style = "width: "+w2+"px; "+
                        "height: "+h2+"px;"+
                        "left: "+x2+"px; top: "+y2+"px";
          target.appendChild(this.line1);
          target.appendChild(this.line2);
    }

	this.hasParents = function() {
		if (this.parentLeft && this.parentRight)
			return true;
		return false;
	}

	this.getFreq = function() {
		return this.freq;
	}
    
    this.getVal = function() {
    	return this.val;
    }

	this.setPosition = function(x, y) {
       this._x = x;
       this._y = y;
	}

	this.getPosition = function() {
		return [this._x, this._y];
	}

	this.getParents = function() {
		return [this.parentLeft, this.parentRight];
	}

	this.addChild = function(ch) {
		this.child = ch;
	}

	this.getChild = function() {
		return this.child;
	}

	this.hasChild = function() {
		return !(this.child == null);
	}
}

function createHufTree(arr) {
	var index1, index2;
	level = 2;
  	while(arr.length > 1) {
  	  index1 = 0;
  	  index2 = 0;	
      for (var i=1; i < arr.length; i++) { //найдем первый элемент с наименьшой частотой
       if (arr[i].getFreq() < arr[index1].getFreq())
       	index1 = i;
      }
      prnt2 = null;
      for (var i=0; i < arr.length; i++) {
      	if (prnt2 == null && i != index1) {
      		prnt2 = arr[i];
      		index2 = i;
      	}
      	if (i != index1)
         if (arr[i].getFreq() < arr[index2].getFreq())
      	    index2 = i;
      	 }
      prnt1 = arr[index1];	 
      prnt2 = arr[index2];
      n = new Node(prnt1.getFreq() + prnt2.getFreq());
      if (index1 < index2) {
      	n.addParents(prnt1, prnt2);
      }
      else {
      	n.addParents(prnt2, prnt1);
      }
      newArr = [];
      for (var j=0; j < arr.length; j++) {
      	if (j == index1 || j == index2)
      		continue;
      	newArr.push(arr[j]);
      }
      newArr.push(n);
      arr = newArr;
      n.show();
      level++;
      }
      return arr;
  	}

function getSymbCodes(node, code) {
	if (code == undefined)
		code="";
	if (node.hasParents()) {
		getSymbCodes(node.parentLeft, code+"0")
		getSymbCodes(node.parentRight, code+"1");
	}
	else {
		ch = node.getVal();
		codeField.innerHTML += ch+": "+code+"<br />";
		archiveLen += code.length*symbols[ch].freq;
	}
}

