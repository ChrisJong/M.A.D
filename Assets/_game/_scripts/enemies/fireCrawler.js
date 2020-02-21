#pragma strict

public class fireCrawler extends MonoBehaviour {
	
	// Reference.
	public static var instance : fireCrawler;
	public var myInformation : informationHolder;
	public var hpText : TextMesh; // Storing the text mesh that is connected to the gameobject.
	
	// Way-Points.
	public var wayPoints : GameObject[];
	
	// Movement Speed.
	private var _rotateSpeed : float;
	private var _moveSpeed : float;
	private var _runSpeed : float;
	
	// Ranges.
	private var _attackRange : float = 30f;
	private var _meleeRange : float = 10f;
	private var _moveRange : float = 10f;
	private var _displayRange : float = 50f;
	
	// Attack.
	private var _fireRate : float = 1f;
	private var _lastFire : float = 0f;
	private var _meleeDamage : int;
	private var _fireMelee : float;
	private var _lastMeleeFire : float = 0f;
	public var shootObject : Transform[]; // Store gameObjects that will position the bullet at where it appears from.
	public var bulletObject : Rigidbody; // A variable to hold our bullet object to spawn.
	
	// Health.
	private var _curHP : int;
	private var _maxHP : int;
	private var _isDead : boolean = false;
	
	// Targets.
	private var _target : GameObject; // Storing a variable that will hold what the enemy is targetting.
	private var _playerTarget : GameObject; // This will hold the mainPlayer soo we dont have to go and find the gameobject again.
	private var _wayTarget : GameObject; // this will hold the current and last waypoint gameobject that was set.
	private var _distance : float; // storing a variable which will calculate the distance between this object and the target.
	
	// Rotation Of Object.
	private var _enemyRotation : Quaternion = Quaternion.identity; // Storing the enemies full transform rotation XYZ.
	private var _enemyRotationX : float;
	private var _xQuaternion : Quaternion = Quaternion.identity; 
	
	// Raycasts.
	private var _directionForward : Vector3 = Vector3.zero;
	private var _directionLeft : Vector3 = Vector3.zero;
	private var _directionRight : Vector3 = Vector3.zero;
	private var _force : float = 30f;
	private var _jumpForce : float = 20f;
	
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
		_curHP = Random.Range(myInformation.bMinHP, myInformation.bMaxHP);
		_maxHP = _curHP;
		
		redoText(); // We set the text for the boss hp to equal its current hp set.
		
		_rotateSpeed = myInformation.bRotateSpeed; // Making the _rotateSpeed equal another number in a different script.
		_moveSpeed = myInformation.bMoveSpeed; // Making the _moveSpeed equal another number in a different script.
		_runSpeed = myInformation.bRunSpeed; // Making the _runSpeed equal another number in a different script.
		_fireRate = myInformation.bBulletFireRate;
		_fireMelee = myInformation.bMeleeFireRate;
		_meleeDamage = myInformation.bMeleeDamage;
		
		wayPoints = GameObject.FindGameObjectsWithTag("wayPoints"); // This will find all the wayPoints that are tagged with "wayPoints" and store them into an array.
	
		while(true){ // We start a Coroutine to run every 1 and a half seconds. this will help us optimize the frame rate cause finding out the distance between the target and the enemy lowers it a lot when we have multiple enemies on stage.
			distanceToTarget(); // this function will get the distance between this object and the target.
			castRay(); // This will cast rays from the position of the enemy from the left right and foward to see if it hit any objects.
			yield WaitForSeconds(1.25f); // We will pause for a bit the redo.
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
    	_enemyRotation = Quaternion.LookRotation(_target.transform.position - transform.position);
    	_enemyRotationX = _enemyRotation.eulerAngles.y;
    	_xQuaternion = Quaternion.AngleAxis(_enemyRotationX, Vector3.up);
    	transform.localRotation = Quaternion.Slerp(transform.localRotation, _xQuaternion, Time.deltaTime * _rotateSpeed);
    }
    
    function enemyMove(){
        transform.rigidbody.MovePosition(transform.rigidbody.position + transform.TransformDirection(0, 0, _moveSpeed) * Time.deltaTime);
        if(!animation.IsPlaying("attack")){
        	animation.CrossFade("walk");
        }
    }
    
    function attackTarget(){
    	if(Time.time > _lastFire){ // if the time that this function ran is greater than the last time it attack then run the rest.
    		_lastFire = Time.time + _fireRate; // we set the last time it attacked to its time.time soo now plus a few more.
    		for(var i : int = 0; i < shootObject.Length; i++){
    			Instantiate(bulletObject, shootObject[i].position, shootObject[i].rotation); // this function will make or instantiate and bullet out of a gameobjects transforms.
    		}
    	}
    }
    
