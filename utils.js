Event.prototype.modifiers = function() {
  if (this.shiftKey || this.metaKey || this.altKey)
    return true;
  return false;
};

String.prototype.repeat = function(times) {
  var a = [this];
  for (var i = 0; i < times; i++) {
    a.push(this);
  }
  return a.join("");
}

Object.prototype.isInput = function() {
  return (
      (this.nodeName === "TEXTAREA" || this.nodeName === "INPUT") &&
      !/button|image|checkbox|submit/.test(this.getAttribute("type"))
  );
};

