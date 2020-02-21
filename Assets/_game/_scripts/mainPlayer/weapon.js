#pragma strict

public class weapon extends MonoBehaviour {
	
	public static var instance : weapon;
	public var myInformation : informationHolder;
	
	public enum weaponType{
		normal,
		rocket,
		shotgun
	}
	public var playerWeapon : weaponType;
	
	public var rocketEnabled : boolean = false;
	public var shotgunEnabled : boolean = false;
	
	public var audioSource : AudioSource;
	public var normalAudioFire : AudioClip;
	public var rocketAudioFire : AudioClip;
	public var shotgunAudioFire : AudioClip;
	
	public var reloadAudio : AudioClip[];
	public var reloadAudioSource : AudioSource;
	
	private var _lastFire : float = 0f;
	
	// Weapon Stats.
	public var pNormalDamage : float;
	public var pRocketDamage : float;
	public var pShotgunDamage : float;

	public var rocketLeft : int;
	public var rocketLeftInClip : int;
	private var _rocketReloadTime : float = 2f;
	private var _rocketPerClip : int = 15;
	private var _rocketClips : int = 5;

	public var shotgunLeft : int;
	public var shotgunLeftInClip : int;
	private var _shotgunReloadTime : float = 2f;
	private var _shotgunPerClip : int = 7;
	private var _shotgunClips : int = 4;
	private var _shotgunSpread : float;
	
	private var _weaponTarget : GameObject;
	
	function Awake(){
		instance = this;
		_weaponTarget = GameObject.FindWithTag("weaponTarget") as GameObject;
		playerWeapon = weaponType.normal;
		audioSource = GetComponent(AudioSource) as AudioSource;
		pShotgunDamage = myInformation.sDamage;
		pRocketDamage = myInformation.rDamage;
		pNormalDamage = myInformation.nDamage;
	}
	
	function Start(){
		rocketLeft = _rocketClips * _rocketPerClip;
		rocketLeftInClip = _rocketPerClip;
		
		shotgunLeft = _shotgunClips * _shotgunPerClip;
		shotgunLeftInClip = _shotgunPerClip;
	}
		
	function Update(){
		if(!mainPlayerAnimation.instance.isDead && !waveSystem.instance.isWaveEnd && !lockCursor.instance.isPaused){
			transform.LookAt(_weaponTarget.transform);
			switch(playerWeapon){
				case weaponType.normal:
					if(Input.GetButton("Fire1") && Time.time > _lastFire){
						_lastFire = Time.time + myInformation.nFireRate;
			            instNormal();
			            audio.Play();
			        }
				break;
				case weaponType.rocket:
					if(rocketLeft == 0 && rocketLeftInClip == 0){
						return;
					}else{
						if(Input.GetButtonDown("Fire1") && Time.time > _lastFire){
							if(rocketLeftInClip != 0){
								_lastFire = Time.time + myInformation.rFireRate;
					            instRocket();
					            audio.Play();
					            rocketLeftInClip--;
					        }
				        }
				        if(rocketLeft != 0 || rocketLeftInClip == 0){
				        	if(Input.GetKeyDown(KeyCode.R)){
				        		reload();
				        	}
				        }
			        }
				break;
				case weaponType.shotgun:
					if(shotgunLeft == 0 && shotgunLeftInClip == 0){
						return;
					}else{
						if(Input.GetButton("Fire1") && Time.time > _lastFire){
							if(shotgunLeftInClip != 0){
								_lastFire = Time.time + myInformation.sFireRate;
								_shotgunSpread = Random.Range(myInformation.sSpreadMin, myInformation.sSpreadMax);
					            instShotgun();
					            audio.Play();
					            shotgunLeftInClip--;
							}
				        }
				        if(shotgunLeft != 0 || shotgunLeftInClip == 0){
				        	if(Input.GetKeyDown(KeyCode.R)){
				        		reload();
				        	}
				        }
					}
				break;
			}
	    }
	}
	
	function instNormal(){
        var instantiatedBullet : Rigidbody = Instantiate(Resources.Load("bullet"), transform.position, transform.rotation) as Rigidbody;
	}
	
	function instRocket(){
		var instantiatedRocket : Rigidbody = Instantiate(Resources.Load("rocket"), transform.position, transform.rotation) as Rigidbody;
	}
	
	function instShotgun(){
		for(var i : int = 0; i < 6; i++){
			var rotation : Quaternion = Quaternion.Euler((Random.Range(-0.5f,0.5f)) * _shotgunSpread, (Random.Range(-0.5f,0.5f)) * _shotgunSpread, 0);
			var instantiatedShotgun : Rigidbody = Instantiate(Resources.Load("shotgun"), gameObject.transform.position, gameObject.transform.rotation * rotation) as Rigidbody;
		}
	}
	
