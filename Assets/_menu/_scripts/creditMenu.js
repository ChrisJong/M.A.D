#pragma strict

public class creditMenu extends MonoBehaviour {
	
	public var isBackButton : boolean = false; // Make a variable that will be our back button to go back the main menu.
	private var _backMatieral : MeshRenderer; // Make a variable to hold the material for the guiText soo we can change its colour when we hover over it.
	
	function Awake(){
		if(isBackButton){
			_backMatieral = GetComponent(MeshRenderer) as MeshRenderer; // Getting the meshrenderer on the guiText component and storing it to a variable for use later.
		}
	}
	
	function OnMouseEnter(){
		if(isBackButton){
			_backMatieral.material = menu.instance.aMaterial[1] as Material; // If the backButton is true and we enter the collider set on the guiText then we change the colour.
		}
	}
	
	function OnMouseExit(){
		if(isBackButton){
			_backMatieral.material = menu.instance.aMaterial[0] as Material; // If the backButton is true and we enter the collider set on the guiText then we change the colour.
		}
	}
	
	function OnMouseUp(){
		if(isBackButton){
			menu.instance.isMain = true; // If we click on the backbutton then we set the isMain to true which should take us back to the main menu.
			menu.instance.isCredit = false; // we also set the credits to false, saying that we aint on the credits menu anymore.
			_backMatieral.material = menu.instance.aMaterial[0] as Material; // If the backButton is true and we enter the collider set on the guiText then we change the colour.
		}
	}

}