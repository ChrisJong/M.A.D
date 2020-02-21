#pragma strict

public class pickMoney extends MonoBehaviour {
	
	private var _lifeTime : float = 5f;
	private var _amount : int = 0f;
	
	function Start(){
		Destroy(gameObject, _lifeTime);
		_amount = Random.Range(100,200);
	}
		
	function OnTriggerEnter(other : Collider){
		if(other.tag == "mainPlayer"){
			mainPlayerStatus.instance.powerUpAudio.clip = mainPlayerStatus.instance.aAudio[3] as AudioClip;
			mainPlayerStatus.instance.powerUpAudio.Play();
			mainPlayerStatus.instance.addMoney(_amount);
			Destroy(gameObject);
			Destroy(this);
		}
	}

}
