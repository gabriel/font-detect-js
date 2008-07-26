package {
  
  import flash.display.Sprite; 
  import flash.display.LoaderInfo;
  import flash.text.Font;
  import flash.external.ExternalInterface;  
  
  public class FontList extends Sprite {
    
    public function FontList() {      
      ExternalInterface.marshallExceptions = true;
      ExternalInterface.addCallback("fontsAsJSON", fontsAsJSON);
      ExternalInterface.addCallback("fontsWithCallback", fontsWithCallback);
    }    
    
    // Use corelib JSON encoding for something generic
    private function fontsToJSON(fonts:Array):String {
      var items:Array = fonts.map(function(font:*, index:int, arr:Array):String {
        return "{ fontName:'" + font.fontName + "', fontStyle:'" + font.fontStyle + "', fontType:'" + font.fontType + "'}";
      });
      return "[" + items.join(",") + "]"
    }
    
    public function fontsAsJSON():String {
      return fontsToJSON(Font.enumerateFonts(true).sortOn("fontName", Array.CASEINSENSITIVE));            
    }
    
    public function fontsWithCallback(callback:String):void {
      if (ExternalInterface.available)  
        ExternalInterface.call(callback, fontsAsJSON());
    }
    
  }
  
}