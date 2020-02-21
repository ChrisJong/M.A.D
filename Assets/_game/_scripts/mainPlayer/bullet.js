#pragma strict

public class bullet extends MonoBehaviour {
	
	public var myInformation : informationHolder;
	
	public var layerMask : LayerMask;
	
	private var _bulletSpeed : float = 500f;
	private var _bulletLife : float = 3f;
	private var _bulletDamage : float = 20f;
	private var _bulletImpact : float = 5f;
	
	private var _bulletOldPos : Vector3;
	private var _bulletNewPos : Vector3;
	private var _bulletVeloctiy : Vector3;
	
	private var _hitInfo : RaycastHit;
	private var _isHit : boolean = false;
	
	function Awake(){
		_bulletDamage = myInformation.nDamage;
		_bulletSpeed = myInformation.nSpeed;
	}
	
	function Start(){
		Physics.IgnoreLayerCollision(12,19, false);
		_bulletNewPos = transform.position;
		_bulletOldPos = _bulletNewPos;
		_bulletVeloctiy = _bulletSpeed * transform.forward;
		
		Destroy(gameObject, _bulletLife);
		Destroy(this, _bulletLife);
	}
		
	function Update(){
		if(_isHit){
			return;
		}
		
		_bulletNewPos += _bulletVeloctiy * Time.deltaTime;
		
		var bulletDirection = _bulletNewPos - _bulletOldPos;
		var bulletDistance = bulletDirection.magnitude;
		
		if(bulletDistance > 0){
			if(Physics.Raycast(_bulletOldPos, bulletDirection, _hitInfo, bulletDistance, layerMask)){
				_bulletNewPos = _hitInfo.point;
				_isHit = true;
				
				if(_hitInfo.rigidbody){
					_hitInfo.rigidbody.AddForce(transform.forward * _bulletImpact, ForceMode.Impulse);
				}
				
				if(_hitInfo.transform.tag == "enemy"){
					_hitInfo.transform.SendMessageUpwards("applyDamage", _bulletDamage, SendMessageOptions.DontRequireReceiver);
					Destroy(gameObject);
					Destroy(this);
				}
				
				if(_hitInfo.transform.tag == "ground"){
					Destroy(gameObject, 1);
					Destroy(this);
				}
			}
		}
		
		_bulletOldPos = transform.position;
		transform.position = _bulletNewPos;
	}

}
