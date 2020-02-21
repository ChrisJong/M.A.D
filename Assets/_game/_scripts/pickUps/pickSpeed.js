#pragma strict

public class pickSpeed extends MonoBehaviour {
	
	public static var instance : pickSpeed;
	
	private var _lifeTime : float = 5f;
	
	function Awake(){
		instance = this;
	}
	
	function Start(){
		Destroy(gameObject, _lifeTime);
	}
	
	function OnTriggerEnter(other : Collider){
		if(other.gameObject.name == "mainPlayer"){
			mainPlayerStatus.instance.speedTrigger();
			Destroy(gameObject);
			Destroy(this);
		}
	}

}