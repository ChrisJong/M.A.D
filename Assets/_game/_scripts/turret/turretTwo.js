#pragma strict

public class turretTwo extends MonoBehaviour {
	
	public static var instance : turretTwo;
	public var myInformation : informationHolder;
	private var _textMesh : TextMesh;
	public var radiusMesh : GameObject;
	
	public enum turretState { // A selection of state the turret has.
		off,
		on,
		idle,
		target,
		dead
	}
	public var tState : turretState = turretState.off; // A variable to hold all the states and access/set them accordingly.
	
	public var aFireAim : Transform[]; // A array to hold gameobjects that will be instaniating bullets.
	public var turretAim : GameObject[]; // A array to hold the gamobjects that will be raycasting and targetting.
	private var _targetLookAt : GameObject; // A variable to hold what enemy the turret is targetting.
	
	private var _turretRadius : float = 12f; // How big the radius of the SphereCollider should be.
	private var _rayRange : float = 10f; // the Range of how far the ray should cast out.
	private var _colliderPos : Vector3 = Vector3.zero; // The position of the SphereCollider.
	private var _rotateSmooth : float = 2f; // A smoothing variable to smooth the rotation of the turret.
	private var _fireRate : float = 0.7f; // How fast it should fire.
	private var _lastFire : float = 0f; // A timer or a variable to hold the last fire.
	
	public var turretCollider : SphereCollider; // Reference the componenet of the sphereCollider attached to the gameobject.
	
	private var _turretRotate : Quaternion = Quaternion.identity; // A value of how far the turret is going to rotate.
	private var _turretInitRotation : Quaternion = Quaternion.identity; // the first value rotation of turret when its spawned into the stage.
	
	private var _hitInfo : RaycastHit; // A RaycastHit variable to hold all the information of the raycast.
	private var _rayDirection : Vector3 = Vector3.zero; // The direction of where the ray should be casted at.
	
	private var _targetLock : boolean = false; // If the turret already has an enemy it will lock onto that enemy untill it leaves or dies.
	
	function Awake(){
		instance = this;
		_textMesh = GetComponentInChildren(TextMesh) as TextMesh;
	}
	
	function Start(){
		turretCollider = GetComponent(SphereCollider) as SphereCollider;
		_turretInitRotation = transform.rotation;
		
		_rotateSmooth = myInformation.tTwoRotateSpeed;
		turretCollider.radius = myInformation.tTwoRadius;
		_rayRange = myInformation.tTwoRange;
		
		radiusMesh.transform.localScale = Vector3(myInformation.tTwoRadius * 2f, myInformation.tTwoRadius * 2f, myInformation.tTwoRadius *2f);
		
		_textMesh.gameObject.active = false;
	}
	
	function Update(){

		turretCurrentState();
		
		_rayDirection = transform.TransformDirection(Vector3.forward);
		if(tState == turretState.idle || tState == turretState.target){
			for(var i : int = 0; i < turretAim.Length; i++){
				Debug.DrawRay(turretAim[i].transform.position, _rayDirection * _rayRange, Color.red);
				if(Physics.Raycast(turretAim[i].transform.position, _rayDirection, _hitInfo, _rayRange)){
					if(_hitInfo.transform.tag == "enemy" && Time.time > _lastFire){
						_lastFire = Time.time + _fireRate;
						turretFire();
					}
				}
			}
		}
		
		transform.rotation = Quaternion.Slerp(transform.rotation, _turretRotate, Time.deltaTime * _rotateSmooth);
	}
	
	function turretCurrentState(){
		switch(tState){
			case turretState.off:
				turretCollider.isTrigger = false;
				turretCollider.radius = 0f;
			break;
			
			case turretState.on:
				turretCollider.isTrigger = true;
				turretCollider.radius = _turretRadius;
				turretCollider.center = _colliderPos;
				tState = turretState.idle;
			break;
			
			case turretState.idle:
				if(!_targetLookAt){
					_turretRotate = _turretInitRotation;
					_targetLookAt = null;
					_targetLock = false;
				}else{
					tState = turretState.target;
				}
			break;
			
			case turretState.target:
				if(_targetLookAt){
					_turretRotate = Quaternion.LookRotation(_targetLookAt.transform.position - transform.position);
				}else{
					tState = turretState.idle;
				}
			break;
			
			case turretState.dead:
				Destroy(gameObject);
				Destroy(this);
			break;
		}
	}
	
	function OnTriggerStay(col : Collider){
		if(col.tag == "enemy" && _targetLock == false){
			tState = turretState.target;
			_targetLookAt = col.gameObject as GameObject;
			_targetLock = true;
		}
		
		if(col.tag == "mainPlayer"){
			var turretToPlayer : float = Vector3.Distance(transform.position, col.transform.position);
			if(turretToPlayer < 10f){
				_textMesh.text = "Press E To Sell Turret";
				var heading : Vector3 = col.transform.position - _textMesh.transform.position;
				_textMesh.transform.LookAt(_textMesh.transform.position - heading);
				_textMesh.gameObject.active = true;
				if(Input.GetKeyDown(KeyCode.E)){
					mainPlayerStatus.instance.playerPoint -= 10f;
					Destroy(gameObject);
					Destroy(this);
				}
			}else{
				_textMesh.gameObject.active = false;
			}
		}
	}
	
	function OnTriggerExit(col : Collider){
		if(col.tag == "enemy"){
			tState = turretState.idle;
			_targetLookAt = null;
			_targetLock = false;
		}
		
		if(col.tag == "mainPlayer"){
			_textMesh.gameObject.active = false;
		}
	}
	
	function turretFire(){
		for(var i : int = 0; i < aFireAim.length; i++){
			var instantiatedLaser : Rigidbody = Instantiate(Resources.Load("turretRocket"), aFireAim[i].position, aFireAim[i].rotation) as Rigidbody;
		}
	}
}