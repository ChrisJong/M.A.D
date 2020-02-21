#pragma strict

public class tSystem extends MonoBehaviour {
	
	public enum turretSystemState {
		nothing,
		off,
		on
	}
	public var tsState : turretSystemState = turretSystemState.nothing;
	
	public var indicator : TextMesh;
	public var indicatorMaterial : MeshRenderer;
	
	public static var instance : tSystem;
	
	public var turretsOn : GameObject[];
	private var _countTimer : float = 30f;
	
	private var _tSystemAvaliable : boolean = false;
	private var _availableTime : float = 20f;
	
	public var systemLines : GameObject;
	
	public var textMaterial : Material[];
	
	function Awake(){
		instance = this;
		indicator.text = "Turret System Available";
		systemLines.SetActiveRecursively(false);
		indicatorMaterial.material = textMaterial[0] as Material;
	}
	
	function LateUpdate(){
		switch(tsState){
			case turretSystemState.nothing:
			break;
			case turretSystemState.off:
				
				if(_tSystemAvaliable == false){
					_availableTime -= Time.deltaTime;
					indicator.text = "Turret System Off For " + parseInt(_availableTime).ToString();
				}
				
				if(_availableTime <= 0f){
					_tSystemAvaliable = true;
					indicatorMaterial.material = textMaterial[0] as Material;
					tsState = turretSystemState.nothing;
					indicator.text = "Turret System Available";
				}
				
			break;
			
			case turretSystemState.on:
				_countTimer -= Time.deltaTime;
				indicator.text = "Turret System On For " + parseInt(_countTimer).ToString();
				if(_countTimer <= 0f){
					_tSystemAvaliable = false;
					systemLines.SetActiveRecursively(false);
					_availableTime = 20f;
					_countTimer = 30f;
					systemOff();
					tsState = turretSystemState.off;
					indicatorMaterial.material = textMaterial[2] as Material;
				}
			break;
		}
	}
	
	function OnTriggerStay(col : Collider){
		if(col.tag == "mainPlayer"){
			var heading : Vector3 = col.transform.position - indicator.transform.position;
			indicator.transform.LookAt(indicator.transform.position - heading);
			if(tsState == turretSystemState.nothing){
				indicator.text = "Press E To Turn On";
				if(Input.GetKeyDown(KeyCode.E)){
					tsState = turretSystemState.on;
					_tSystemAvaliable = true;
					systemLines.SetActiveRecursively(true);
					indicatorMaterial.material = textMaterial[1] as Material;
					systemOn();
				}
			}
		}
	}
	
	function OnTriggerExit(col : Collider){
		if(col.tag == "mainPlayer"){
			if(tsState == turretSystemState.nothing){
				indicator.text = "Turret System Available";
			}
		}
	}
	
	function systemOn(){
		audio.Play();
		for(var i : int = 0; i < turretsOn.length; i++){
			turretsOn[i].GetComponent(systemTurret).tState = turretsOn[i].GetComponent(systemTurret).turretState.on;
		}
	}
	
	function systemOff(){
		audio.Stop();
		for(var i : int = 0; i < turretsOn.length; i++){
			turretsOn[i].GetComponent(systemTurret).tState = turretsOn[i].GetComponent(systemTurret).turretState.off;
		}
	}
}