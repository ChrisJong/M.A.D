#pragma strict

public class pickDamage extends MonoBehaviour {
	
	public static var instance : pickDamage;
	
	private var _lifeTime : float = 5f;
	
	function Awake(){
		instance = this;
	}
	
	function Start(){
		Destroy(gameObject, _lifeTime);
	}
	
	function OnTriggerEnter(other : Collider){
		if(other.gameObject.name == "mainPlayer"){
			mainPlayerStatus.instance.damageTrigger();
			Destroy(gameObject);
			Destroy(this);
		}
	}

}