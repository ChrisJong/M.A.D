#pragma strict

public class levelLight extends MonoBehaviour {
	
	public static var instance : levelLight;
	
	function Awake(){
		instance = this;
	}
		
	public function turnOff(){
		gameObject.SetActiveRecursively(false); // Turns off the gameobject and its childs that this script is attached to.
	}
	
	public function turnOn(){
		gameObject.SetActiveRecursively(true); // Turns on the gameobject and its childs that this script is attached to.
	}

}
