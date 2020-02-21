#pragma strict

public class lockCursor extends MonoBehaviour {
	
	public static var instance : lockCursor;
	
	public var isPaused : boolean = false;
	public var audioString : String = "";
	
	function Awake(){
		audioString = "Off";
		instance = this;
		Screen.lockCursor = true;
	}
	
	function Update(){
		if((mainPlayerAnimation.instance.isDead || waveSystem.instance.isWaveEnd) && !isPaused){
			Screen.lockCursor = false;
		}else if(Input.GetKeyDown(KeyCode.Escape) && !isPaused){
			Time.timeScale = 0.0f;
     		isPaused = true;
     		Screen.lockCursor = false;
     		
		}else if(Input.GetKeyDown(KeyCode.Escape) && isPaused){
			Time.timeScale = 1.0f;
      		isPaused = false;
      		Screen.lockCursor = true;
		}else if((!mainPlayerAnimation.instance.isDead || !waveSystem.instance.isWaveEnd) && !isPaused){
			Screen.lockCursor = true;
		}
	}
	
	function OnGUI(){
		if(isPaused){
			if(GUI.Button (Rect((Screen.width)/2 - 75,150,150,40), "Quit")){
				Application.Quit();
			}
			
			if(GUI.Button (Rect((Screen.width)/2 - 75,200,150,40), "Back To Menu")){
				Screen.lockCursor = false;
				Time.timeScale = 1.0f;
				isPaused = false;
				Application.LoadLevel(0);
			}
			
			if(GUI.Button (Rect((Screen.width)/2 - 75,250,150,40), "Continue")){
				Time.timeScale = 1.0f;
				isPaused = false;
				Screen.lockCursor = true;
			}
			
			if(GUI.Button(Rect((Screen.width)/2 - 75, 300, 150, 40), "Turn " + audioString.ToString() + " Music")){
				if(gameMaster.instance.audioIsOn == true){
					gameMaster.instance.isAudio(false);
					audioString = "On";
				}else if(gameMaster.instance.audioIsOn == false){
					gameMaster.instance.isAudio(true);
					audioString = "Off";
				}
				
			}
		}
	}
}