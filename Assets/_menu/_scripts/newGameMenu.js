#pragma strict

public class newGameMenu extends MonoBehaviour {
	
	public static var instance : newGameMenu;
	
	public enum buttonType {
		level1,
		level2,
		level1Pic,
		level2Pic,
		back
	}
	public var newGameMenuButton : buttonType;
	private var _level1Material : MeshRenderer;
	private var _level2Material : MeshRenderer;
	private var _backMaterial : MeshRenderer;
	
	function Awake(){
		instance = this;
		
		switch(newGameMenuButton){
			case buttonType.level1:
				_level1Material = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.level2:
				_level2Material = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.back:
				_backMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
		}
	}
	
	function OnMouseEnter(){
		if(menu.instance.isNewGame == true){
			switch(newGameMenuButton){
				case buttonType.level1:
					_level1Material.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.level2:
					_level2Material.material = menu.instance.aMaterial[1] as Material;
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
		if(menu.instance.isNewGame == true){
			switch(newGameMenuButton){
				case buttonType.level1:
					_level1Material.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.level2:
					_level2Material.material = menu.instance.aMaterial[0] as Material;
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
		if(menu.instance.isNewGame == true){
			switch(newGameMenuButton){
				case buttonType.level1:
					menu.instance.isLoading = true;
					menu.instance.isNewGame = false;
					menu.instance.isLevel1 = true;
					_level1Material.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.level2:
					menu.instance.isLoading = true;
					menu.instance.isNewGame = false;
					menu.instance.isLevel2 = true;
					_level2Material.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.level1Pic:
					menu.instance.isLoading = true;
					menu.instance.isNewGame = false;
					menu.instance.isLevel1 = true;
				break;
				case buttonType.level2Pic:
					menu.instance.isLoading = true;
					menu.instance.isNewGame = false;
					menu.instance.isLevel2 = true;
				break;
				case buttonType.back:
					menu.instance.isMain = true;
					menu.instance.isNewGame = false;
					_backMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
			}
		}else{
			return;
		}
	}

}
