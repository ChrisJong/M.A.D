#pragma strict

public class gameMaster extends MonoBehaviour {
	
	public static var instance : gameMaster;
	
	public var music : AudioClip[];
	public var audioSource : AudioSource;
	public var randomMusic : int;
	public var isMusicPaused : boolean = false;
	public var audioIsOn : boolean = true;
	
	function Awake(){
		instance = this;
		audioSource = GetComponent(AudioSource) as AudioSource;
		audioSource.volume = 0.3f;
	}
	
	function Start(){
		startMusic();
		audioIsOn = true;
	}
	
	function Update(){
		musicPlayer();
	}
	
	function OnAppllicationFocus(state : boolean){
		if(state){
			audioSource.Play();
			isMusicPaused = false;
		}else{
			audioSource.Pause();
			isMusicPaused = true;
		}
	}
	
	function startMusic(){
		randomMusic = Random.Range(0, music.Length);
		audioSource.clip = music[randomMusic];
		audioSource.Play();
		audioIsOn = true;
	}
	
	function musicPlayer(){
		if(audioSource.time >= audioSource.clip.length && audioIsOn == true){
			randomMusic = Random.Range(0, music.Length);
			audioSource.clip = music[randomMusic];
			audioSource.Play();
		}else{
			return;
		}
	}
	
	public function isAudio(state : boolean){
		if(state == true){
			startMusic();
		}else if(state == false){
			audioIsOn = false;
			audioSource.Stop();
		}
	}
}