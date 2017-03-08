function wordsFromBody(body) {
  var finished = false;
  var userEntered = "";

  for (var i = 0; i < body.getNumChildren(); i++) {
    var child = body.getChild(i);    

    if (!finished) {
      userEntered += " " + child.getText();      
    }

    if (child.getNumChildren() > 0) {
      for (var c = 0; c < child.getNumChildren(); c++) {
        var embeddedChild = child.getChild(c);
        if (embeddedChild.getType() == DocumentApp.ElementType.HORIZONTAL_RULE) {
          finished = true;
        }
      }
    }
  }
  
  return {count: countWords(userEntered), text: userEntered};

}

function countWords(s){
    s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
    s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
    return s.split(' ').length; 
}
