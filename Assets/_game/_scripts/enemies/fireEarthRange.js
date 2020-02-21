#pragma strict

public class fireEarthRange extends MonoBehaviour {
	
	// Reference.
	public static var instance : fireEarthRange;
	public var myInformation : informationHolder;
	public var hpText : TextMesh;
	
	// Movement Speed.
	private var _rotateSpeed : float;
	private var _moveSpeed : float;
	private var _runSpeed : float;
	
	// Ranges.
	private var _attackRange : float = 25f;
	private var _moveRange : float = 3f;
	private var _displayRange : float = 60f;
	
	// Attack.
	public var shootObject : Transform;
	public var bulletObject : Rigidbody;
	private var _fireRate : float;
	private var _lastFire : float = 0f;
	
	// Health.
	private var _curHP : int;
	private var _maxHP : int;
	private var _isDead : boolean = false;
	
	// Targets.
	private var _target : GameObject;
	private var _playerTarget : GameObject;
	private var _distance : float;
	
	// Rotation Of Object.
	private var _enemyRotation : Quaternion = Quaternion.identity;
	private var _enemyRotationX : float;
	private var _xQuaternion : Quaternion = Quaternion.identity;
	
	// Raycasts.
	private var _directionForward : Vector3 = Vector3.zero;
	private var _directionLeft : Vector3 = Vector3.zero;
	private var _directionRight : Vector3 = Vector3.zero;
	private var _force : float = 10f;
	private var _jumpForce : float = 20f;
		
	function Awake(){
		// Reference.
		instance = this;
		hpText = GetComponentInChildren(TextMesh) as TextMesh;
		
		// Health.
		_isDead = false;
	}
	
	function Start(){
		// Health.
		_curHP = Random.Range(myInformation.eMinHP, myInformation.eMaxHP);
		_maxHP = _curHP;
		
		redoText();
		
		// Movement Speed.
		_rotateSpeed = myInformation.eRotateSpeed;
		_moveSpeed = myInformation.eMoveSpeed;
		_runSpeed = myInformation.eRunSpeed;
		
		// Attack.
		_fireRate = myInformation.eBulletFireRate;
	
		if(_target == null && _playerTarget == null){
			_playerTarget = GameObject.FindWithTag("mainPlayer") as GameObject;
			_target = _playerTarget;
		}
		
		while(true){
			distanceToTarget();
			castRay();
			yield WaitForSeconds(1.25f);
		}
	}
		
	function Update(){
		if(_target == null){
			return;
		}
		
		enemyRotate();
		moveDistance();
		attackDistance();
		
		if(mainPlayerAnimation.instance.isDead || waveSystem.instance.isWaveEnd){
			die();
		}
	}
	
	function enemyRotate(){
    	_enemyRotation = Quaternion.LookRotation(_target.transform.position - transform.position);
    	_enemyRotationX = _enemyRotation.eulerAngles.y;
    	_xQuaternion = Quaternion.AngleAxis(_enemyRotationX, Vector3.up);
    	transform.localRotation = Quaternion.Slerp(transform.localRotation, _xQuaternion, Time.deltaTime * _rotateSpeed);
    }
    
    function enemyMove(){
        if(_distance < 200f){
        	transform.rigidbody.MovePosition(transform.rigidbody.position + transform.TransformDirection(0, 0, _moveSpeed) * Time.deltaTime);
        }else if(_distance > 200f){
        	transform.rigidbody.MovePosition(transform.rigidbody.position + transform.TransformDirection(0, 0, _runSpeed) * Time.deltaTime);
        }
    }
    
    function attackTarget(){
    	if(Time.time > _lastFire){
    		_lastFire = Time.time + _fireRate;
    		Instantiate(bulletObject, shootObject.position, shootObject.rotation);
    	}
    }
    
    function moveDistance(){
    	if(_distance < _moveRange){
			return;
    	}else{
    		enemyMove();
    	}
    }
    
    function attackDistance(){
    	if(_distance < _attackRange){
    		shootObject.LookAt(_target.transform);
			attackTarget();
    	}else{
    		return;
    	}
    }
    
    public function applyDamage(damage : float){
    	
    	_curHP -= damage;
    	redoText();
    	if(!_isDead && _curHP <= 0){
    		_isDead = true;
    		die();
    	}
    }
    
    function die(){
    	if(_isDead){
    		var randomCash : int = Random.Range(10, 80);
    		var randomPoint : int = Random.Range(10, 100);
    		mainPlayerStatus.instance.addMoney(randomCash);
    		
    		hudScore.instance.addScore(randomPoint);
    		waveSystem.instance.enemyOnStage.Pop();
    		waveSystem.instance.currentEnemies--;
    		pickUpSpawn.instance.enemyDrop(transform.position, transform.rotation);
    		Destroy(gameObject);
    		Destroy(this);
    	}else{
    		waveSystem.instance.currentEnemies--;
    		Destroy(gameObject);
    		Destroy(this);
    	}
    }
    
    function redoText(){
    	hpText.text = _curHP.ToString() + " / " + _maxHP.ToString();
    }
    
   /* public function findNearestWay(){
  	  	if(wayPointAreas.instance.wayPointOn){
	    	var distance : float = 0f;
			for(var closestWayPoint : GameObject in wayPoints){
				distance = Vector3.Distance(closestWayPoint.transform.position, transform.position);
				if(distance < 200f){
					_target = closestWayPoint.gameObject;
					_wayTarget = closestWayPoint.gameObject;
					distance = closestWayPoint.transform.position.magnitude;
				}
			}
		}else{
			_target = _playerTarget;
		}
    }*/
    
    public function distanceToTarget(){
    	_distance = Vector3.Distance(transform.position, _target.transform.position);
    	if(_distance < _displayRange){
    		hpText.gameObject.active = true;
    	}else {
    		hpText.gameObject.active = false;
    	}
    }
    
    function castRay(){
    	var hitInfo : RaycastHit;
    	var distance : float = 5f;
    	
    	_directionForward = transform.TransformDirection(Vector3.forward);
		_directionLeft = transform.TransformDirection(Vector3.left);
		_directionRight = transform.TransformDirection(Vector3.right);
    	
    	if(Physics.Raycast(transform.position, _directionForward, hitInfo, distance)){
    		if(hitInfo.transform.tag == "avoid"){
    			transform.rigidbody.AddForce(Vector3.back * _force, ForceMode.Force);
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
