#pragma strict

public class hudCursor extends MonoBehaviour {
	
	private var screenWidth : float = 0f;
	private var screenHeight : float = 0f;
	
	function Awake(){
		screenWidth = Screen.width / 2;
		screenHeight = Screen.height /2;
	}
	
	function Start(){
		guiTexture.pixelInset.x = screenWidth - 52.5;
		guiTexture.pixelInset.y = screenHeight - 55;
	}
	
}