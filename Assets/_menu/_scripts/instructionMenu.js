#pragma strict

public class instructionMenu extends MonoBehaviour {
	
	public enum buttonType { // Setting a enumeration with a values for the buttons.
		controls,
		hud,
		instructions,
		powerUps,
		upgrades,
		back
	}
	public var instructionMenuButton : buttonType; // storing all the buttonType enumerations into a variable to be used or called on later.
	
	private var _instructionPanel : MeshRenderer; // this variable will store the panel that will change as you click on the buttons.
	
	private var _controlsMaterial : MeshRenderer;
	private var _hudMaterial : MeshRenderer;
	private var _instructionMaterial : MeshRenderer;
	private var _powerUpsMaterial : MeshRenderer;
	private var _upgradesMaterial : MeshRenderer;
	private var _backMaterial : MeshRenderer;
	
	function Awake(){
		switch(instructionMenuButton){
			case buttonType.controls:
				_controlsMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.hud:
				_hudMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.instructions:
				_instructionMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.powerUps:
				_powerUpsMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.upgrades:
				_upgradesMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.back:
				_backMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
		}
	}
		
	function OnMouseEnter(){
		if(menu.instance.isInstruction == true){
			switch(instructionMenuButton){
				case buttonType.controls:
					_controlsMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.hud:
					_hudMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.instructions:
					_instructionMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.powerUps:
					_powerUpsMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.upgrades:
					_upgradesMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.back:
					_backMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
			}
		}else{
			return;
		}
	}
	
	function OnMouseExit(){
		if(menu.instance.isInstruction == true){
			switch(instructionMenuButton){
				case buttonType.controls:
					_controlsMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.hud:
					_hudMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.instructions:
					_instructionMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.powerUps:
					_powerUpsMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.upgrades:
					_upgradesMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.back:
					_backMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
			}
		}else{
			return;
		}
	}
	
	function OnMouseUp(){
		if(menu.instance.isInstruction == true){
			switch(instructionMenuButton){
				case buttonType.controls:
					_controlsMaterial.material = menu.instance.aMaterial[0] as Material;
					instructionPanel.instance.picturePanel.material = menu.instance.panelArray[0] as Material; // We get the panel material and we change it to a panel of arrays stored in another script.
				break;
				case buttonType.hud:
					_hudMaterial.material = menu.instance.aMaterial[0] as Material;
					instructionPanel.instance.picturePanel.material = menu.instance.panelArray[1] as Material; // We get the panel material and we change it to a panel of arrays stored in another script.
				break;
				case buttonType.instructions:
					_instructionMaterial.material = menu.instance.aMaterial[0] as Material;
					instructionPanel.instance.picturePanel.material = menu.instance.panelArray[2] as Material; // We get the panel material and we change it to a panel of arrays stored in another script.
				break;
				case buttonType.powerUps:
					_powerUpsMaterial.material = menu.instance.aMaterial[0] as Material;
					instructionPanel.instance.picturePanel.material = menu.instance.panelArray[3] as Material; // We get the panel material and we change it to a panel of arrays stored in another script.
				break;
				case buttonType.upgrades:
					_upgradesMaterial.material = menu.instance.aMaterial[0] as Material;
					instructionPanel.instance.picturePanel.material = menu.instance.panelArray[4] as Material; // We get the panel material and we change it to a panel of arrays stored in another script.
				break;
				case buttonType.back:
					menu.instance.isMain = true;
					menu.instance.isInstruction = false;
					_backMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
			}
		}else{
			return;
		}
	}

}
