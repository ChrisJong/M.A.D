#pragma strict

public class systemTurret extends MonoBehaviour {
	
	public static var instance : systemTurret;
	
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
	private var rotationSmooth : float = 20f; // A smoothing variable to smooth the rotation of the turret.
	public var targetLookAt : GameObject; // A variable to hold what enemy the turret is targetting.
	
	private var _fireRate : float = 0.2f; // How fast it should fire.
	private var _lastFire : float = 0f; // A timer or a variable to hold the last fire.
	
	public var turretCollider : SphereCollider; // Reference the componenet of the sphereCollider attached to the gameobject.
	private var _turretRadius : float = 30f; // How big the radius of the SphereCollider should be.
	private var _colliderPos : Vector3 = Vector3.zero; // The position of the SphereCollider.
	
	private var _turretRotate : Quaternion = Quaternion.identity; // A value of how far the turret is going to rotate.
	private var _turretInitRotation : Quaternion = Quaternion.identity; // the first value rotation of turret when its spawned into the stage.
	
	private var _hitInfo : RaycastHit; // A RaycastHit variable to hold all the information of the raycast.
	private var _rayDirection : Vector3 = Vector3.zero; // The direction of where the ray should be casted at.
	private var _rayRange : float = 28f; // the Range of how far the ray should cast out.
	
	public var turretRadiusMesh : GameObject;

	private var _targetLock : boolean = false; // If the turret already has an enemy it will lock onto that enemy untill it leaves or dies.
	
	function Awake(){
		instance = this;
		turretRadiusMesh.active = false;
	}
	
	function Start(){
		turretCollider = GetComponent(SphereCollider) as SphereCollider;
		_turretInitRotation = transform.rotation;
		
		turretCollider.isTrigger = false;
		turretRadiusMesh.active = false;
		turretCollider.radius = 0f;
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
		
		transform.rotation = Quaternion.Slerp(transform.rotation, _turretRotate, Time.deltaTime * rotationSmooth);
	}
	
	function turretCurrentState(){
		switch(tState){
			case turretState.off:
				turretCollider.isTrigger = false;
				turretRadiusMesh.active = false;
				turretCollider.radius = 0f;
			break;
			
			case turretState.on:
				turretCollider.isTrigger = true;
				turretRadiusMesh.active = true;
				turretCollider.radius = _turretRadius;
				turretCollider.center = _colliderPos;
				tState = turretState.idle;
			break;
			
			case turretState.idle:
				if(!targetLookAt){
					_turretRotate = _turretInitRotation;
					targetLookAt = null;
					_targetLock = false;
				}else{
					tState = turretState.target;
				}
			break;
			
			case turretState.target:
				if(targetLookAt){
					_turretRotate = Quaternion.LookRotation(targetLookAt.transform.position - transform.position);
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
		if((col.tag == "enemy" || col.tag == "crawler") && _targetLock == false){
			tState = turretState.target;
			targetLookAt = col.gameObject as GameObject;
			_targetLock = true;
		}
	}
	
	function OnTriggerExit(col : Collider){
		if(col.tag == "enemy" || col.tag == "crawler"){
			tState = turretState.idle;
			targetLookAt = null;
			_targetLock = false;
		}
	}
	
	function turretFire(){
		for(var i : int = 0; i < aFireAim.length; i++){
			var instantiatedLaser : Rigidbody = Instantiate(Resources.Load("turretLaser"), aFireAim[i].position, aFireAim[i].rotation) as Rigidbody;
		}
	}
}