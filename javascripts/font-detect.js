/*
 * Javascript -> SWF -> Javascript font detection.
 *
 * @author Gabriel Handford
 * @website http://rel.me
 * 
 * @see http://www.lalit.org/lab/javascript-css-font-detect
 */

// Callback for Flash
var onFontDetectReady = function(swfObjectId) {
  var swfObj = document.getElementById(swfObjectId);
  swfObj.onFontDetectReady();
  swfObj.onFontDetectReady = null;
};

var newFontDetect = function(swfId, swfLocation, onReady) {
  
  var _swfId = swfId;
  var _swfObjectId = swfId;
  var _fallbackWidthCache = null;
    
  var _loadSWF = function() {
    var flashvars = { onReady: "onFontDetectReady", swfObjectId: _swfObjectId };
    var params = { allowScriptAccess: "always", menu: "false" };
    var attributes = { id: _swfObjectId, name: _swfObjectId };
    swfobject.embedSWF(swfLocation, _swfId, "1", "1", "9.0.0", false, flashvars, params, attributes);
    
    // Attach onReady to element
    document.getElementById(_swfObjectId).onFontDetectReady = onReady;
  };
  
  // Init
  _loadSWF();
  
  var _checkOffsetWidth = function(family, size) {
    var node = document.createElement("p");        
    $(node).css("font-family", "'" + family + "', Times New Roman");    
    $(node).css("font-size", size);
    $(node).css("display", "inline");
    $(node).addClass("font-test")
    
    // This was from http://www.lalit.org/lab/javascript-css-font-detect
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
      // Use when doing static publishing
      //var swf = swfobject.getObjectById(_swfObjectId);
      
      // Works with dynamic publishing
      var swfObj = document.getElementById(_swfObjectId);
      var fonts = swfObj.fonts();
      return _filterFonts(fonts);
    }
  }
  
};