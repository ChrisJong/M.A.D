#pragma strict

public class boss extends MonoBehaviour {
	
	// Reference.
	public static var instance : boss; // giving a refence to this script soo others can access it.
	public var myInformation : informationHolder; // getting a reference to a script which hold all stats variables which we will be accessing.
	public var hpText : TextMesh; // Storing the text mesh that is connected to the gameobject.
	
	// Movement Speed.
	private var _rotateSpeed : float; // this variable stores the rotation speed for when it tries to look at a target.
	private var _moveSpeed : float; // this stores the movement speed the enemy will move at.
	private var _runSpeed : float; // this stores the run speed at which if the enemy gets too far it will speed up.
	
	// Ranges.
	private var _attackRange : float = 30f; // the range at what the enemy can start attacking.
	private var _moveRange : float = 10f; // the range when the enemy can start moving again if the player gets too close.
	private var _displayRange : float = 50f; // the range at when the hptext can be displayed to show the player how much hp it has left.
	
	// Attack.
	private var _fireRate : float = 1f; // how fast the enemy can attack.
	private var _lastFire : float = 0f; // this will store the last time the enemy attacked.
	public var shootObject : Transform[]; // Store gameObjects that will position the bullet at where it appears from.
	public var bulletObject : Rigidbody; // A variable to hold our bullet object to spawn.
	
	// Health.
	private var _curHP : int; // this holds its current hp.
	private var _maxHP : int; // this holds it max hp.
	private var _isDead : boolean = false; // this tells us if the enemy is dead or not.
	
	// Targets.
	private var _target : GameObject; // Storing a variable that will hold what the enemy is targetting.
	private var _playerTarget : GameObject; // This will hold the mainPlayer soo we dont have to go and find the gameobject again.
	//private var _wayTarget : GameObject; // this will hold the current and last waypoint gameobject that was set.
	private var _distance : float; // storing a variable which will calculate the distance between this object and the target.
	
	// Rotation Of Object.
	private var _enemyRotation : Quaternion = Quaternion.identity; // Storing the enemies full transform rotation XYZ.
	private var _enemyRotationX : float; // this will hold all the information for the X rotation of the enemy.
	private var _xQuaternion : Quaternion = Quaternion.identity;  // this will hold the radians/degrees for the X rotation.
	
	// Raycasts.
	private var _directionForward : Vector3 = Vector3.zero; // this info will hold where the ray casts from (at this point its nothing).
	private var _directionLeft : Vector3 = Vector3.zero; // this info will hold where the ray casts from (at this point its nothing).
	private var _directionRight : Vector3 = Vector3.zero; // this info will hold where the ray casts from (at this point its nothing).
	private var _force : float = 30f; // this will tell us how much force should be applied to the rigidbody if the ray hit something.
	private var _jumpForce : float = 20f; // this will tell us how much force should be applied to the rigidbody if the ray hit something.
	
	function Awake(){
		// Reference.
		instance = this;
		
		// Health.
		_isDead = false;
	}
	
	function Start(){
		if(_target == null && _playerTarget == null){ // if the boss doesnt have a target then set one.
			_playerTarget = GameObject.FindWithTag("mainPlayer") as GameObject; // We find the mainPlayer and we store it.
			_target = _playerTarget; // Then we set the enemy's target to the mainPlayer.
		}
		
		// Health.
		_curHP = Random.Range(myInformation.bMinHP, myInformation.bMaxHP); // our current hp is equal to a random number inbetween numbers stored in the informationHolder.
		_maxHP = _curHP; // then our maxHP which is blank will equal to its starting current hp.
		
		redoText(); // We set the text for the boss hp to equal its current hp set (we redisplay or change it text).
		
		_rotateSpeed = myInformation.bRotateSpeed; // Making the _rotateSpeed equal another number in a different script.
		_moveSpeed = myInformation.bMoveSpeed; // Making the _moveSpeed equal another number in a different script.
		_runSpeed = myInformation.bRunSpeed; // Making the _runSpeed equal another number in a different script.
		_fireRate = myInformation.bBulletFireRate; // Making the rate it fires at a number outside of this script in this case in our informationHolder script.
	
		while(true){ // We start a Coroutine to run every 1 and a half seconds. this will help us optimize the frame rate cause finding out the distance between the target and the enemy lowers it a lot when we have multiple enemies on stage.
			distanceToTarget(); // this function will get the distance between this object and the target.
			castRay(); // This will cast rays from the position of the enemy from the left right and foward to see if it hit any objects.
			yield WaitForSeconds(1.25f); // We will pause for a bit and then redo the function from the start.
		}
	}
		
