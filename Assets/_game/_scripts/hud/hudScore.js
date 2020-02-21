#pragma strict

public class hudScore extends MonoBehaviour {
	
	public static var instance : hudScore;
	
	public var curScore : int;
	private var _minScore : int;
	private var _scoreText : GUIText;
	
	function Awake(){
		instance = this;
		_minScore = 0;
		_scoreText = GetComponent(GUIText) as GUIText;
		curScore = _minScore;
	}
		
	function LateUpdate(){
		_scoreText.text = curScore.ToString();
	}
	
	function addScore(addPoints : int){
		curScore += addPoints;
		return curScore;
	}

}
