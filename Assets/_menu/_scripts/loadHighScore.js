#pragma strict

import System.IO;

public class loadHighScore extends MonoBehaviour {
	
	public var mySkin : GUISkin; // This will store the GUIskin which will change the text color and everything to do with GUI.
	
	function OnGUI(){
		
		GUI.skin = mySkin; // make use or our stored gui skin and changing the default to our new one.
		
		if(menu.instance.isHighScore){ // Just a check to make sure we are on the high score menu.
			for(var i : int = 0; i < 10; i++){ // for loop that will go through 10 times.
				// we make a label/text which will grab the scores stored somewhere and displaying them from highest to lowest.
				GUI.Label(Rect((Screen.width * 0.5f) - 100, (Screen.height * 0.2f) + (i * 30), 200, 30),i + 1 + ": " + PlayerPrefs.GetInt(i+"score"));
			}
		}else{
			return;
		}
	}

}
