#pragma strict

public class pickUpSpawn extends MonoBehaviour {
	
	public static var instance : pickUpSpawn;
	public var pickUpObjects : GameObject[];
	
	function Awake(){
		instance = this;
	}
	
	public function enemyDrop(pos : Vector3, rot : Quaternion){
		var randomDrop : int = Random.Range(0,15);
		
		if(randomDrop < pickUpObjects.Length){
			if(pickUpObjects[randomDrop] != null){
			Instantiate(pickUpObjects[randomDrop], pos, rot);
			}else{
				return;
			}
		}else{
			return;
		}
	}
}