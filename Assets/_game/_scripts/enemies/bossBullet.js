#pragma strict

public class bossBullet extends MonoBehaviour {
	
	public var myInformation : informationHolder; // getting a reference to a script which hold all stats variables which we will be accessing.
	
	public var layerMask : LayerMask; // creating a layer mask that will hold what the raycast can see like a camera on a ray, and the camera can only see what the layerMask has been set on.
	
	// bullet stats.
	private var _bulletDamage : float; // this will hold how much damage the bullet will do.
	private var _bulletSpeed : float; // this will hold how fast the bullet will travel at.
	private var _bulletLife : float = 3f; // this will tell us how long the bullet has to live.
	private var _bulletImpact : float = 5f; // how much force it should apply to rigidbodys if it hit any.
	
	private var _bulletOldPos : Vector3; // stores the old position of the bullet transform.
	private var _bulletNewPos : Vector3; // finds the new position it should be at and stores it.
	private var _bulletVeloctiy : Vector3; // how fast the bullet should be traveling.
	
	private var _hitInfo : RaycastHit; // storing all the raycasts the bullet has made.
	private var _isHit : boolean = false; // if the bullet has hit something.
	
	function Awake(){
		_bulletDamage = myInformation.bBulletDamage; // setting the damage to equal outside values.
		_bulletSpeed = myInformation.bBulletSpeed; // setting the speed to equal outside values.
	}
	
	function Start(){
		_bulletNewPos = transform.position; // storing its newposition at its current gameobject position.
		_bulletOldPos = _bulletNewPos; // storing the new position as the old position.
		_bulletVeloctiy = _bulletSpeed * transform.forward; // making the velocity equal to the bulletspeed times the gameobjects forward position in this case the Z AXIS.
		
		Destroy(gameObject, _bulletLife); // start the count down timers to destroy this gameobject in the bulletlife span.
		Destroy(this, _bulletLife); // we also destroy this script just incase its still running the updates. just a check.
	}
		
	function Update(){
		if(_isHit){ // just checking if the bullet has hit something. then do nothing.
			return;
		}
		
		_bulletNewPos += _bulletVeloctiy * Time.deltaTime; // we push the bullets new position furthur out.
		
		var bulletDirection = _bulletNewPos - _bulletOldPos; // the distance between the new position and old position.
		var bulletDistance = bulletDirection.magnitude; // turing the vector3 into a whole number or a float.
		
		if(bulletDistance > 0){ // if the bullet distance is still greater than 0, meaning if it still moving
			if(Physics.Raycast(_bulletOldPos, bulletDirection, _hitInfo, bulletDistance, layerMask)){ // cast out a ray at the old position its direction in this case forward (Z axis), store all the values of the rays in the _hitInfo, and cast out a ray with the length of how long the distance is. to the new position from the old position.
				_bulletNewPos = _hitInfo.point; // the bullet new position is equal to the end of the raycast point/line.
				_isHit = true; // we will always tell the bullet that it hit something so it will stop and we can check if we hit anything, else the speed at which it travels at, will make the raycast useless cause its moving too fast.
				
				if(_hitInfo.rigidbody){
					_hitInfo.rigidbody.AddForce(transform.forward * _bulletImpact, ForceMode.Impulse); // if it has hit anything with a rigidbody apply some force.
				}
				
				if(_hitInfo.transform.tag == "mainPlayer"){ // if the bullet has hit anything with the tag.
					mainPlayerStatus.instance.takeHP(_bulletDamage); // we call a function outside of this script to take damage.
					Destroy(gameObject); // we then destroy the bullet object.
					Destroy(this); // we also destroy this script just incase.
				}
				
				if(_hitInfo.transform.tag == "ground"){ // if it hit anything with a tag "ground".
					Destroy(gameObject, 1); // we destroy this gameobject in one second.
					Destroy(this, 1); // we also destroy the script.
				}
				
				if(_hitInfo.transform.tag == "enemy"){ // if it hit anything with a tag "enemy".
					Destroy(gameObject); // we destroy the bullet asap.
					Destroy(this); // we also destroy the script.
				}
			}
		}
		// if the bullet hit nothing then we continue on.
		_bulletOldPos = transform.position; // taking its current bullet position and making it our old value.
		transform.position = _bulletNewPos; // and we put our new position to its newValue.
	}

}
