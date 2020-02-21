#pragma strict

public class dayNight extends MonoBehaviour {
	
	public static var instance : dayNight; // A variable to give access of anything publicly avaliable in this script to other scripts.
	
	public enum timeOfDay { // A list of what time of days are avaliable.
		Idle,
		SunRise,
		SunSet
	}
	private var _tod : timeOfDay; // Variable that stores the timeOfDay enums.
	
	public var sunArray : Transform[]; // A collection of gameobject suns in the game.
	private var _sunScript : sun[]; // A variable to hold the sunscript in the gameobjects.
	public var sunRise : float; //0.15 // The time at when the sun rises.
	public var sunSet : float; //0.6 // The time at when the sun sets.
	
	public var skyBoxBlendModifier : float; //5 // A Variable to adjust the skybox modifier.
	
	public var ambLightMax : Color; // A variable to set the day light color.
	public var ambLightMin : Color; // A variable to set the night light color.
	
	public var morningLight : float; //0.2 // A variable to configure when day light should be.
	public var nightLight : float; //0.6 // A variable to configure when night light should be.
	public var isMorning : boolean = false; // A variable to check if it has hit morning.
	
	private static var second : float = 1; // A constant varibale for how many seconds.
	private static var minute : float = 60 * second; // A constant varibale for how many seconds in a minute.
	private static var hour : float = 60 * minute; // A constant varibale for how many minute in a hour.
	private static var day : float = 24 * hour; // A constant varibale for how many hour in a day.
	
	public var dayCycleInMin : float = 1f; // A variable to show how many minutes in a day.
	private static var degreePerSecond : float = 360 / day; // A constant variable to rotate the sun accordingly.
	private var _dayCycleInSec : float = 0f; // A variable to hold how many seconds in a day.
	private var _degreeRotation : float = 0f; // A variable to rotate the sun accordingly.
	
	private var _timeOfDay : float = 0f; // A variable to hold the current time in the day.
	
	private var _noonTime : float = 0f; // A variable to hold the noon time.
	private var _morningLength : float = 0f; // A variable to calculate how long the morning is.
	private var _eveningLength : float = 0f; // A variable to calculate how long the evening is.
	
	function Awake(){
		instance = this;
	}
	
	function Start(){
		_tod = timeOfDay.Idle; // Setting the variable timeofday to what time of day it should be at the start.
		_dayCycleInSec = dayCycleInMin * minute; // Get the number of real time seconds in an in game day.
		
		_sunScript = new sun[sunArray.Length]; // Initialize the _sunScript array.
		
		RenderSettings.skybox.SetFloat("_Blend",0); // Setting the skybox blend in the render settings.
		
			for(var i : int = 0; i <_sunScript.Length; i++){ // Going throught the sunscript array and getting the component(sun script) if it doesnt have one then it gets added to it.
				var temp : sun = sunArray[i].GetComponent(sun);
				
				if(temp == null){
					sunArray[i].gameObject.AddComponent(sun);
					temp = sunArray[i].GetComponent(sun);
				}
				_sunScript[i] = temp;
			}
		
		_timeOfDay = 0; // Setting the time of day to equal 0 (start).
		_degreeRotation = degreePerSecond * day / (_dayCycleInSec); // Set the _degreeRotation to the amount of degrees that have to rotate for out day.
		sunRise *= _dayCycleInSec;
		sunSet *= _dayCycleInSec;
		_noonTime = _dayCycleInSec / 2;
		
		_morningLength = _noonTime - sunRise; // The length of the morning in seconds.
		_eveningLength = sunSet - _noonTime; // The length of the evening in seconds.
		
		morningLight *= _dayCycleInSec;
		nightLight *= _dayCycleInSec;
		
		setUpLighting(); // Setting up the lighting to minLight values at the start.
	}
		
	function Update(){
		for(var i : int = 0; i < sunArray.Length; i++){ // Position the sun in the sky by adjusting the angle the flare is shinning from.
			sunArray[i].Rotate(new Vector3(_degreeRotation, 0, 0) * Time.deltaTime);
		}
		
		_timeOfDay += Time.deltaTime; // Update the time of day.
		
		// If the day timer is over the limit of how long a day lasts, reset the day timer.
		if(_timeOfDay > _dayCycleInSec){
			_timeOfDay -= _dayCycleInSec;
		}
		
		if(!isMorning && _timeOfDay > morningLight && _timeOfDay < nightLight){
			isMorning = true;
			playerLight.instance.turnOff();
			levelLight.instance.turnOff();
		}else if(isMorning && _timeOfDay > nightLight){
			isMorning = false;
			playerLight.instance.turnOn();
			levelLight.instance.turnOn();
		}
		
		if(_timeOfDay > sunRise && _timeOfDay < _noonTime){
			adjustLighting(true);
		}else if(_timeOfDay > _noonTime && _timeOfDay < sunSet){
			adjustLighting(false);
		}
		
		// The sun is past the sunRise point, before the sunSet point, and the day skybox has not fully faded in.
		if(_timeOfDay > sunRise && _timeOfDay < sunSet && RenderSettings.skybox.GetFloat("_Blend") < 1){
			_tod = timeOfDay.SunRise;
			blendSkybox();
		}else if(_timeOfDay > sunSet && RenderSettings.skybox.GetFloat("_Blend") > 0){
			_tod = timeOfDay.SunSet;
			blendSkybox();
		}else{
			_tod = timeOfDay.Idle;
		}
	}
	
	private function blendSkybox(){
		var temp : float = 0;
		
		switch(_tod){
		case timeOfDay.SunRise:
			temp = (_timeOfDay - sunRise) / _dayCycleInSec * skyBoxBlendModifier;
			break;
		case timeOfDay.SunSet:
			temp = (_timeOfDay - sunSet) / _dayCycleInSec * skyBoxBlendModifier;
			temp = 1 - temp;
			break;
			
		}
		
		RenderSettings.skybox.SetFloat("_Blend",temp);
	}
	
	private function setUpLighting(){
		
		RenderSettings.ambientLight = ambLightMin;
		
		for(var i : int = 0; i < _sunScript.Length; i++){
			if(_sunScript[i].giveLight){
				sunArray[i].GetComponent(Light).intensity = _sunScript[i]._minLightBrightness;	
			}
		}
	}
	
	private function adjustLighting(brighten : boolean){
		var pos : float = 0; // A variable to get the position of the sun in the sky.
		
		if(brighten){
			pos = (_timeOfDay - sunRise) / _morningLength; // Get the position of the sun in the morning sky.
		}else{
			pos = (sunSet - _timeOfDay) / _eveningLength; // Get the position of the sun in the evening sky.
		}
		
		RenderSettings.ambientLight = new Color(ambLightMin.r + ambLightMax.r * pos, 
		                                        ambLightMin.g + ambLightMax.g * pos, 
		                                        ambLightMin.b + ambLightMax.b * pos);
		
		for(var i : int = 0; i < _sunScript.Length; i++){
			if(_sunScript[i].giveLight){
				_sunScript[i].GetComponent(Light).intensity = _sunScript[i]._maxLightBrightness * pos;
			}
		}
	}

}