	public function setGun(){
		switch(playerWeapon){
			case weaponType.normal:
				transform.localPosition = new Vector3(0.28f, 0.145f, 2.15f);
				audioSource.clip = normalAudioFire;
				mainPlayerAnimation.instance.normalWeaponMesh.SetActiveRecursively(true);
				mainPlayerAnimation.instance.rocketLauncherMesh.SetActiveRecursively(false);
				mainPlayerAnimation.instance.shotgunMesh.SetActiveRecursively(false);
			break;
			case weaponType.rocket:
				transform.localPosition = new Vector3(0.28f, -0.0185f, 2.07f);
				audioSource.clip = rocketAudioFire;
				mainPlayerAnimation.instance.normalWeaponMesh.SetActiveRecursively(false);
				mainPlayerAnimation.instance.rocketLauncherMesh.SetActiveRecursively(true);
				mainPlayerAnimation.instance.shotgunMesh.SetActiveRecursively(false);
			break;
			case weaponType.shotgun:
				transform.localPosition = new Vector3(0.29f, 0.116f, 2.4f);
				audioSource.clip = shotgunAudioFire;
				mainPlayerAnimation.instance.normalWeaponMesh.SetActiveRecursively(false);
				mainPlayerAnimation.instance.rocketLauncherMesh.SetActiveRecursively(false);
				mainPlayerAnimation.instance.shotgunMesh.SetActiveRecursively(true);
			break;
		}
	}
	
	function reload(){
		var addTake : int = 0;
		switch(playerWeapon){
			case weaponType.normal:
			break;
			case weaponType.rocket:
				reloadAudioSource.clip = reloadAudio[0] as AudioClip;
				reloadAudioSource.Play();
				yield WaitForSeconds(_rocketReloadTime);
				if(rocketLeftInClip == _rocketPerClip){
					return;
				}
				
				if(rocketLeftInClip < _rocketPerClip || rocketLeft != 0){
					addTake = _rocketPerClip - rocketLeftInClip;
					
					if(rocketLeft <= addTake){
						addTake = rocketLeft;
					}
					
					rocketLeftInClip += addTake;
					if(rocketLeft >= 0){
						rocketLeft -= addTake;
					}else{
						rocketLeft = 0;
					}
				}
			break;
			case weaponType.shotgun:
				reloadAudioSource.clip = reloadAudio[1] as AudioClip;
				reloadAudioSource.Play();
				yield WaitForSeconds(_shotgunReloadTime);
				if(shotgunLeftInClip == _shotgunPerClip){
					return;
				}
				
				if(shotgunLeftInClip < _shotgunPerClip || shotgunLeft != 0){
					
					addTake = _shotgunPerClip - shotgunLeftInClip;
					if(shotgunLeft <= addTake){
						addTake = shotgunLeft;
					}
					shotgunLeftInClip += addTake;
					if(shotgunLeft >= 0){
						shotgunLeft -= addTake;
					}else{
						shotgunLeft = 0;
					}
				}
			break;
		}
	}
	
	public function damageBoost(){
		if(mainPlayerStatus.instance.isDamage == false || waveSystem.instance.isWaveEnd){
			myInformation.nDamage = pNormalDamage;
			myInformation.rDamage = pRocketDamage;
			myInformation.sDamage = pShotgunDamage;
		}else if(mainPlayerStatus.instance.isDamage == true){
			if(myInformation.nDamage <= 100f && myInformation.rDamage <= 100f && myInformation.sDamage <= 100f){
				myInformation.nDamage *= 5f;
				myInformation.rDamage *= 5f;
				myInformation.sDamage *= 5f;
			}else{
				myInformation.nDamage = 100f;
				myInformation.rDamage = 100f;
				myInformation.sDamage = 100f;
			}
		}
	}
	
	public function getCurDamage():float{
		var damage : float = 0f;
		switch(playerWeapon){
			case weaponType.normal:
				damage = myInformation.nDamage;
			break;
			case weaponType.rocket:
				damage = myInformation.rDamage;
			break;
			case weaponType.shotgun:
				damage = myInformation.sDamage;
			break;
		}
		return damage;
	}
	
	public function getCurAmmo():int{
		var ammo : int = 0;
		switch(playerWeapon){
			case weaponType.normal:
				ammo = 0;
			break;
			case weaponType.rocket:
				ammo = rocketLeft;
			break;
			case weaponType.shotgun:
				ammo = shotgunLeft;
			break;
		}
		return ammo;
	}
	public function getCurAmmoInClip():int{
		var inClip : int = 0;
		switch(playerWeapon){
			case weaponType.normal:
				inClip = 0;
			break;
			case weaponType.rocket:
				inClip = rocketLeftInClip;
			break;
			case weaponType.shotgun:
				inClip = shotgunLeftInClip;
			break;
		}
		return inClip;
	}
	public function addRocketAmmo(amount : int){
		rocketLeft += amount;
	}
	public function addShotgunAmmo(amount : int){
		shotgunLeft += amount;
	}
}
