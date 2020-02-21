#pragma strict

public class hudHp extends MonoBehaviour {
	
	public static var instance : hudHp;
	public var myInformation : informationHolder;
	
	public var hpText : GUIText;
	public var dangerTexture : GUITexture;
	
	public var minFloat : float = 0.15f;
	public var maxFloat : float = 1f;
	public var alphaFloat : float = 0.5f;
	
	public var minColor : Color;
	public var maxColor : Color;
	
	public var minTure : boolean = true;
	public var maxTure : boolean = false;
	
	public var audioSource : AudioSource;
	public var hearBeating : AudioClip;
	
	function Awake(){
		instance = this;
		hpText = GetComponent(GUIText) as GUIText;
		
		minColor = new Color(minFloat, minFloat, minFloat, alphaFloat);
		maxColor = new Color(maxFloat, maxFloat, maxFloat, alphaFloat);
		
		dangerTexture.color = minColor;
		dangerTexture.enabled = false;
		audioSource = GetComponent(AudioSource) as AudioSource;
		audioSource.clip = hearBeating as AudioClip;
	}
	
	function Update(){
		hpText.text = mainPlayerStatus.instance.curHP.ToString() + " / " + myInformation.maxHP.ToString();
		if(mainPlayerStatus.instance.curHP < 30){
			dangerTexture.enabled = true;
			if(dangerTexture.color == minColor){
				minTure = true;
				maxTure = false;
			}else if(dangerTexture.color == maxColor){
				minTure = false;
				maxTure = true;
			}
			dangerFade();
			
			if(audioSource.isPlaying){
				return;
			}else{
				audioSource.Play();
			}
		}else if(mainPlayerStatus.instance.curHP > 30){
			audioSource.Stop();
			dangerTexture.enabled = false;
			dangerReset();
		}
	}
	
	function dangerFade(){
		if(minTure){
			dangerTexture.color = Color.Lerp(dangerTexture.color, maxColor, Time.deltaTime * 8f);
		}
		if(maxTure){
			dangerTexture.color = Color.Lerp(dangerTexture.color, minColor, Time.deltaTime * 8f);
		}
	}
	
	function dangerReset(){
		dangerTexture.color = minColor;
	}

}
