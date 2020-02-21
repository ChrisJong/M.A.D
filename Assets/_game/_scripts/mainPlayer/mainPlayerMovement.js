#pragma strict

public class mainPlayerMovement extends MonoBehaviour {
	
	// Reference.
	public static var instance : mainPlayerMovement; // Creating an instance to this script to be accessed across other script.
	public var moveVector : Vector3 = Vector3.zero;
	private var _slideDirection : Vector3;
	
	// Character movements.
	public var forwardSpeed : float = 10f; // Creating a variable to hold the forward Speed.
	public var backwardSpeed : float = 5f; // Creating a variable to hold the backward speed.
	public var strafeSpeed : float = 5f; // Creating a variable to hold the strafing speed.
	public var jumpSpeed : float = 8f; // Creating a variable to hold the how far the jump height of the mainPlayer can reach.
	public var slideSpeed : float = 10f; // how fast the player can slide.
	
	public var slideThreshold : float = 0.8f; // the angle on what the player can slide down at.
	public var maxControlSlide : float = 0.4f; // the angle on what the player can still control movement.
	public var isSliding : boolean; // if the player is sliding or not.
	
	public var isRunning : boolean; // if the player is running or not.
	private var _runMultiplier : float = 3f; // a variable that will multiply the movement speed.
	private var _speedPickUpMulti : float = 6f; // a variable that will multiply the movement speed.
	
	public var isFalling : boolean; // if the player is falling or not.
	private var _fatalFallHeight : float = 30f; // at what range the player will die when falling.
	private var _startFallHeight : float; // a variable that will hold a number at which the player started falling.
	
	// Gravity.
	public var gravity : float = 21f; // how much gravity is going to be applied to the player.
	public var terminalVelocity : float = 20f; // Creating a variable to hold the terminal Velocity.
	private var _verticleVelocity : float; // Creating a variable to cache or store our vertical Velocity.
	
	
	// Placing getter and setters to see if isFalling is true or not. and if it is true then set the _startFallHeight to the current players transform.
	public function get IsFalling():boolean{
		return isFalling;
	}
	public function set IsFalling(value : boolean){
		isFalling = value;
		if(isFalling){
	 		_startFallHeight = transform.position.y;
	 	}else{
	 		if(_startFallHeight - transform.position.y >  _fatalFallHeight){ // else if the player isnt falling but his startfallheight is greater than the fatalfallheight then he should die.
	 			mainPlayerController.instance.controllerDie();
	 		}
	 	}
	}
	
	function Awake(){
		instance = this;
	}
	
	public function updateMovement(){
		processMovement(); // Runs the processMovement function to actully move the mainPlayer.
		snapCameraToMain(); // Runs the snapCameraToPlayer function to move the mainCamera to the player and stay there.
	}
	
	public function resetMovement(){
		_verticleVelocity = moveVector.y; // This will save the current moveVector.y to vertical velocity and then zero out next.
		moveVector = Vector3.zero; // Making our moveVector to be zero, soo it doesnt add up, instead adding up and reseting back to zero.
	}
	
	function processMovement(){
		if(!mainPlayerAnimation.instance.isDead){
			moveVector = transform.TransformDirection(moveVector); // Transform the moveVector into worldspace relative to our character rotation.
		}else{
			moveVector = new Vector3(0, moveVector.y, 0);
		}
		
		if(moveVector.magnitude > 1){
			moveVector = Vector3.Normalize(moveVector); // Normalize our moveVector if our magnatiude is > 1.
		}
		
		applySlide();
		
		moveVector *= moveSpeed(); // Setting a new magnatiude based on our movespeeds (Mulitply moveVector by moveSpeed).
		
		moveVector = new Vector3(moveVector.x, _verticleVelocity, moveVector.z); // We need to reapply our verticalVel to our moveVector.y.
		
		applyGravity(); // Apply Gravity (Calling the function).
		
		mainPlayerController.mainController.Move(moveVector * Time.deltaTime); // We have to now move our character based in world space from the calculations made in units per second instead of per frame.
	}
	
	function applyGravity(){
		if(moveVector.y > -terminalVelocity){
			moveVector = new Vector3(moveVector.x, moveVector.y - gravity * Time.deltaTime, moveVector.z);
		}
		if(mainPlayerController.mainController.isGrounded && moveVector.y < -1){ // If the mainPlayer isGrounded or its Position.y = -1.
			moveVector = new Vector3(moveVector.x, -1, moveVector.z); // Then set the moveVector of the mainPlayer to equal a new Vector3(x,y,z) and set its x and z to whatever the preivous moveVector.x and z value was and set the moveVector to always be -1.
		}
	}
	
	function applySlide(){
		if(!mainPlayerController.mainController.isGrounded){
			return;
		}
		_slideDirection = Vector3.zero;
		
		var hitInfo : RaycastHit;
		
		if(Physics.Raycast(transform.position + Vector3.up, Vector3.down, hitInfo)){
			if(hitInfo.normal.y < slideThreshold){
				_slideDirection = new Vector3(hitInfo.normal.x, -hitInfo.normal.y, hitInfo.normal.z);
				if(!isSliding){
					mainPlayerAnimation.instance.animationSlide();
				}
				isSliding = true;
			}else{
				isSliding = false;
			}
		}
		
		if(_slideDirection.magnitude < maxControlSlide){	
			moveVector += _slideDirection;
		}else{
			moveVector = _slideDirection;
		}
	}
	
	public function movementJump(){
		if(mainPlayerController.mainController.isGrounded && !isSliding){ // If our player is grounded and this function is called. it will make our vertical Velocity equal to our jump height.
			_verticleVelocity = jumpSpeed;
		}
	}
	
	function snapCameraToMain(){
		if(moveVector.x != 0 || moveVector.z != 0 || Input.GetAxis("Mouse X")){ // Check if we are moving, and if we are moving its going to align the camera position/view to our player.
			transform.rotation = Quaternion.Euler(transform.eulerAngles.x, Camera.mainCamera.transform.eulerAngles.y, transform.eulerAngles.z);
		}
	}
	
	function moveSpeed():float{ // This function will calculate the value of our moveSpeed depending on its direction.
		var speed : float = 0f;
		
		switch(mainPlayerAnimation.instance.moveDirection){
			case mainPlayerAnimation.direction.stationary:
				speed = 0f;
				break;
			case mainPlayerAnimation.direction.forward:
				speed = forwardSpeed;
				break;
			case mainPlayerAnimation.direction.backward:
				speed = backwardSpeed;
				break;
			case mainPlayerAnimation.direction.left:
				speed = strafeSpeed;
				break;
			case mainPlayerAnimation.direction.right:
				speed = strafeSpeed;
				break;
			case mainPlayerAnimation.direction.leftForward:
				speed = forwardSpeed;
				break;
			case mainPlayerAnimation.direction.rightForward:
				speed = forwardSpeed;
				break;
			case mainPlayerAnimation.direction.leftBackward:
				speed = backwardSpeed;
				break;
			case mainPlayerAnimation.direction.rightBackward:
				speed = backwardSpeed;
				break;
		}
		if(isSliding){
			speed = slideSpeed;
		}
		
		if(isRunning == true){
			return speed * _runMultiplier;
		}else if(mainPlayerStatus.instance.isSpeed){
			return speed * _speedPickUpMulti;
		}
		else{
			return speed;
		}
	}

}