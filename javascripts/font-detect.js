/*
 * Javascript -> SWF -> Javascript font detection.
 *
 * @author Gabriel Handford
 * @website http://rel.me
 */

var newFontDetect = function(swfId) {
  
  var _swfId = swfId;
  var _swfObjectId = swfId + "-object";
  var _fallbackWidthCache = null;
    
  // Load SWF
  var _loadSWF = function() {
    var flashvars = { };
    var params = { allowScriptAccess: "always", menu: "false" };
    var attributes = { id: _swfObjectId };
    console.log("Load swf: " +  _swfId);
    swfobject.embedSWF("flash/FontList.swf", _swfId, "1", "1", "9.0.0", false, flashvars, params, attributes);  
  };
  
  var _checkOffsetWidth = function(family, size) {
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
  };

  var _fallbackWidth = function() {
    if (!_fallbackWidthCache) _fallbackWidthCache = _checkOffsetWidth("Times New Roman", "120px");
    return _fallbackWidthCache;
  };

  var _checkFont = function(family) {
    // We use Times New Roman as a fallback
    if (family == "Times New Roman") return true;    
  
    // Ignore fonts like: 'Arno Pro Semibold 18pt'
    if (/\d+pt\s*$/.test(family)) return false;
  
    var familyWidth = _checkOffsetWidth("'" + family + "', Times New Roman", "120px");
    return (familyWidth != _fallbackWidth());
  };
  
  var _filterFonts = function(fonts) {
    var filtered = []; 
    for (var i = 0; i < fonts.length; i++) {
      var isOk = _checkFont(fonts[i].fontName);
      if (!isOk) continue;
      filtered.push(fonts[i]);
    }
    return filtered;
  }
    
  return {
    
    loadSWF: function() {
      _loadSWF();
    },
    
    fonts: function() {
      //_loadSWF();
      
      // Use when doing static publishing
      //var swf = swfobject.getObjectById(_swfObjectId);
      
      // Works with dynamic publishing
      var swf = document.getElementById(_swfObjectId);
      
      console.log("Calling actionscript with swfObjectId: " + _swfObjectId + ", method: " + swf.fontsAsJSON);
      var fontsJSON = swf.fontsAsJSON();     
      console.log("Got fonts: " + fontsJSON);     
      var fonts = eval(fontsJSON);
      console.log("Evaled fonts: " + fonts);
      return _filterFonts(fonts);
    }
  }
  
};