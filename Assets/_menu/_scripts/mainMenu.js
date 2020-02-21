#pragma strict

public class mainMenu extends MonoBehaviour {
	public enum buttonType {
		newGame,
		instruction,
		highScore,
		credit,
		exit
	}
	public var menuButton : buttonType;
	private var _newGameMaterial : MeshRenderer;
	private var _newGameParticle : ParticleEmitter;
	private var _instructionMaterial : MeshRenderer;
	private var _instructionParticle : ParticleEmitter;
	private var _highScoreMaterial : MeshRenderer;
	private var _highScoreParticle : ParticleEmitter;
	private var _creditMaterial : MeshRenderer;
	private var _creditParticle : ParticleEmitter;
	private var _exitMaterial : MeshRenderer;
	private var _exitParticle : ParticleEmitter;
	
	function Awake(){
		
		switch(menuButton){
			case buttonType.newGame:
				_newGameParticle = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
				_newGameMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.instruction:
				_instructionParticle = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
				_instructionMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.highScore:
				_highScoreParticle = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
				_highScoreMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.credit:
				_creditParticle = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
				_creditMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
			case buttonType.exit:
				_exitParticle = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
				_exitMaterial = GetComponent(MeshRenderer) as MeshRenderer;
			break;
		}
	}
	
	function OnMouseEnter(){
		if(menu.instance.isMain == true){
			switch(menuButton){
				case buttonType.newGame:
					_newGameParticle.emit = true;
					_newGameMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.instruction:
					_instructionParticle.emit = true;
					_instructionMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.highScore:
					_highScoreParticle.emit = true;
					_highScoreMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.credit:
					_creditParticle.emit = true;
					_creditMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
				case buttonType.exit:
					_exitParticle.emit = true;
					_exitMaterial.material = menu.instance.aMaterial[1] as Material;
				break;
			}
		}else{
			return;
		}
	}
	
	function OnMouseExit(){
		if(menu.instance.isMain == true){
			switch(menuButton){
				case buttonType.newGame:
					_newGameParticle.emit = false;
					_newGameMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.instruction:
					_instructionParticle.emit = false;
					_instructionMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.highScore:
					_highScoreParticle.emit = false;
					_highScoreMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.credit:
					_creditParticle.emit = false;
					_creditMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.exit:
					_exitParticle.emit = false;
					_exitMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
			}
		}else{
			return;
		}
	}
	
	function OnMouseUp(){
		if(menu.instance.isMain == true){
			switch(menuButton){
				case buttonType.newGame:
					_newGameParticle.emit = false;
					menu.instance.isMain = false;
					menu.instance.isNewGame = true;
					_newGameMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.instruction:
					_instructionParticle.emit = false;
					menu.instance.isMain = false;
					menu.instance.isInstruction = true;
					_instructionMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.highScore:
					_highScoreParticle.emit = false;
					menu.instance.isMain = false;
					menu.instance.isHighScore = true;
					_highScoreMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.credit:
					_creditParticle.emit = false;
					menu.instance.isMain = false;
					menu.instance.isCredit = true;
					_creditMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
				case buttonType.exit:
					_exitParticle.emit = false;
					Application.Quit();
					_exitMaterial.material = menu.instance.aMaterial[0] as Material;
				break;
			}
		}else{
			return;
		}
	}
	
}
