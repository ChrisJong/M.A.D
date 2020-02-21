#pragma strict

public class hudMoney extends MonoBehaviour {
		
	public static var instance : hudMoney;
	private var _textMoney : GUIText;
	
	
	function Awake(){
		instance = this;
		_textMoney = GetComponent(GUIText) as GUIText;
	}
	
	function Start(){
		updateMoney();
	}
		
	public function updateMoney(){
		_textMoney.text = mainPlayerStatus.instance.playerMoney.ToString();
	}

}
