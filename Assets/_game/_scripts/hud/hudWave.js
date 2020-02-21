#pragma strict

public class hudWave extends MonoBehaviour {
	
	public static var instance : hudWave;
	
	private var _waveText : GUIText;	
		
	function Awake(){
		instance = this;
		_waveText = GetComponent(GUIText) as GUIText;
	}
			
	public function updateWaveText(){
		_waveText.text = waveSystem.instance.waveText;
	}

}
