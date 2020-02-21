#pragma strict

public class mainPlayerAnimation extends MonoBehaviour {
	
	public static var instance : mainPlayerAnimation;
	
	public enum direction {
		stationary,
		forward,
		backward,
		left,
		right,
		leftForward,
		rightForward,
		leftBackward,
		rightBackward
	}
	public var moveDirection : direction;
	
	public enum characterState {
		idle,
		walking,
		running,
		walkingBackwards,
		runningBackwards,
		strafingLeft,
		runningLeft,
		strafingRight,
		runningRight,
		jumping,
		falling,
		landing,
		sliding,
		dead,
		actionLocked
	}
	public var state : characterState;
	
	public var isDead : boolean = false;
	
	private var _lastState : characterState;
	
	private var _root : Transform;
	private var _characterMesh : Transform;
	public var normalWeaponMesh : GameObject;
	public var rocketLauncherMesh : GameObject;
	public var shotgunMesh : GameObject;
	private var _characterRPadMesh : Transform;
	private var _characterLPadMesh : Transform;
	private var _ragdoll : GameObject;
	private var _initialPosition : Vector3 = Vector3.zero;
	private var _initialRotation : Quaternion = Quaternion.identity;
	
	function Awake(){
		instance = this;
		_root = transform.FindChild("Root") as Transform;
		_characterMesh = transform.FindChild("CharacterMesh") as Transform;
		normalWeaponMesh = GameObject.FindGameObjectWithTag("normalWeapon") as GameObject;
		rocketLauncherMesh = GameObject.FindGameObjectWithTag("rocketLauncher") as GameObject;
		shotgunMesh = GameObject.FindGameObjectWithTag("shotGun") as GameObject;
		_characterRPadMesh = transform.FindChild("Root/Pelvis/Spine/Spine1/Spine2/Neck/RClavicle/RUpperArm/RShoulderPad") as Transform;
		_characterLPadMesh = transform.FindChild("Root/Pelvis/Spine/Spine1/Spine2/Neck/LClavicle/LUpperArm/LShoulderPad") as Transform;
		_initialPosition = transform.position;
		_initialRotation = transform.rotation;
		rocketLauncherMesh.SetActiveRecursively(false);
		shotgunMesh.SetActiveRecursively(false);
	}
	
	function Update(){
		determineCurrentState();
		processCurrentState();
	}
	
	public function determineMoveDirection(){
		var forward = false;
		var backward = false;
		var left = false;
		var right = false;
		
		if(mainPlayerMovement.instance.moveVector.z > 0){
			forward = true;
		}
		if(mainPlayerMovement.instance.moveVector.z < 0){
			backward = true;
		}
		if(mainPlayerMovement.instance.moveVector.x > 0){
			right = true;
		}
		if(mainPlayerMovement.instance.moveVector.x < 0){
			left = true;
		}
		
		if(forward){
			if(left){
				moveDirection = direction.leftForward;
			}else if(right){
				moveDirection = direction.rightForward;
			}else{
				moveDirection = direction.forward;
			}
		}else if(backward){
			if(left){
				moveDirection = direction.leftBackward;
			}else if(right){
				moveDirection = direction.rightBackward;
			}else{
				moveDirection = direction.backward;
			}
		}else if(left){
			moveDirection = direction.left;
		}else if(right){
			moveDirection = direction.right;
		}else{
			moveDirection = direction.stationary;
		}
	}
	