	function FixedUpdate(){
		if(_target == null){ // if there isnt a target then do nothing.
			return;
		}
		
		enemyRotate(); // this function will rotate the enemy towards the target accordingly making it always face the target.
		moveDistance(); // this function will move the enemy to the target.
		attackDistance(); // this function will make the enemy attack accordinly to the distance between the enemy and the target.
		
		if(mainPlayerAnimation.instance.isDead || waveSystem.instance.isWaveEnd){
			die(); // if the mainplayer is dead or the wave is ending the destroy this enemy.
		}
	}
	
	function enemyRotate(){
    	_enemyRotation = Quaternion.LookRotation(_target.transform.position - transform.position); // this will store the radians for how much it should turn to face its target.
    	_enemyRotationX = _enemyRotation.eulerAngles.y; // then we take its currently figured enemyRotation and take is y axis which is left and right and store it.
    	_xQuaternion = Quaternion.AngleAxis(_enemyRotationX, Vector3.up); // then we change the axis of X to become Left and Right, instead of Up and Down.
    	transform.localRotation = Quaternion.Slerp(transform.localRotation, _xQuaternion, Time.deltaTime * _rotateSpeed); // and we start rotating it with a smooth over time. starting from its current rotation numbers and moving to our new rotation to face the player.
    }
    
    function enemyMove(){
        transform.rigidbody.MovePosition(transform.rigidbody.position + transform.TransformDirection(0, 0, _moveSpeed) * Time.deltaTime); // this will move the rigidbody attached to the enemy in the Z axis which is forwards and backwards other time.
    }
    
    function attackTarget(){
    	if(Time.time > _lastFire){ // if the time that this function ran is greater than the last time it attack then run the rest.
    		_lastFire = Time.time + _fireRate; // we set the last time it attacked to its time.time(current time) plus a few more (our fire rate).
    		for(var i : int = 0; i < shootObject.Length; i++){ // we loop through an array which holds gameobject at which a bullet will come from.
    			Instantiate(bulletObject, shootObject[i].position, shootObject[i].rotation); // this function will make or instantiate and bullet out of a gameobjects transforms.
    		}
    	}
    }
    
    function moveDistance(){
    	if(_distance < _moveRange){ // if the target is less than its range then we do nothing. soo the enemy stops moving.
    		return;
    	}else{
    		enemyMove(); // else we make the enemy move cause its out of its range.
    	}
    }
    
    function attackDistance(){
    	if(_distance < _attackRange){ // if the distance between the enemy is < than the attack range then we make the enemy attack.
    		for(var i : int = 0; i < shootObject.Length; i++){ // we loop through the array that holds where it will shoot from.
    			shootObject[i].LookAt(_target.transform); // the object that will shoot out will always look at the target move its rotation accordingly.
    		}
			attackTarget(); // we call on the attackTarget to instaniate a bullet.
    	}else{
    		return; // else we return breaking out of this if statement and we do nothing.
    	}
    }
    
    public function applyDamage(damage : float){
    	_curHP -= damage; // we take away an amount of damage that is sent into this function.
    	redoText(); // we change the text of the hp.
    	if(!_isDead && _curHP <= 0){ // if the enemy is not dead and his hp is <= to 0 then make him dead and run the die funtion.
    		_isDead = true;
    		die();
    	}
    }
    
    function die(){
    	if(_isDead){ // if the enemy is dead then run the rest of the if statement.
    		var randomCash : int = Random.Range(1000, 2000); // we make a variable that will store how much cash you get for each kill.
    		var randomPoint : int = Random.Range(500, 1000);
    		mainPlayerStatus.instance.addMoney(randomCash); // we call on a function outside of this script to add cash and we pass in the randomCash which will add on what random number we get.
    		
    		hudScore.instance.addScore(randomPoint); // we add on to our score.
    		waveSystem.instance.bossOnStage.Pop(); // we remove this enemy from the array.
    		pickUpSpawn.instance.enemyDrop(transform.position, transform.rotation); // we run a function outside of this script that will drop a powerup in the enemys transforms.
  
    		Destroy(gameObject); // we destroy this enemy.
    		Destroy(this); // and we destroy an instance of this script.
    	}else{ // if the enemy isn't dead but we call this function somewhere else like if the wave is over or if the player is dead.
    		Destroy(gameObject); // we destroy this enemy.
    		Destroy(this); // and we destroy an instance of this script.
    	}
    }
    
