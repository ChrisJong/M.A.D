#pragma strict

public class hudPlayerPoints extends MonoBehaviour {
	
	public var myInformation : informationHolder;
	
	public var text : GUIText;
	
	function Awake(){
		text = gameObject.GetComponent(GUIText) as GUIText;
		text.text = "0 / 0";
	}
	
	function LateUpdate(){
		if(mainPlayerStatus.instance.turretEnabled || mainPlayerStatus.instance.turretTwoEnabled){
			text.text = mainPlayerStatus.instance.playerPoint.ToString() + " / " + myInformation.maxDefensePoint.ToString();
		}else{
			return;
		}
	}
	
}