#pragma strict

public class backButton extends MonoBehaviour {
	
	public var mySkin : GUISkin;
	
	function OnGUI(){
		GUI.skin = mySkin;
		if(GUI.Button(Rect((Screen.width * 0.5f - 175), (Screen.height * 0.5f - 50) + 100, 350, 100), "Back To Main Menu")){
			Application.LoadLevel(0);
		}
	}
	
}
