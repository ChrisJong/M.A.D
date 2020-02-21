#pragma strict

public class weaponRayCastTemp extends MonoBehaviour {
	
	public static var instance : weaponRayCastTemp;
	public var crossHair : Texture;
	private var _targetLookAt : GameObject;
	private var _weaponTarget : GameObject;
	
	private var _ySens : float = 5F;
	private var _yLimitMin : float = -20F;
	private var _yLimitMax : float = 20F;
	
	private var _mouseY : float = 0F;
	
	private var _originalRotation : Quaternion;
	private var _yQuaternion : Quaternion;
	
	function Awake(){
		
		instance = this;
		_originalRotation = transform.localRotation;
		_targetLookAt = GameObject.FindWithTag("weaponAim") as GameObject;
		_weaponTarget = GameObject.FindWithTag("weaponTarget") as GameObject;
		crossHair = Resources.Load("crossHair") as Texture;
		
	}
	
	function Update(){
		if(!mainPlayerAnimation.instance.isDead){
			handlePlayerInput();
			target();
		}else{
			return;
		}
	}
	
	function handlePlayerInput(){
		_mouseY += Input.GetAxis("Mouse Y") * _ySens;
		_mouseY = mainPlayerHelper.clampAngle(_mouseY, _yLimitMin, _yLimitMax);
		_yQuaternion = Quaternion.AngleAxis(_mouseY, Vector3.left);
		transform.localRotation = _originalRotation * _yQuaternion;
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
	
	function OnGUI(){
		if (Time.time != 0 && Time.timeScale != 0)
		GUI.DrawTexture(new Rect(Screen.width/2-(crossHair.width*0.5f), Screen.height/2-(crossHair.height*0.5f), crossHair.width, crossHair.height), crossHair);
	}
	
}