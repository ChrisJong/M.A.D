#pragma strict

public class hudWeapon extends MonoBehaviour {
	
	public var weaponType : String = "N/A";
	public var weaponText : GUIText;
	public var reloadText : GUIText;
	public var weaponTexture : GUITexture;
	public var shotgunTexture : Texture[];
	public var normalTexture : Texture[];
	public var rocketTexture : Texture[];
	
	function Awake(){
		weaponTexture = GameObject.Find("weaponTexture").GetComponent(GUITexture) as GUITexture;
		weaponText = GetComponentInChildren(GUIText) as GUIText;
		reloadText.gameObject.active = false;
	}
	
	function Update(){
		switch(weapon.instance.playerWeapon){
			case weapon.instance.weaponType.normal:
				if(weapon.instance.rocketEnabled && weapon.instance.shotgunEnabled){
					weaponTexture.texture = normalTexture[0];
				}else if(weapon.instance.rocketEnabled && !weapon.instance.shotgunEnabled){
					weaponTexture.texture = normalTexture[1];
				}else if(!weapon.instance.rocketEnabled && weapon.instance.shotgunEnabled){
					weaponTexture.texture = normalTexture[2];
				}else{
					weaponTexture.texture = normalTexture[3];
				}
				weaponType = "Normal: ";
				weaponText.text = "Unlimited";
			break;
			case weapon.instance.weaponType.rocket:
				if(weapon.instance.shotgunEnabled){
					weaponTexture.texture = rocketTexture[0];
				}else{
					weaponTexture.texture = rocketTexture[1];
				}
				weaponType = "Rocket: ";
				weaponText.text = weapon.instance.getCurAmmoInClip() + "/" + weapon.instance.getCurAmmo();
				
				if(weapon.instance.rocketLeftInClip < 3 && weapon.instance.rocketLeft != 0){
					reloadText.gameObject.active = true;
				}else{
					reloadText.gameObject.active = false;
				}
			break;
			case weapon.instance.weaponType.shotgun:
				if(weapon.instance.rocketEnabled){
					weaponTexture.texture = shotgunTexture[0];
				}else{
					weaponTexture.texture = shotgunTexture[1];
				}
				weaponType = "Shotgun: ";
				weaponText.text = weapon.instance.getCurAmmoInClip() + "/" + weapon.instance.getCurAmmo();
				
				if(weapon.instance.shotgunLeftInClip < 3 && weapon.instance.shotgunLeft != 0){
					reloadText.gameObject.active = true;
				}else{
					reloadText.gameObject.active = false;
				}
			break;
		}
	}
}
