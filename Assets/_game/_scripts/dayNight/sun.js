#pragma strict

public class sun extends MonoBehaviour {
	
	public var _maxLightBrightness : float; // How bright the light (intensity) should be.
	public var _minLightBrightness : float; // The Min brightness the light (intensity) should be.
	
	public var _maxFlareBrightness : float; // How bright in size the flare should be.
	public var _minFlareBrightness : float; // How bright in size the flare should be.
	
	public var giveLight : boolean = false; // If it has a light component attached to it, should it give out light.
	
	function Start(){
		if(GetComponent(Light) != null){ // If the gameobject that this script is attached to has a Light Component, then it gives light.
			giveLight = true;
		}
	}

}
