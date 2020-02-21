#pragma strict

public class turretLaser extends MonoBehaviour {
	
	public var myInformation : informationHolder;
	public var layerMask : LayerMask;
	
	private var _laserLife : float = 2f;
	private var _laserDamage : float = 2f;
	private var _laserSpeed : float = 50f;
	private var _laserImpact : float = 2.5f;
	
	private var _laserOldPos : Vector3 = Vector3.zero;
	private var _laserNewPos : Vector3 = Vector3.zero;
	private var _laserVelocity : Vector3 = Vector3.zero;
	
	private var _hitInfo : RaycastHit;
	private var _isHit : boolean = false;
	
	function Awake(){
		_laserDamage = myInformation.tOneBulletDamge;
		_laserSpeed = myInformation.tOneBulletSpeed;
	}
	
	function Start(){
		_laserNewPos = transform.position;
		_laserOldPos = _laserNewPos;
		_laserVelocity = _laserSpeed * transform.forward;
		
		Destroy(gameObject, _laserLife);
		Destroy(this, _laserLife);
	}
	
	function Update(){
		if(_isHit){
			return;
		}
		
		_laserNewPos += _laserVelocity * Time.deltaTime;
		
		var laserDirection = _laserNewPos - _laserOldPos;
		var laserDistance = laserDirection.magnitude;
		
		if(laserDistance > 0){
			if(Physics.Raycast(_laserOldPos, laserDirection, _hitInfo, laserDistance, layerMask)){
				_laserNewPos = _hitInfo.point;
				_isHit = true;
				
				if(_hitInfo.rigidbody){
					_hitInfo.rigidbody.AddForce(transform.forward * _laserImpact, ForceMode.Impulse);
				}
				
				if(_hitInfo.transform.tag == "enemy"){
					_hitInfo.transform.SendMessageUpwards("applyDamage", _laserDamage, SendMessageOptions.DontRequireReceiver);
					Destroy(gameObject);
					Destroy(this);
				}
				
				if(_hitInfo.transform.tag == "ground"){
					Destroy(gameObject, 1);
					Destroy(this);
				}
			}
		}
		
		_laserOldPos = transform.position;
		transform.position = _laserNewPos;
	}
	
}