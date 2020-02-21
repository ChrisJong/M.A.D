#pragma strict

public class mainPlayerCamera extends MonoBehaviour {
	
	// Reference.
	public static var instance : mainPlayerCamera;
	public var targetLookAt : Transform;
	private var _mainPlayer : GameObject;
	
	// Camera Zoom (Field Of View).
	public var isFOV : boolean = false;
	private var _fovIn : float = 40f;
	private var _fovSpeed : float = 5f;
	private var _oldFOV : float;
	
	// Camera Distance/Position.
	public var distance : float = 2f;
	public var distanceMin : float = 1f;
	public var distanceMax : float = 3f;
	public var distanceSmooth : float = 0.05f;
	private var _startDistance : float = 0f;
	private var _desireDistance : float = 0f;
	private var _desirePosition : Vector3 = Vector3.zero;
	private var _velDistance : float = 0f;
	private var _camPosition : Vector3 = Vector3.zero;
	
	// Death Camera.
	public var deathHeight : float = 60f;
	public var deathSpin : float = 10f;
	public var deathDistance : float = 5f;
	
	// Camera Occlusion
	private var _occludedSmooth : float = 0f;
	
	// Mouse Sensitivity
	public var xSens : float = 5f;
	public var ySens : float = 5f;
	private var _mouseWheelSens : float = 5f;
	
	// Distance Limits.
	public var yLimitMin : float = -30f;
	public var yLimitMax : float = 30f;

	// Mouse X&Y.
	private var _mouseX : float = 0f;
	private var _mouseY : float = 0f;
	
	function Awake(){
		instance = this;
		_mainPlayer = GameObject.FindWithTag("mainPlayer") as GameObject;
		_oldFOV = Camera.mainCamera.fieldOfView;
	}
	
	function Start(){
		distance = Mathf.Clamp(distance, distanceMin, distanceMax);
		_startDistance = distance;
		reset();
	}
	
	function LateUpdate(){
		if(targetLookAt == null && _mainPlayer == null){
			return;
		}
		
		if(!mainPlayerAnimation.instance.isDead && !lockCursor.instance.isPaused){
			_desireDistance = distance;
			handlePlayerInput();
		}else if(mainPlayerAnimation.instance.isDead){
			_desireDistance = deathDistance;
			_mouseX += Time.deltaTime * deathSpin;
			_mouseY = deathHeight;
		}
		
		if(!lockCursor.instance.isPaused){
			calculateDesirePosition();
			updatePosition();
		}
		
	}
	
	function handlePlayerInput(){
		
		var deadZone : float = 0.01f;
		
		_mouseX += Input.GetAxis("Mouse X") * xSens;
		_mouseY -= Input.GetAxis("Mouse Y") * ySens;
		
		_mouseY = mainPlayerHelper.clampAngle(_mouseY, yLimitMin, yLimitMax);
		
		if(Input.GetAxis("Mouse ScrollWheel") < -deadZone || Input.GetAxis("Mouse ScrollWheel") > deadZone){
			_desireDistance = Mathf.Clamp(distance - Input.GetAxis("Mouse ScrollWheel") * _mouseWheelSens, distanceMin, distanceMax);
			_occludedSmooth = distanceSmooth;
		}
		
		if(isFOV){
			Camera.mainCamera.fieldOfView = Mathf.Lerp(Camera.mainCamera.fieldOfView, _fovIn, _fovSpeed * Time.deltaTime);
		}else{
			Camera.mainCamera.fieldOfView = Mathf.Lerp(Camera.mainCamera.fieldOfView, _oldFOV, _fovSpeed * Time.deltaTime);
		}
	}
	
	function calculateDesirePosition(){
		distance = Mathf.SmoothDamp(distance, _desireDistance, _velDistance, _occludedSmooth);
		_desirePosition = calculatePosition(_mouseY, _mouseX, distance);
	}
	
	function calculatePosition(rotationX : float, rotationY : float, distance : float):Vector3{
		var direction : Vector3 = new Vector3(0,0, -distance);
		var rotation : Quaternion = Quaternion.Euler(rotationX, rotationY, 0);
		return targetLookAt.position + rotation * direction;
	}
	
	function updatePosition(){
		var posX = _desirePosition.x;
		var posY = _desirePosition.y;
		var posZ = _desirePosition.z;
		_camPosition = new Vector3(posX, posY, posZ);
		
		transform.position = _camPosition;
		transform.LookAt(targetLookAt);
	}
	
	public function reset(){
		_mouseX = 0f;
		_mouseY = 0f;
		distance = _startDistance;
		_desireDistance = distance;
	}
	
	public static function findOrCreate(){
		var tempCamera : GameObject;
		var aimTargetObject : GameObject;
		var targetLookAtObject : GameObject;
		var myCamera : mainPlayerCamera;
		
		// If the main camera in the scene exists then do something.
		if(Camera.mainCamera != null){
			tempCamera = Camera.mainCamera.gameObject;
		}else{ // We Add the camera to the scene using an empty gameobject and adding the necessary componments to make it a main camera.
			tempCamera = new GameObject("Main Camera");
			tempCamera.AddComponent("Camera");
			tempCamera.tag = "MainCamera";
		}
		
		// Adding the mainPlayerCamera Script to the main camera on the scene.
		tempCamera.AddComponent("mainPlayerCamera");
		myCamera = tempCamera.GetComponent("mainPlayerCamera") as mainPlayerCamera;
		
		// Now we have to find our empty targetLookAt object in the scene.
		targetLookAtObject = GameObject.Find("targetLookAt") as GameObject;
		
		// If we cant find the targetLookAt Game Object then we create one with a position of 0.
		if(targetLookAtObject == null){
			targetLookAtObject = new GameObject("targetLookAt");
			targetLookAtObject.transform.position = Vector3.zero;
			
		}
		
		// We tell myCamera which is the camera we created to use the targetLookAt game object we created above.
		myCamera.targetLookAt = targetLookAtObject.transform;
	}
}