#pragma strict

public class highScoreMenu extends MonoBehaviour {
	
	public enum buttonType { // Setting a enumeration with a values for the buttons, was meant to be a boolean variable.
		back
	}
	public var highScoreButton : buttonType; // storing all the buttonType enumerations into a variable to be used or called on later.
	
	private var _backMaterial : MeshRenderer; // this variable will store the back buttons guiText material soo we can change its colour.
	
	function Awake(){
		_backMaterial = GetComponent(MeshRenderer) as MeshRenderer; // Getting the meshrenderer component in the back buttons guiText and storing it into a variable for later use.
	}
	
	function OnMouseEnter(){
		if(menu.instance.isHighScore == true){ // Just for insurance but we are in the highScore menu then do the rest of the if statement.
			switch(highScoreButton){
				case buttonType.back:
					_backMaterial.material = menu.instance.aMaterial[1] as Material; // If the button is equal to a buttonType.back then we change it colour in the meshrenderer component we stored earlier.
				break;
			}
		}else{
			return;
		}
	}
	
	function OnMouseExit(){
		if(menu.instance.isHighScore == true){ // Just for insurance but we are in the highScore menu then do the rest of the if statement.
			switch(highScoreButton){
				case buttonType.back:
					_backMaterial.material = menu.instance.aMaterial[0] as Material; // If the button is equal to a buttonType.back then we change it colour in the meshrenderer component we stored earlier.
				break;
			}
		}else{
			return;
		}
	}
	
	function OnMouseUp(){
		if(menu.instance.isHighScore == true){ // Just for insurance but we are in the highScore menu then do the rest of the if statement.
			switch(highScoreButton){
				case buttonType.back:
					menu.instance.isMain = true; // We set an outside variable to true which will bring us back to the main Menu.
					menu.instance.isHighScore = false; // and we aren't in the highscore menu anymore so we set it to false.
					_backMaterial.material = menu.instance.aMaterial[0] as Material; // If the button is equal to a buttonType.back then we change it colour in the meshrenderer component we stored earlier.
				break;
			}
		}else{
			return;
		}
	}
}
