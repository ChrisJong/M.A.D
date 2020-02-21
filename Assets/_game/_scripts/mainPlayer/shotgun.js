#pragma strict

public class shotgun extends MonoBehaviour {
	
	public var myInformation : informationHolder;
	
	public var layerMask : LayerMask;
	
	private var _shotgunSpeed : float = 500f;
	private var _shotgunLife : float = 3f;
	private var _shotgunDamage : float = 20f;
	private var _shotgunImpact : float = 5f;
	
	private var _shotgunOldPos : Vector3;
	private var _shotgunNewPos : Vector3;
	private var _shotgunVeloctiy : Vector3;
	private var _hitInfo : RaycastHit;
	
	private var _spreadTime : float = 10f;
	private var _direction : Vector3 = Vector3.zero;
	
	private var _isHit : boolean = false;
	
	function Awake(){
		_shotgunDamage = myInformation.sDamage;
		_shotgunSpeed = myInformation.sSpeed;
	}
	
	function Start(){
		_shotgunNewPos = transform.position;
		_shotgunOldPos = _shotgunNewPos;
		_shotgunVeloctiy = _shotgunSpeed * transform.forward;
		Destroy(gameObject, _shotgunLife);
		Destroy(this, _shotgunLife);
	}
		
	function Update(){
		if(_isHit){
			return;
		}
		_shotgunNewPos += _shotgunVeloctiy * Time.deltaTime;
		var shotgunDirection = _shotgunNewPos - _shotgunOldPos;
		var shotgunDistance = shotgunDirection.magnitude;
		
		if(shotgunDistance > 0){
			if(Physics.Raycast(_shotgunOldPos, shotgunDirection, _hitInfo, shotgunDistance, layerMask)){
				_shotgunNewPos = _hitInfo.point;
				_isHit = true;
				
				if(_hitInfo.rigidbody){
					_hitInfo.rigidbody.AddForce(transform.forward * _shotgunImpact, ForceMode.Impulse);
				}
				
				if(_hitInfo.transform.tag == "enemy"){
					_hitInfo.transform.SendMessageUpwards("applyDamage", _shotgunDamage, SendMessageOptions.DontRequireReceiver);
					Destroy(gameObject);
					Destroy(this);
				}
				
				if(_hitInfo.transform.tag == "ground"){
					Destroy(gameObject, 1);
					Destroy(this);
				}
			}
		}
		_shotgunOldPos = transform.position;
		transform.position = _shotgunNewPos;
	}

}
