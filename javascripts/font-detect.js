/*
 * Javascript -> SWF -> Javascript font detection.
 *
 * @author Gabriel Handford
 * @website http://ducktyper.com
 */

var fontDetect = {
  
  loadSWF: function(id, callback) {
    this.callback = callback;
    var params = { allowScriptAccess: "always", menu: "false", callback: "fontDetectSwfCallback" };
    var ok = swfobject.embedSWF("flash/FontList.swf", id, "1", "1", "9.0.0", { }, params);
    
  },
    
  checkOffsetWidth: function(family, size)
  {
    var node = document.createElement("p");        
    $(node).css("font-family", "'" + family + "', Times New Roman");    
    $(node).css("font-size", size);
    $(node).css("display", "inline");
    $(node).addClass("font-test")
    $(node).html("mmmmmmmmml"); // m or w take up max width
    $("body").append(node);
    var width = node.offsetWidth;
    $("body p.font-test").remove();
    return width;
  },
  
  getFallbackWidth: function() {
    if (!this.fallbackWidth) this.fallbackWidth = this.checkOffsetWidth("Times New Roman", "120px");
    return this.fallbackWidth;
  },  
  
  checkFont: function(family) {
    // We use Times New Roman as a fallback
    if (family == "Times New Roman") return true;    
    
    // Ignore fonts like: 'Arno Pro Semibold 18pt'
    if (/\d+pt\s*$/.test(family)) return false;
    
    var familyWidth = this.checkOffsetWidth("'" + family + "', Times New Roman", "120px");
    //console.debug("Family: " + family + ", width: " + familyWidth);
    var fallbackWidth = this.getFallbackWidth();
    return (familyWidth != fallbackWidth);
  }
  
};

function fontDetectSwfCallback(fonts) {
  var fonts = eval(fonts);
  var validFonts = []; 
  for (var i = 0; i < fonts.length; i++) {
    var isOk = fontDetect.checkFont(fonts[i].fontName);
    if (!isOk) continue;
    validFonts.push(fonts[i]);
  }
  fontDetect.callback(validFonts);
}