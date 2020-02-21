#pragma strict

public class instructionPanel extends MonoBehaviour {
	
	public static var instance : instructionPanel;
	
	public var picturePanel : MeshRenderer;
	
	function Awake(){
		instance = this;
		picturePanel = GetComponent(MeshRenderer) as MeshRenderer;
	}

}
