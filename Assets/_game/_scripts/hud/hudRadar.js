#pragma strict
@script ExecuteInEditMode()

public class hudRadar extends MonoBehaviour {

	public var blip : Texture;
	public var radarBG : Texture;
	
	public var turretBlip : Texture;
	
	private var refPlayer : GameObject;
	public var centerObject : Transform;
	
	public var checkAIscript : boolean = true;
	public var enemyTag : String = "enemy";
	
	public enum radarLocationValues {
		topLeft,
		topCenter,
		topRight,
		middleLeft,
		middleCenter,
		middleRight,
		bottomLeft,
		bottomCenter,
		bottomRight,
		custom
	}
	public var radarLocation : radarLocationValues = radarLocationValues.bottomRight;
		
	public var mapScale = 2;//0.3;
	public var mapSizePercent = 15;
	public var mapCenterCustom : Vector2;
	private var mapWidth : float;
	private var mapHeight : float;
	private var mapCenter : Vector2;
	private var bX : float;
	private var bY : float;
	
	
	function Start(){
		refPlayer = GameObject.Find("mainPlayer");
		centerObject = refPlayer.transform;
		setMapLocation();	
	}
	
	function OnGUI(){
	 	bX=centerObject.transform.position.x * mapScale;
	 	bY=centerObject.transform.position.z * mapScale;	
	 	GUI.DrawTexture(Rect(mapCenter.x - mapWidth/2,mapCenter.y-mapHeight/2,mapWidth,mapHeight),radarBG);
		
		DrawBlipsForEnemies();
		
	}
	  
	function drawBlip(go : GameObject,aTexture : Texture){
		
		var centerPos = centerObject.position;
		var extPos = go.transform.position;
		
		var dist=Vector3.Distance(centerPos,extPos);
		 
		var dx=centerPos.x-extPos.x;
		var dz=centerPos.z-extPos.z;
		
		var deltay=Mathf.Atan2(dx,dz)*Mathf.Rad2Deg - 270 - centerObject.eulerAngles.y;
		
		bX = dist*Mathf.Cos(deltay * Mathf.Deg2Rad);
		bY = dist*Mathf.Sin(deltay * Mathf.Deg2Rad);
		
		bX = bX*mapScale;
		bY = bY*mapScale;
		
		if(dist<=mapWidth*.5/mapScale){ 
		   GUI.DrawTexture(Rect(mapCenter.x+bX,mapCenter.y+bY,4,4),aTexture);
	 
		}
	 
	}
	 
	function DrawBlipsForEnemies(){
	    var gos : GameObject[];
	    gos = GameObject.FindGameObjectsWithTag(enemyTag);
	    
	    var turrentOnScene : GameObject[];
	    turrentOnScene = GameObject.FindGameObjectsWithTag("turret");
	 
	    for(var go : GameObject in gos){ 
	   		var blipChoice : Texture = blip;
			drawBlip(go,blipChoice);
	    }
	    
	    for(var turretObject : GameObject in turrentOnScene){
	    	var turretChoice : Texture = turretBlip;
	    	drawBlip(turretObject,turretChoice);
	    }
	}
	
	function setMapLocation(){
		mapWidth = Screen.width*mapSizePercent/100.0;
		mapHeight = mapWidth;
	
		if(radarLocation == radarLocationValues.topLeft){
			mapCenter = Vector2(mapWidth/2, mapHeight/2);
		}else if(radarLocation == radarLocationValues.topCenter){
			mapCenter = Vector2(Screen.width/2, mapHeight/2);
		}else if(radarLocation == radarLocationValues.topRight){
			mapCenter = Vector2(Screen.width-mapWidth/2, mapHeight/2);
		}else if(radarLocation == radarLocationValues.middleLeft){
			mapCenter = Vector2(mapWidth/2, Screen.height/2);
		}else if(radarLocation == radarLocationValues.middleCenter){
			mapCenter = Vector2(Screen.width/2, Screen.height/2);
		}else if(radarLocation == radarLocationValues.middleRight){
			mapCenter = Vector2(Screen.width-mapWidth/2, Screen.height/2);
		}else if(radarLocation == radarLocationValues.bottomLeft){
			mapCenter = Vector2(mapWidth/2, Screen.height - mapHeight/2);
		}else if(radarLocation == radarLocationValues.bottomCenter){
			mapCenter = Vector2(Screen.width/2, Screen.height - mapHeight/2);
		}else if(radarLocation == radarLocationValues.bottomRight){
			mapCenter = Vector2(Screen.width-mapWidth/2, Screen.height - mapHeight/2);
		}else if(radarLocation == radarLocationValues.custom){
			mapCenter = mapCenterCustom;
		}
		
	} 
	
}