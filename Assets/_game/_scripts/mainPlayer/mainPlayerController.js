#pragma strict

public class mainPlayerController extends MonoBehaviour {
	
	// Reference.
	public static var instance : mainPlayerController;
	public static var mainController : CharacterController;
	public var myInformation : informationHolder;
	
	public var turretPlacement : GameObject;
	public var currentNumber : int = 0;
	
	function Awake(){
		instance = this;
		mainController = GetComponent("CharacterController") as CharacterController;
		mainPlayerCamera.findOrCreate();
		weaponRayCast.findOrCreate();
		turretPlacement = GameObject.FindWithTag("turretPlacement") as GameObject;
		
	}
	
	function Update(){
		if(Camera.mainCamera == null){
			return;
		}
		mainPlayerMovement.instance.resetMovement();
		
		if(!waveSystem.instance.isWaveEnd && !mainPlayerAnimation.instance.isDead && (mainPlayerAnimation.instance.state != mainPlayerAnimation.characterState.landing || mainPlayerAnimation.instance.animation.IsPlaying("land"))){
			getControllerInput();
			handleActionInput();
			mainPlayerMovement.instance.updateMovement();
		}else if(mainPlayerAnimation.instance.isDead){
			return;
		}
	}
	
	function getControllerInput(){
		var deadZone : float = 0.1f;
		
		if(Input.GetAxis("Vertical") > deadZone || Input.GetAxis("Vertical") < -deadZone){
			mainPlayerMovement.instance.moveVector += new Vector3(0,0,Input.GetAxis("Vertical"));
		}
		if(Input.GetAxis("Horizontal") > deadZone || Input.GetAxis("Horizontal") < -deadZone){
			mainPlayerMovement.instance.moveVector += new Vector3(Input.GetAxis("Horizontal"),0,0);
		}
		
		mainPlayerAnimation.instance.determineMoveDirection();
	}
	
	function handleActionInput(){
		if(Input.GetButton("Jump") && !mainPlayerMovement.instance.isFalling){
			controllerJump();
		}
		
		if(Input.GetKey(KeyCode.LeftShift) && !mainPlayerStatus.instance.isSpeed){
			mainPlayerMovement.instance.isRunning = true;
		}else{
			mainPlayerMovement.instance.isRunning = false;
		}
		
		if(Input.GetKeyDown("1")){
			weapon.instance.playerWeapon = weapon.instance.weaponType.normal;
			weapon.instance.setGun();
		}
		if(weapon.instance.rocketEnabled && Input.GetKeyDown("2")){
			weapon.instance.playerWeapon = weapon.instance.weaponType.rocket;
			weapon.instance.setGun();
		}
		if(weapon.instance.shotgunEnabled && Input.GetKeyDown("3")){
			weapon.instance.playerWeapon = weapon.instance.weaponType.shotgun;
			weapon.instance.setGun();
		}
		
		if(Input.GetKeyDown(KeyCode.Tab)){
			if(mainPlayerStatus.instance.turretEnabled && mainPlayerStatus.instance.turretTwoEnabled){
				currentNumber++;
			}else if(mainPlayerStatus.instance.turretEnabled && !mainPlayerStatus.instance.turretTwoEnabled){
				currentNumber = 0;
			}else if(mainPlayerStatus.instance.turretTwoEnabled && !mainPlayerStatus.instance.turretEnabled){
				currentNumber = 1;
			}else{
				currentNumber = -1;
			}
			
			if(currentNumber >= mainPlayerStatus.instance.turretToSpawn.Length){
				currentNumber = 0;
			}
		}
		
		if(Input.GetKeyDown(KeyCode.T) && mainPlayerStatus.instance.ableToPlaceTurret){
			var turretPlace : GameObject;
			if(mainPlayerStatus.instance.turretEnabled && (currentNumber == 0)){
				turretPlace = Instantiate(Resources.Load("turret1"), turretPlacement.transform.position, turretPlacement.transform.rotation) as GameObject;
				turretPlace.GetComponent(turret).tState = turretPlace.GetComponent(turret).turretState.on;
				mainPlayerStatus.instance.playerPoint += 10f;
			}else if(mainPlayerStatus.instance.turretTwoEnabled && (currentNumber == 1)){
				turretPlace = Instantiate(Resources.Load("turret2"), turretPlacement.transform.position, turretPlacement.transform.rotation) as GameObject;
				turretPlace.GetComponent(turretTwo).tState = turretPlace.GetComponent(turretTwo).turretState.on;
				mainPlayerStatus.instance.playerPoint += 10f;
			}else{
				return;
			}
		}
		
		if(Input.GetMouseButtonDown(1)){
			mainPlayerCamera.instance.isFOV = true;
		}else if(Input.GetMouseButtonUp(1)){
			mainPlayerCamera.instance.isFOV = false;
		}
	}
	
	public function controllerJump(){
		mainPlayerMovement.instance.movementJump();
		mainPlayerAnimation.instance.animationJump();
	}
	
	public function controllerDie(){
		mainPlayerAnimation.instance.animationDead();
	}
}

@script RequireComponent(typeof(CharacterController));