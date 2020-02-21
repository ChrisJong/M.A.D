#pragma strict

public class menu extends MonoBehaviour {
	
	public static var instance : menu;
	public var isMain : boolean = true; // Creating variable that will tell us if we are on a menu in the game.
	public var isInstruction : boolean = false; // Creating variable that will tell us if we are on a menu in the game.
	public var isNewGame : boolean = false; // Creating variable that will tell us if we are on a menu in the game.
	public var isHighScore : boolean = false; // Creating variable that will tell us if we are on a menu in the game.
	public var isCredit : boolean = false; // Creating variable that will tell us if we are on a menu in the game.
	public var isLoading : boolean = false; // Creating a variable that will tell us if the game is loading.
	
	public var mainCamera : Camera; // This variable will store everything that has to do with the main camera. for this we will be moving the cameras rotation according to each game menu.
	public var panelArray : Array = new Array(); // This will store the images for the instruciton menu.
	public var aMaterial : Array = new Array(); // This will store the normal and hover colours for the text.
	
	public var isLevel1 : boolean = false;
	public var isLevel2 : boolean = false;
	
	function Awake(){
		instance = this;
		
		aMaterial.Add(Resources.Load("normal") as Material);
		aMaterial.Add(Resources.Load("over") as Material);
		
		panelArray.Add(Resources.Load("controlsPanel") as Material);
		panelArray.Add(Resources.Load("hudPanel") as Material);
		panelArray.Add(Resources.Load("instructionsPanel") as Material);
		panelArray.Add(Resources.Load("powerUpsPanel") as Material);
		panelArray.Add(Resources.Load("upgradesPanel") as Material);
		
		mainCamera = Camera.mainCamera;
		
		isMain = true;
		isInstruction = false;
		isNewGame = false;
		isHighScore = false;
		isCredit = false;
		isLoading = false;
		
		isLevel1 = false;
		isLevel2 = false;
		
		Screen.lockCursor = false;
	}
	
	function Update(){
		if(isMain){
			mainCamera.transform.rotation = Quaternion.Euler(Vector3(0,0,0)); // If we are in the main menu then rotate the camera accordingly.
		}else if(isInstruction){
			mainCamera.transform.rotation = Quaternion.Euler(Vector3(0,90,0)); // If we are in the instruction menu then rotate the camera accordingly.
		}else if(isNewGame){
			mainCamera.transform.rotation = Quaternion.Euler(Vector3(0,270,0)); // If we are in the newGame menu then rotate the camera accordingly.
		}else if(isHighScore){
			mainCamera.transform.rotation = Quaternion.Euler(Vector3(0,180,0)); // If we are in the high score menu then rotate the camera accordingly.
		}else if(isCredit){
			mainCamera.transform.rotation = Quaternion.Euler(Vector3(90,0,0)); // If we are in the credits menu then rotate the camera accordingly.
		}else if(isLoading){
			loadingMenu.instance.gameObject.SetActiveRecursively(true);
			//mainCamera.transform.rotation = Quaternion.Euler(Vector3(0,270,0));
			mainCamera.transform.position = new Vector3(-200f, mainCamera.transform.position.y, mainCamera.transform.position.z);
		}else{
			return;
		}
	}
}
