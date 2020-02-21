#pragma strict

public class wayPointAreas extends MonoBehaviour {
	
	public static var instance : wayPointAreas;
	public var wayPointOn : boolean = false;
	
	function Awake(){
		instance = this;
	}
	
	function OnTriggerEnter(other : Collider){
		if(other.tag == "mainPlayer"){
			wayPointOn = true;
			var gos : GameObject[];
			gos = GameObject.FindGameObjectsWithTag("enemy");
			for(var go : GameObject in gos){
				go.gameObject.SendMessage("findNearestWay", SendMessageOptions.DontRequireReceiver);
			}
		}
	}
	
	function OnTriggerExit(other : Collider){
		if(other.tag == "mainPlayer"){
			wayPointOn = false;
			var gos : GameObject[];
			gos = GameObject.FindGameObjectsWithTag("enemy");
			for(var go : GameObject in gos){
				go.gameObject.SendMessage("findNearestWay", SendMessageOptions.DontRequireReceiver);
			}
		}
	}

}
