#pragma strict

public class saveHighScore extends MonoBehaviour {
	
	public static var instance : saveHighScore;
	
	function Awake(){
		instance = this;
	}
	
	public function saveScore(score : int){
		var newScore : int;
		//var newName : String;
		var oldScore : int;
		//var oldName : String;
		newScore = score;
		//newName = name;
		for(var i : int = 0; i < 10; i++){
			if(PlayerPrefs.HasKey(i+"score")){
				if(PlayerPrefs.GetInt(i+"score")<newScore){ 
					// new score is higher than the stored score
					oldScore = PlayerPrefs.GetInt(i+"score");
					//oldName = PlayerPrefs.GetString(i+"HScoreName");
					PlayerPrefs.SetInt(i+"score",newScore);
					//PlayerPrefs.SetString(i+"HScoreName",newName);
					newScore = oldScore;
					//newName = oldName;
				}
			}else{
				PlayerPrefs.SetInt(i+"score",newScore);
				//PlayerPrefs.SetString(i+"HScoreName",newName);
				newScore = 0;
				//newName = "";
			}
		}
	}
}
