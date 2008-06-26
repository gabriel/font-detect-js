package {
  
  import flash.display.Sprite; 
  import flash.display.LoaderInfo;
  import flash.text.Font;
  import flash.external.ExternalInterface;  
      
  public class FontList extends Sprite {
    
    public function FontList() {      
      var params:Object = loadParams();
      loadFonts(params.callback);
    }    
    
    public function loadParams():Object {
      return LoaderInfo(this.root.loaderInfo).parameters;
    }
    
    public function fontsToJSON(fonts:Array):Array {
      return fonts.map(function(font:*, index:int, arr:Array):String {
        return "{ fontName:'" + font.fontName + "', fontStyle:'" + font.fontStyle + "', fontType:'" + font.fontType + "'}";
      });
    }
    
    public function loadFonts(callbackName:String):void {
      var fonts:Array = fontsToJSON(Font.enumerateFonts(true).sortOn("fontName", Array.CASEINSENSITIVE));      
      if (ExternalInterface.available) {  
        ExternalInterface.call(callbackName, "[" + (fonts.join(",")) + "]");  
      }
    }
    
  }
  
}