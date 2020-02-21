#pragma strict

public class turretRocket extends MonoBehaviour {
	
	public var myInformation : informationHolder;
	public var layerMask : LayerMask;
	
	public var explosion : GameObject;
	private var _rocketSpeed : float = 200f;
	private var _rocketDamage : float = 5f;
	private var _rocketLife : float = 3f;
	private var _rocketImpact : float = 2.5f;
	
	private var _rocketOldPos : Vector3;
	private var _rocketNewPos : Vector3;
	private var _rocketVeloctiy : Vector3;
	
	private var _hitInfo : RaycastHit;
	private var _isHit : boolean = false;
	
	function Awake(){
		_rocketSpeed = myInformation.tTwoBulletSpeed;
		_rocketDamage = myInformation.tTwoBulletDamge;
	}
	
	function Start(){
		_rocketNewPos = transform.position;
		_rocketOldPos = _rocketNewPos;
		_rocketVeloctiy = _rocketSpeed * transform.forward;
		
		Destroy(gameObject, _rocketLife);
		Destroy(this, _rocketLife);
	}
		
	function Update(){
		if(_isHit){
			return;
		}
		_rocketLife -= Time.deltaTime;
		if(_rocketLife <= 0){
			Instantiate(explosion, _rocketNewPos, transform.rotation);
			Destroy(gameObject);
			Destroy(this);
		}
		_rocketNewPos += _rocketVeloctiy * Time.deltaTime;
		
		var rocketDirection = _rocketNewPos - _rocketOldPos;
		var rocketDistance = rocketDirection.magnitude;
		
		if(rocketDistance > 0){
			if(Physics.Raycast(_rocketOldPos, rocketDirection, _hitInfo, rocketDistance, layerMask)){
				_rocketNewPos = _hitInfo.point;
				_isHit = true;
				if(_hitInfo.rigidbody){
					_hitInfo.rigidbody.AddForce(transform.forward * _rocketImpact, ForceMode.Impulse);
				}
				
				if(_hitInfo.transform.tag == "enemy"){
					_hitInfo.transform.SendMessageUpwards("applyDamage", _rocketDamage, SendMessageOptions.DontRequireReceiver);
					Destroy(gameObject);
					Destroy(this);
					Instantiate(explosion, _rocketNewPos, transform.rotation);
				}
				
				if(_hitInfo.transform.tag == "ground"){
					Instantiate(explosion, _rocketNewPos, transform.rotation);
					Destroy(gameObject);
					Destroy(this);
				}
				
				if(_isHit == true){
					Instantiate(explosion, _rocketNewPos, transform.rotation);
					Destroy(gameObject);
					Destroy(this);
				}
			}
		}
		_rocketOldPos = transform.position;
		transform.position = _rocketNewPos;
	}

}
