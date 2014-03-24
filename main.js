var log = console.log.bind(console);

var container = {
  active: false,
  pause: false,
  displaySpeed: function() {
    this.speedInfo.innerText = this.textspeed;
  },
  init: function() {
    this.main = document.createElement("div");
    this.main.id = "main_container";
    this.textspeed = 175,
    this.index = 0,
    this.textbox = document.createElement("div");
    this.textbox.id = "textbox";
    this.progressBar = document.createElement("div");
    this.progressBar.id = "progress_bar";
    this.backdrop = document.createElement("div");
    this.backdrop.id = "backdrop";
    this.highlight = document.createElement("span");
    this.highlight.id = "highlight";
    this.firstHalf = document.createTextNode("");
    this.textbox.appendChild(this.firstHalf);
    this.textbox.appendChild(this.highlight);
    this.lastHalf = document.createTextNode("");
    this.textbox.appendChild(this.lastHalf);
    this.thingy = document.createElement("div");
    this.thingy.id = "thingy";
    this.main.appendChild(this.thingy);
    this.speedInfo = document.createElement("div");
    this.speedInfo.id = "speed_info";
    this.main.appendChild(this.speedInfo);
    this.main.appendChild(this.progressBar);
    this.main.appendChild(this.textbox);
    this.backdrop.appendChild(this.main);
    document.body.appendChild(this.backdrop);
  },
  readText: function() {
    if (typeof this.currentSelection !== "object" || this.currentSelection.length === 0)
      return;
    container.index = 0;
    var progress = 0;
    var pStep = this.main.offsetWidth / this.currentSelection.length;
    var run = setTimeout(loop, this.textspeed);
    function loop() {
      if (container.pause) {
        return setTimeout(loop, timeout);
      }
      progress = (container.index + 1) * pStep;
      container.progressBar.style.width = progress + "px";
      var split = Math.floor(container.currentSelection[container.index].length / 2);
      if (split < 6) {
        if (split === 0) {
          split = 1;
        } else if (split === 1) {
          split = 2;
        }
        container.currentSelection[container.index] = " ".repeat(6 - split) + container.currentSelection[container.index].trim();
      }
      split = 6;
      container.firstHalf.textContent = container.currentSelection[container.index].substring(0, split);
      container.highlight.innerText = container.currentSelection[container.index].substring(split, split + 1);
      container.lastHalf.textContent = container.currentSelection[container.index].substring(split + 1, container.currentSelection[container.index].length);
      container.index++;
      var timeout;
      var lval = container.lastHalf.textContent[container.lastHalf.textContent.length - 1];
      if (lval === "." || lval === "," || lval === "?" || lval === "!") {
        timeout = container.textspeed * 1.50;
      } else {
        timeout = container.textspeed;
      }
      if (container.index >= container.currentSelection.length || !container.active) {
        container.progressBar.style.borderBottomRightRadius = "5px";
        setTimeout(function() {
          container.firstHalf.textContent = "";
          container.highlight.innerText = "";
          container.lastHalf.textContent = "";
          container.hide();
        }, 500);
        clearTimeout(run);
      } else {
        run = setTimeout(loop, timeout);
      }
    };
  },
  transitionEnd: function(e) {
    if (e.target.id === "backdrop") {
      if (container.fadeOut) {
        e.target.style.display = "none";
        container.active = false;
      } else {
        container.readText();
      }
    }
  },
  getSelection: function() {
    var sel = document.getSelection();
    this.currentSelection = "";
    if (!sel || sel.type === "None" || sel.type === "Caret")
      return;
    this.currentSelection = document.getSelection().toString();
    document.getSelection().collapseToEnd();
    return true;
  },
  readyText: function() {
    this.currentSelection = this.currentSelection.replace(/\n|\s+/, " ").replace(/(\S{12})/g, "$1.. ").split(/\s+/);
  },
  show: function() {
    if (!this.getSelection() || this.currentSelection.trim() === "")
      return;
    this.displaySpeed();
    this.progressBar.style.borderBottomRightRadius = "0";
    this.readyText();
    this.fadeOut = false;
    this.active = true;
    this.backdrop.style.display = "block";
    this.main.style.top = window.innerHeight / 2 - this.main.offsetHeight / 2 + "px";
    this.backdrop.style.opacity = "1";
    this.textbox.style.top = this.main.clientHeight / 2 - this.textbox.offsetHeight / 2 + "px";
    this.main.style.opacity = "1";
  },
  hide: function() {
    this.fadeOut = true;
    this.active = false;
    this.pause = false;
    this.main.style.opacity = "0";
    this.backdrop.style.opacity = "0";
    this.progressBar.style.width = "0";
  }
};

var cleanupDone = true;
var scrubSize = 10;
var onKeyDown = function(e) {
  if (e.target.isInput) return false;
  if (!e.modifiers() && e.which === 65) {
    if (!container.active && cleanupDone) {
      container.show();
    } else {
      cleanupDone = false;
      setTimeout(function() {
        cleanupDone = true;
      }, 1000);
      container.hide();
    }
  } else if (container.active) {
    if (e.which === 40) {
      e.preventDefault();
      container.textspeed += scrubSize;
      container.displaySpeed();
    } else if (e.which === 38) {
      e.preventDefault();
      if (container.textspeed - scrubSize < scrubSize) {
        container.textspeed = scrubSize;
      } else {
        container.textspeed -= scrubSize;
      }
      container.displaySpeed();
    } else if (e.which === 32) {
      e.preventDefault();
      container.pause = !container.pause;
    } else if (e.which === 39) {
      e.preventDefault();
      if (container.index + 5 < container.currentSelection.length) {
        container.index += 5;
      }
    } else if (e.which === 37) {
      e.preventDefault();
      if (container.index - 5 < 0) {
        container.index = 0;
      } else {
        container.index -= 5;
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  container.init();
  document.addEventListener("keydown", onKeyDown, false);
  container.backdrop.addEventListener("transitionend", container.transitionEnd, false);
}, false);
