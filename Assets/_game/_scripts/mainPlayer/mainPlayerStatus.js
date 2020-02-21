#pragma strict

public class mainPlayerStatus extends MonoBehaviour {
	
	public static var instance : mainPlayerStatus;
	public var myInformation : informationHolder;
	
	public var curHP : float;
	public var playerPoint : float = 0f;
	public var playerMoney : int = 0;
	
	public var turretEnabled : boolean = false;
	public var turretTwoEnabled : boolean = false;
	public var ableToPlaceTurret : boolean = true;
	public var turretToSpawn : GameObject[];
	public var currentTurretToSpawn : GameObject;
	
	public var isDamage : boolean = false;
	public var damageBoost : float = 20;
	private var _damageCounter : float;
		
	public var isSpeed : boolean;
	private var _speedCoutner : float;
	
	private var _shockWaveRadius : float = 10f;
	private var _shockWaveImpact : float = 750f;
	
	public var aAudio : AudioClip[];
	public var powerUpAudio : AudioSource;
	
	public var damageEmitter : ParticleEmitter;
	public var speedEmitter : ParticleEmitter;
	
	function Awake(){
		instance = this;
		curHP = myInformation.maxHP;
		
		isDamage = false;
		isSpeed = false;
		
		damageEmitter.emit = false;
		speedEmitter.emit = false;
		
		powerUpAudio = GetComponent(AudioSource) as AudioSource;
		
		playerPoint = myInformation.minDefensePoint;
		playerMoney = 0f;
	}
	
	function Update(){
		if(!mainPlayerAnimation.instance.isDead){
			playerHP();
			playerPointSystem();
		}else{
			return;
		}
		
		if(isDamage == true || isSpeed == true){
			playerDamage();
			playerSpeed();
		}else{
			return;
		}
	}
	
	
	public function playerPointSystem(){
		if(playerPoint <= myInformation.minDefensePoint){
			playerPoint = myInformation.minDefensePoint;
			ableToPlaceTurret = true;
		}else if(playerPoint >= myInformation.maxDefensePoint){
			playerPoint = myInformation.maxDefensePoint;
			ableToPlaceTurret = false;
		}else if(playerPoint <= myInformation.maxDefensePoint){
			ableToPlaceTurret = true;
		}
	}
	
	public function playerHP(){
		if(curHP <= myInformation.minHP){
			curHP = myInformation.minHP;
			mainPlayerController.instance.controllerDie();
		}else if(curHP >= myInformation.maxHP){
			curHP = myInformation.maxHP;
		}
	}
	
	public function damageTrigger(){
		powerUpAudio.clip = aAudio[0] as AudioClip;
		audio.Play();
		isDamage = true;
		audio.loop = false;
		_damageCounter = 10f;
		weapon.instance.damageBoost();
	}
	
	function playerDamage(){
		if(isDamage == true){
			damageEmitter.emit = true;
			_damageCounter -= Time.deltaTime;
			if(_damageCounter <= 0f){
				isDamage = false;
				damageEmitter.emit = false;
				weapon.instance.damageBoost();
			}
		}else{
			isDamage = false;
			damageEmitter.emit = false;
			_damageCounter = 0f;
		}
	}
	
	public function speedTrigger(){
		powerUpAudio.clip = aAudio[1] as AudioClip;
		audio.Play();
		audio.loop = false;
		isSpeed = true;
		_speedCoutner = 10f;
	}
	
	function playerSpeed(){
		if(isSpeed == true){
			speedEmitter.emit = true;
			_speedCoutner -= Time.deltaTime;
			if(_speedCoutner <= 0f){
				speedEmitter.emit = false;
				isSpeed = false;
			}
		}else{
			_speedCoutner = 0f;
			speedEmitter.emit = false;
			isSpeed = false;
		}
		
	}
	
	public function hpTrigger(addhp : float){
		powerUpAudio.clip = aAudio[2] as AudioClip;
		audio.Play();
		audio.loop = false;
		curHP += addhp;
		return curHP;
	}
	
	public function addHP(addhp : float):float{
		curHP += addhp;
		return curHP;
	}
	public function takeHP(takehp : float):float{
		curHP -= takehp;
		return curHP;
	}
	public function addMoney(addCash : int){
		playerMoney += addCash;
		hudMoney.instance.updateMoney();
	}
}