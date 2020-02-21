#pragma strict

public class hudTurret extends MonoBehaviour {
	
	public var turretTexture : Texture[];
	public var turretBG : GUITexture;
	
	function Awake(){
		turretBG = GetComponent(GUITexture) as GUITexture;
	}
		
	function Update(){
		if(!mainPlayerStatus.instance.turretEnabled && !mainPlayerStatus.instance.turretTwoEnabled){
			turretBG.texture = turretTexture[0] as Texture;
		}else if(mainPlayerStatus.instance.turretEnabled && !mainPlayerStatus.instance.turretTwoEnabled){
			turretBG.texture = turretTexture[1] as Texture;
		}else if(!mainPlayerStatus.instance.turretEnabled && mainPlayerStatus.instance.turretTwoEnabled){
			turretBG.texture = turretTexture[2] as Texture;
		}else if(mainPlayerStatus.instance.turretEnabled && mainPlayerStatus.instance.turretTwoEnabled){
			turretBG.texture = turretTexture[5] as Texture;
			if(mainPlayerController.instance.currentNumber == 0){
				turretBG.texture = turretTexture[3] as Texture;
			}else if(mainPlayerController.instance.currentNumber == 1){
				turretBG.texture = turretTexture[4] as Texture;
			}
		}
	}

}
