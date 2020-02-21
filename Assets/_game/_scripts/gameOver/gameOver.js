#pragma strict

public class gameOver extends MonoBehaviour {
	
	public static var instance : gameOver;
	public var scoreText : TextMesh;
	
	function Awake(){
		instance = this;
		gameObject.SetActiveRecursively(false); // we set this game object to false soo i becomes disabled, this will give us our gameover screen. if enabled.
	}
}
