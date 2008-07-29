var EditFontDetect = function() {
  this._fonts = null;  
}

EditFontDetect.prototype = {  
  
  setFonts: function(fonts) {
    this._fonts = fonts;
  },
  
  addText: function(text, size, family, append) {
    var wrapper = document.createElement("div");
  
    var node = document.createElement("p");        
    $(node).css("font-family", "'" + family + "', Times New Roman");
    $(node).css("font-size", size);
    $(node).addClass("sample-text"); 
    $(node).html(text);
    $(wrapper).append(node);  
  
    var nameNode = document.createElement("p");
    $(nameNode).addClass("sample-text-name");
    $(nameNode).html("[" + family + "]");
    $(wrapper).append(nameNode);  
  
    $(wrapper).click(function() { $(this).remove(); return false; });
    if (append) $("#content").append(wrapper);
    else $("#content").prepend(wrapper);
  },

  addAll: function(text, size) {
    if (!this._fonts) return;
    
    for(var i = 0, length = this._fonts.length; i < length; i++) {
      this.addText(text, size, this._fonts[i].fontName, true);
    }
  },

  updateText: function(text, size) {
    $("#content p.sample-text").each(function(i) {
      $(this).html(text);
      $(this).css("font-size", size);
    });  
  },

  clearText: function() {
    $("#content p").remove();
  },

  updateSelect: function(fonts) {
    var options = []; 
    for (var i = 0; i < this._fonts.length; i++) {
      var fontDesc = this._fonts[i].fontName;
      options.push('<option value="' + fontDesc + '">' + fontDesc + '</option>');
    }
    $("select#font-family").html(options.join());
    $("#status").html("Loaded " + fonts.length + " fonts");      
  }
  
};

