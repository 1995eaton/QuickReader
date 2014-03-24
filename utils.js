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