    function redoText(){ // this function will be called some of the time or whenever the enemy loses hp.
    	hpText.text = _curHP.ToString() + " / " + _maxHP.ToString();
    }
    
    public function distanceToTarget(){ // this function will be called in the Coroutine in the while loop in the start function.
    	_distance = Vector3.Distance(transform.position, _target.transform.position); // We will get the magnitude/distance between the enemy and the _target transform.position.
    	
    	if(_distance < _displayRange){ // if the distance between the player and the enemy is less than our displayRange.
    		hpText.gameObject.active = true; // then we display the text for its hp.
    	}else {
    		hpText.gameObject.active = false; // else we turn if off.
    	}
    }
    
    /*public function findNearestWay(){
  	  	if(wayPointAreas.instance.wayPointOn){ // This will tell us if the mainPlayer has hit the collider telling us his on the bridge.
	    	var distance : float = 0f; // Create a variable which will hold the distance of 2 objects.
			for(var closestWayPoint : GameObject in wayPoints){ // for each of the wayPoints in the array we put it into another variable, like a for loop.
				distance = Vector3.Distance(closestWayPoint.transform.position, transform.position); // we put the distance between one of the wayPoints gameobject and the enemy's transform.
				if(distance < 200f){ // if the distance of the object is less than 200f.
					_target = closestWayPoint.gameObject; // then our new target is the object that is less than 200f between the enemy and one of the way points.
					_wayTarget = closestWayPoint.gameObject; // we store our new wayTarget into a variable for safe keep or to use later.
					distance = closestWayPoint.transform.position.magnitude; // our new distance is equal to the current wayPoint position of the object.
				}
			}
		}else{ // if the player isnt on the bridge them we turn our target to the mainPlayer again.
			_target = _playerTarget;
		}
    }*/
    
    function castRay(){
    	var hitInfo : RaycastHit; // this variable will hold all the data that the raycast finds or doesnt.
    	var distance : float = 10f; // the distance at what the raycast can reach at.
    	
    	_directionForward = transform.TransformDirection(Vector3.forward); // the direction at what the raycasts at, at this point it casts forward of the enemy.
		_directionLeft = transform.TransformDirection(Vector3.left); // the direction at what the raycasts at, at this point it casts left of the enemy.
		_directionRight = transform.TransformDirection(Vector3.right); // the direction at what the raycasts at, at this point it casts right of the enemy.
    	
    	if(Physics.Raycast(transform.position, _directionForward, hitInfo, distance)){ // if we cast a ray from its middle and direct it forward at a range of 10, and put all the information into our hitInfo.
    		if(hitInfo.transform.tag == "avoid"){ // if it has hit anything with the tag "avoid".
    			transform.rigidbody.AddForce(Vector3.back * _force, ForceMode.Force); // then we add some force to the object pushing it forward. (meaning we apply force from the back which will push it forward).
    			transform.rigidbody.AddForce(Vector3.left * _force, ForceMode.Force); // we also add some force to the object pushing it right.
    			
    		}
    		
    		if(hitInfo.transform.tag == "jumpAvoid"){ // if we hit something tagged "jumpAvoid".
    			transform.rigidbody.AddForce(Vector3.up * _jumpForce); // we then add some force pusing the object upwards.
    		}
    	}
    	
    	if(Physics.Raycast(transform.position, _directionLeft, hitInfo, distance)){ // if we cast a ray from its middle and direct it left at a range of 10, and put all the information into our hitInfo.
    		if(hitInfo.transform.tag == "avoid"){
    			transform.rigidbody.AddForce(Vector3.left * _force, ForceMode.Force); // then we add some force to the object pushing it right. 
    		}
    		
    		if(hitInfo.transform.tag == "jumpAvoid"){
    			transform.rigidbody.AddForce(Vector3.up * _jumpForce); // then we add some force to the object pushing it upwards. 
    		}
    	}
    	
    	if(Physics.Raycast(transform.position, _directionRight, hitInfo, distance)){ // if we cast a ray from its middle and direct it right at a range of 10, and put all the information into our hitInfo.
    		if(hitInfo.transform.tag == "avoid"){
    			transform.rigidbody.AddForce(Vector3.right * _force, ForceMode.Force); // then we add some force to the object pushing it left. 
    		}
    		
    		if(hitInfo.transform.tag == "jumpAvoid"){ 
    			transform.rigidbody.AddForce(Vector3.up * _jumpForce); // then we add some force to the object pushing it upwards. 
    		}
    	}
    }
}