	function determineCurrentState(){
		if(state == characterState.dead){
			return;
		}
		
		if(!mainPlayerController.instance.mainController.isGrounded){
			if(state != characterState.falling && state != characterState.jumping && state != characterState.landing){
				animationFall();
			}
		}
		
		if(waveSystem.instance.isWaveEnd){
			state = characterState.idle;
			moveDirection = direction.stationary;
		}
		
		if(state != characterState.falling && state != characterState.jumping && state != characterState.landing && state != characterState.sliding){
			switch(moveDirection){
			
				case direction.stationary:
					state = characterState.idle;
				break;
				
				case direction.forward:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.running;
					}else{
						state = characterState.walking;
					}
				break;
				
				case direction.backward:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.runningBackwards;
					}else{
						state = characterState.walkingBackwards;
					}
				break;
				
				case direction.left:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.runningLeft;
					}else{
						state = characterState.strafingLeft;
					}
				break;
				
				case direction.right:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.runningRight;
					}else{
						state = characterState.strafingRight;
					}
				break;
				
				case direction.leftForward:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.running;
					}else{
						state = characterState.walking;
					}
				break;
				
				case direction.rightForward:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.running;
					}else{
						state = characterState.walking;
					}
				break;
				
				case direction.leftBackward:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.runningBackwards;
					}else{
						state = characterState.walkingBackwards;
					}
				break;
				
				case direction.rightBackward:
					if(mainPlayerMovement.instance.isRunning == true){
						state = characterState.runningBackwards;
					}else{
						state = characterState.walkingBackwards;
					}
				break;

			}
		}
	}
	
	function processCurrentState(){
		switch(state){
			case characterState.idle:
				idle();
			break;
			
			case characterState.walking:
				walking();
			break;
			
			case characterState.running:
				running();
			break;
			
			case characterState.walkingBackwards:
				walkingBackwards();
			break;
			
			case characterState.runningBackwards:
				runningBackwards();
			break;
			
			case characterState.strafingLeft:
				strafeLeft();
			break;
			
			case characterState.runningLeft:
				runningLeft();
			break;
			
			case characterState.strafingRight:
				strafeRight();
			break;
			
			case characterState.runningRight:
				runningRight();
			break;
			
			case characterState.jumping:
				jump();
			break;
			
			case characterState.falling:
				fall();
			break;
			
			case characterState.landing:
				land();
			break;
			
			case characterState.sliding:
				slide();
			break;
			
			case characterState.dead:
				dead();
			break;
			
			case characterState.actionLocked:
				
			break;
		}
	}
	
	function idle(){
		animation.CrossFade("idle");
	}
	
	function walking(){
		animation.CrossFade("walkForward");
	}
	
	function running(){
		animation.CrossFade("runForward");
	}
	
	function walkingBackwards(){
		animation.CrossFade("walkBackward");
	}
	
	function runningBackwards(){
		animation.CrossFade("runBackward");
	}
	
	function strafeLeft(){
		animation.CrossFade("strafeLeft");
	}
	
	function runningLeft(){
		animation.CrossFade("strafeLeftRun");
	}
	
	function strafeRight(){
		animation.CrossFade("strafeRight");
	}
	
	function runningRight(){
		animation.CrossFade("strafeRightRun");
	}
	
	function jump(){
		if((!animation.isPlaying && mainPlayerController.mainController.isGrounded) || mainPlayerController.mainController.isGrounded){
			if(_lastState == characterState.walking){
				animation.CrossFade("land");
			}else{
				// run land.
				animation.CrossFade("land");
			}
			state = characterState.landing;
		}
		else if(!animation.IsPlaying("jump")){
			state = characterState.falling;
			animation.CrossFade("falling");
			mainPlayerMovement.instance.IsFalling = true;
		}else{
			state = characterState.jumping;
		}
	}
	
	function fall(){
		if(mainPlayerController.mainController.isGrounded){
			if(_lastState == characterState.walking){ // run land.
				animation.CrossFade("land");
			}else{
				// walk land.
				animation.CrossFade("land");
			}
			state = characterState.landing;
		}
	}
	
	function land(){
		if(_lastState == characterState.walking){
			if(!animation.IsPlaying("land")){ // run land
				state = characterState.idle;
				animation.Play("idle");
			}
		}else{
			if(!animation.IsPlaying("landing")){ // walk land Animation.
				state = characterState.idle;
				animation.Play("idle");
			}
		}
		mainPlayerMovement.instance.IsFalling = false;
	}
	
	function slide(){
		if(!mainPlayerMovement.instance.isSliding){
			state = characterState.idle;
			animation.CrossFade("idle");
		}
	}
	
	function dead(){
		state = characterState.dead;
	}
	
	function reset(){
		isDead = false;
		mainPlayerCamera.instance.distance = 1f;
		transform.position = _initialPosition;
		transform.rotation = _initialRotation;
		state = characterState.idle;
		animation.Play("idle");
		clearRagdoll();
	}
	
	public function animationJump(){
		if(!mainPlayerController.mainController.isGrounded || isDead || state == characterState.jumping){
			return;
		}
		_lastState = state;
		state = characterState.jumping;
		animation.CrossFade("jump");
	}
	
	public function animationFall(){
		if(isDead){
			return;
		}
		_lastState = state;
		state = characterState.falling;
		mainPlayerMovement.instance.IsFalling = true;
		animation.CrossFade("falling");
	}
	
	public function animationSlide(){
		state = characterState.sliding;
		//sliding animation.
		animation.CrossFade("idle");
		
	}
	
	public function animationDead(){
		isDead = true;
		dead();
		setupRagdoll();
	}
	
	function setupRagdoll(){ // Creating a new Ragdoll when we die, it also needs to match out the mainPlayers rotation and position and also match every joint in the ragdoll with the mainplayers joints.
		
		// Create a ragdoll.
		// Match the mainPlayers pos and rot to the ragdoll.
		if(_ragdoll == null){
			_ragdoll = GameObject.Instantiate(Resources.Load("mainPlayerRagdoll"), transform.position, transform.rotation) as GameObject;
		}
		// We are looking for the players root node in the biped.
		var mainPlayerRoot = transform.FindChild("Root");
		var ragdollRoot = _ragdoll.transform.FindChild("Root");
		
		matchRagdollTransform(mainPlayerRoot, ragdollRoot);
		mainPlayerCamera.instance.targetLookAt = _ragdoll.transform.FindChild("Root/Pelvis/Spine"); // Tells the camera to look at the ragdoll.
		
		// Hide the mainPlayer.
		_characterMesh.renderer.enabled = false;
		normalWeaponMesh.renderer.enabled = false;
		_characterRPadMesh.renderer.enabled = false;
		_characterLPadMesh.renderer.enabled = false;
	}
	
	function clearRagdoll(){ // This will Destory the ragdoll and show our mainPlayer again.
		if(_ragdoll != null){ // Destroy the ragdoll.
			GameObject.Destroy(_ragdoll);
			_ragdoll = null;
		}
		// And show the mainPlayer again.
		_characterMesh.renderer.enabled = true;
		normalWeaponMesh.renderer.enabled = true;
		_characterRPadMesh.renderer.enabled = true;
		_characterLPadMesh.renderer.enabled = true;
		mainPlayerCamera.instance.targetLookAt = transform.FindChild("targetLookAt"); // Tell the camera to look at our mainPlayer's targetlookAt Object.
	}
	
	function matchRagdollTransform(source : Transform, target : Transform){ // This will match the joints in the biped to the ragdoll. source (mainPlayer) target(ragdoll)
		if(source.childCount > 0){ // Cycle through the biped heirarchy of our mainPlayer to match the joint rotations of the ragdoll.
			for(var oldSourceTransform in source.transform){
				var sourceTransform : Transform = oldSourceTransform as Transform;
				var targetTransform : Transform = target.Find(sourceTransform.name);
				
				if(targetTransform != null){
					matchRagdollTransform(sourceTransform, targetTransform);
					targetTransform.localPosition = sourceTransform.localPosition;
					targetTransform.localRotation = sourceTransform.localRotation;
				}
			}
		}
	}
}