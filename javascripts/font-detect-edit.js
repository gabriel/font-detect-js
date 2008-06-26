var fontDetectEdit = {  
  
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
    if (this.fonts) {
      for(var i = 0; i < this.fonts.length; i++) {
        this.addText(text, size, this.fonts[i].fontName, true);
      }
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
  
  setFonts: function(fonts) {
    this.fonts = fonts;
  }
  
};

function fontDetectCallback(fonts) {
  fontDetectEdit.setFonts(fonts);
  var options = []; 
  for (var i = 0; i < fonts.length; i++) {
    var fontDesc = fonts[i].fontName;
    options.push('<option value="' + fonts[i].fontName + '">' + fontDesc + '</option>');
  }
  $("select#font-family").html(options.join());
  $("#status").html("Loaded " + fonts.length + " fonts");      
}