     function attackMelee(){
    	if(Time.time > _lastMeleeFire && !animation.IsPlaying("attack")){
    		animation.Play("attack");
    		_lastMeleeFire = Time.time + _fireMelee;
    		mainPlayerStatus.instance.takeHP(_meleeDamage);
    	}
    }
    
    function moveDistance(){
    	if(_distance < _moveRange){ // if the target is less than its range then we do nothing. soo the enemy stops moving.
    		if(!animation.IsPlaying("attack")){
    			animation.CrossFade("idle");
    		}
    		return;
    	}else{
    		enemyMove(); // else we make the enemy move cause its out of its range.
    	}
    }
    
    function attackDistance(){
    	if(_distance < _attackRange){ // if the distance between the enemy is < than the attack range then we make the enemy attack.
    		for(var i : int = 0; i < shootObject.Length; i++){
    			shootObject[i].LookAt(_target.transform); // the object that will shoot out will always look at the target move its rotation accordingly.
    			attackTarget();
    		}
    		if(_distance < _meleeRange){
    			attackMelee();
    		}
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
    	if(_isDead){ // if the player is dead then run the rest of the if statement.
    		var randomCash : int = Random.Range(1000, 2000); // we make a variable that will store how much cash you get for each kill.
    		var randomPoint : int = Random.Range(500, 1000);
    		mainPlayerStatus.instance.addMoney(randomCash); // we call on a function outside of this script to add cash and we pass in the randomCash which will add on what random number we get.
    		
    		hudScore.instance.addScore(randomPoint); // we add on to our score.
    		waveSystem.instance.bossOnStage.Pop(); // we remove this enemy from the array.
    		pickUpSpawn.instance.enemyDrop(transform.position, transform.rotation); // we run a function outside of this script that will drop a powerup in the enemys transforms.
  
    		Destroy(gameObject); // we destroy this enemy.
    		Destroy(this);
    	}else{ // if the enemy isn't dead but we call this function somewhere else like if the wave is over or if the player is dead.
    		Destroy(gameObject); // we destroy this enemy.
    		Destroy(this);
    	}
    }
    
    function redoText(){ // this function will be called some of the time or whenever the enemy loses hp.
    	hpText.text = _curHP.ToString() + " / " + _maxHP.ToString();
    }
    
    public function distanceToTarget(){ // this function will be called in the Coroutine in the while loop in the start function.
    	_distance = Vector3.Distance(transform.position, _target.transform.position); // We will get the magnitude/distance between the enemy and the _target transform.position.
    	
    	if(_distance < _displayRange){
    		hpText.gameObject.active = true;
    	}else {
    		hpText.gameObject.active = false;
    	}
    }
    
    public function findNearestWay(){
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
    }
    
    function castRay(){
    	var hitInfo : RaycastHit;
    	var distance : float = 10f;
    	
    	_directionForward = transform.TransformDirection(Vector3.forward);
		_directionLeft = transform.TransformDirection(Vector3.left);
		_directionRight = transform.TransformDirection(Vector3.right);
		
		Debug.DrawRay(transform.position, _directionForward * distance, Color.red);
		Debug.DrawRay(transform.position, _directionLeft * distance, Color.blue);
		Debug.DrawRay(transform.position, _directionRight * distance, Color.green);
    	
    	if(Physics.Raycast(transform.position, _directionForward, hitInfo, distance)){
    		if(hitInfo.transform.tag == "avoid"){
    			transform.rigidbody.AddForce(Vector3.back * _force, ForceMode.Force);
    			transform.rigidbody.AddForce(Vector3.left * _force, ForceMode.Force);
    			
    		}
    		
    		if(hitInfo.transform.tag == "jumpAvoid"){
    			transform.rigidbody.AddForce(Vector3.up * _jumpForce, ForceMode.Force);
    		}
    	}
    	
    	if(Physics.Raycast(transform.position, _directionLeft, hitInfo, distance)){
    		if(hitInfo.transform.tag == "avoid"){
    			transform.rigidbody.AddForce(Vector3.left * _force, ForceMode.Force);
    		}
    		
    		if(hitInfo.transform.tag == "jumpAvoid"){
    			transform.rigidbody.AddForce(Vector3.up * _jumpForce, ForceMode.Force);
    		}
    	}
    	
    	if(Physics.Raycast(transform.position, _directionRight, hitInfo, distance)){
    		if(hitInfo.transform.tag == "avoid"){
    			transform.rigidbody.AddForce(Vector3.right * _force, ForceMode.Force);
    		}
    		
    		if(hitInfo.transform.tag == "jumpAvoid"){
    			transform.rigidbody.AddForce(Vector3.up * _jumpForce , ForceMode.Force);
    		}
    	}
    }
	
}