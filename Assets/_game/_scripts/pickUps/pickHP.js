#pragma strict

public class pickHP extends MonoBehaviour {
	
	public static var instance : pickHP;
	
	public var amountHP : float = 30f;
	
	private var _lifeTime : float = 5f;
	
	function Awake(){
		instance = this;
	}
	
	function Start(){
		Destroy(gameObject, _lifeTime);
	}
	
	function OnTriggerEnter(other : Collider){
		if(other.gameObject.name == "mainPlayer"){
			mainPlayerStatus.instance.hpTrigger(amountHP);
			Destroy(gameObject);
			Destroy(this);
		}
	}

}