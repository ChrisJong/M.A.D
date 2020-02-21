#pragma strict
public class weaponRayCast extends MonoBehaviour {
	
	// Reference.
	public static var instance : weaponRayCast;
	public var crossHair : Texture;
	private var _targetLookAt : GameObject;
	private var _weaponTarget : GameObject;
	
	// Camera Distance/Position.
	public var distance : float = 1f;
	private var _startDistance : float = 0f;
	private var _desireDistance : float = 0f;
	private var _desirePosition : Vector3 = Vector3.zero;
	private var _velDistance : float = 0f;
	private var _camPosition : Vector3 = Vector3.zero;
	
	// Death Camera.
	public var deathHeight : float = 60f;
	public var deathSpin : float = 10f;
	public var deathDistance : float = 5f;
	
	// Mouse Sensitivity
	public var xSens : float = 5f;
	public var ySens : float = 5f;
	
	// Distance Limits.
	public var yLimitMin : float = -30f;
	public var yLimitMax : float = 30f;
			
	// Mouse X&Y.
	private var _mouseX : float = 0f;
	private var _mouseY : float = 0f;
	
	function Awake(){
		instance = this;
		_targetLookAt = GameObject.FindWithTag("weaponLookAt") as GameObject;
		_weaponTarget = GameObject.FindWithTag("weaponTarget") as GameObject;
		crossHair = Resources.Load("crossHair3") as Texture;
	}
	
	function Start(){
		_startDistance = distance;
		reset();
	}
	
	function LateUpdate(){
		if(_targetLookAt == null){
			return;
		}
		if(!mainPlayerAnimation.instance.isDead && !lockCursor.instance.isPaused){
			_desireDistance = distance;
			handlePlayerInput();
			target();
		}else if(mainPlayerAnimation.instance.isDead){
			_mouseX += Time.deltaTime * deathSpin;
			_mouseY = deathHeight;
		}
		
		if(!lockCursor.instance.isPaused){
			calculateDesirePosition();
			updatePosition();
		}
	}
	
	function handlePlayerInput(){
		_mouseX +=  Input.GetAxis("Mouse X") * xSens;
		_mouseY -=  Input.GetAxis("Mouse Y") * ySens;
		_mouseY = mainPlayerHelper.clampAngle(_mouseY, yLimitMin, yLimitMax);
	}
	
	function calculateDesirePosition(){
		_desirePosition = calculatePosition(_mouseY, _mouseX, distance);
	}
	
	function calculatePosition(rotationX : float, rotationY : float, distance : float):Vector3{
		var direction : Vector3 = new Vector3(0,0, -distance);
		var rotation : Quaternion = Quaternion.Euler(rotationX, rotationY, 0);
		return _targetLookAt.transform.position + rotation * direction;
	}
	
	function updatePosition(){

		var posX = _desirePosition.x;
		var posY = _desirePosition.y;
		var posZ = _desirePosition.z;
		
		_camPosition = new Vector3(posX, posY, posZ);
		
		transform.position = _camPosition;
		transform.LookAt(_targetLookAt.transform);
	}
	
	function target(){
		var rayDistance : float = 100f;
		var rayDirection = transform.TransformDirection(Vector3.forward);
		var hitInfo : RaycastHit;
		
		if(Physics.Raycast(transform.position, rayDirection, hitInfo, rayDistance)){
			_weaponTarget.transform.position = hitInfo.point;
		}else{
			_weaponTarget.transform.position = transform.position + rayDirection * rayDistance;
		}
	}
	
	public function reset(){
		_mouseX = 0f;
		_mouseY = 0f;
		distance = _startDistance;
		_desireDistance = distance;
	}
	
	public static function findOrCreate(){
		var WeaponCamera : GameObject;
		var myCamera : weaponRayCast;
		
		WeaponCamera = GameObject.FindWithTag("weaponRay") as GameObject;
		WeaponCamera.transform.position = Vector3.zero;
		WeaponCamera.AddComponent("weaponRayCast");
		myCamera = WeaponCamera.GetComponent("weaponRayCast") as weaponRayCast;
	}
}