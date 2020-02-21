#pragma strict

public class pickShotgunAmmo extends MonoBehaviour {
	
	private var _lifeTime : float = 5f;
	private var _ammoAmount : int = 0f;
	
	function Start(){
		Destroy(gameObject, _lifeTime);
		_ammoAmount = Random.Range(10,20);
	}
		
	function OnTriggerEnter(other : Collider){
		if(other.tag == "mainPlayer"){
			mainPlayerStatus.instance.powerUpAudio.clip = mainPlayerStatus.instance.aAudio[4] as AudioClip;
			mainPlayerStatus.instance.powerUpAudio.Play();
			weapon.instance.addShotgunAmmo(_ammoAmount);
			Destroy(gameObject);
			Destroy(this);
		}
	}

}
