/*
 * Javascript -> SWF -> Javascript font detection. (Prototype)
 *
 * @author Gabriel Handford
 * @website http://rel.me
 * 
 * @see http://www.lalit.org/lab/javascript-css-font-detect
 */

var FontDetect = Class.create({
  
  initialize: function(swfId, swfLocation, onReady, onCreate) {
    this._swfId = swfId;
    this._swfObjectId = swfId;
    this._swfLocation = swfLocation;
    this._onReady = onReady;
    this._fallbackWidthCache = null;
    this._onCreate = onCreate;
  
    if(!!this._onCreate && swfobject.embedSWF.length<10) {
      thiswindow.console&&console.log("onCreate is supported since SWFObject 2.2");
    }
  
    this.loadSWF();
  },
  
  loadSWF: function() {
    var flashvars = { onReady: "onFontDetectReady", swfObjectId: this._swfObjectId };
    var params = { allowScriptAccess: "always", menu: "false" };
    var attributes = { id: this._swfObjectId, name: this._swfObjectId };
    swfobject.embedSWF(this._swfLocation, this._swfId, "1", "1", "9.0.0", false, flashvars, params, attributes, this._onCreate);
    
    FontDetectGlobal.register(this._swfObjectId, this);
  },
  
  checkOffsetWidth: function(family, size) {
    var node = document.createElement("p");        
    Element.extend(node);    
    node.setStyle({ 
      'fontFamily': "'" + family + "', Times New Roman",
      'fontSize': size, 
      'display': 'inline'
    });
    node.addClassName("font-test")
    
    // This was from http://www.lalit.org/lab/javascript-css-font-detect
    node.update("mmmmmmmmml"); // m or w take up max width
    
    //$$("body").first().insert(node);
    document.body.appendChild(node);
    var width = node.offsetWidth;
    $$("body p.font-test").each(function(item) { item.remove(); });
    return width;
  },

  fallbackWidth: function() {
    if (!this._fallbackWidthCache) this._fallbackWidthCache = this.checkOffsetWidth("Times New Roman", "120px");
    return this._fallbackWidthCache;
  },

  checkFont: function(family) {
    // We use Times New Roman as a fallback
    if (family == "Times New Roman") return true;    
  
    // Ignore fonts like: 'Arno Pro Semibold 18pt'
    if (/\d+pt\s*$/.test(family)) return false;
  
    var familyWidth = this.checkOffsetWidth("'" + family + "', Times New Roman", "120px");
    return (familyWidth != this.fallbackWidth());
  },
  
  filterFonts: function(fonts) {
    var filtered = [];     
    fonts.each(function(font) {
      var isOk = this.checkFont(font.fontName);
      if (isOk) filtered.push(font);      
    }.bind(this));    
    return filtered;
  },
    
  fonts: function() {
    // Use when doing static publishing
    //var fonts = swfobject.getObjectById(this._swfObjectId).fonts();
      
    // Works with dynamic publishing
    var swf = document.getElementById(this._swfObjectId);
    var fonts = swf.fonts();    
    return this.filterFonts(fonts);
  }
});

var FontDetectGlobal = (function() {
  var instance = {};
  return {
    register: function(id, object) {
      instance[id] = object;
    },    
    remove: function(id) {
      var object = instance[id];
      instance[id] = null;
      return object;
    }
  };
})();

// Callback for Flash
var onFontDetectReady = function(swfObjectId) {
  var fontDetect = FontDetectGlobal.remove(swfObjectId);
  fontDetect._onReady(fontDetect);
};
