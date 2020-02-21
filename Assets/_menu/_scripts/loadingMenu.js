#pragma strict

public class loadingMenu extends MonoBehaviour {
	
	public static var instance : loadingMenu;
	public var timer : float;
	public var instructionMesh : MeshRenderer;
	public var loadingText : String = "Game will load in .... ";
	public var textMesh : TextMesh;
	
	function Awake(){
		gameObject.SetActiveRecursively(false);
		instance = this;
		timer = 20f;
		textMesh.text = loadingText.ToString();
	}
	
	function Start(){
		instructionMesh.material = menu.instance.panelArray[0] as Material;
	}
		
	function Update(){
		if(menu.instance.isLoading){
			timer -= Time.deltaTime;
			textMesh.text = loadingText.ToString() + parseInt(timer);
			if(timer <= 10f){
				instructionMesh.material = menu.instance.panelArray[1] as Material;
			}
			if(timer <= 0f){
				if(menu.instance.isLevel1){
					textMesh.text = "Game Loaded";
					Application.LoadLevel(1);
				}else if(menu.instance.isLevel2){
					textMesh.text = "Game Loaded";
					Application.LoadLevel(2);
				}else{
					return;
				}
			}
		}
	}

}
