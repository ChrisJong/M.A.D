#pragma strict

public class waveSystem extends MonoBehaviour {
	
	public static var instance : waveSystem;
	public var myInformation : informationHolder;
	
	public enum waveState {
		idle,
		init,
		waveStart,
		playing,
		waveEnd,
		gameOver
	}
	public var state : waveState = waveState.idle;
	
	public var enemyToSpawn : GameObject[];
	public var bossToSpawn : GameObject[];
	public var spawnPoints : Transform[];
	
	public var enemyOnStage : Array = new Array();
	public var bossOnStage : Array = new Array();
	
	public var currentBoss : int = 0;
	public var currentEnemies : int = 0;
	public var maxEnemies : int = 10;
	public var minEnemies : int = 5;
	public var minBoss : int = 1;
	public var maxBoss : int = 2;
	private var _spawnInterval : float = 3f;
	
	public var isSpawn : boolean = true;
	public var isSpawnBoss : boolean = true;
	
	public var waveTimer : float = 300f;
	public var waveCount : int = 0;
	private var _nextWaveTime : float = 180f;
	private var _waveEndTime : int = 0;
	
	private var waveSystemState : boolean = true;
	public var isWaveEnd : boolean = false;
	public var riskEnabled : boolean = false;
	public var safeEnabled : boolean = false;
	
	public var audioSource : AudioSource;
	public var audioClips : AudioClip[];
	
	public var waveText : String = "Wave: ";
	
	function Awake(){
		instance = this;
		state = waveState.init;
		audioSource = GetComponent(AudioSource) as AudioSource;
	}
		
	function Start():IEnumerator{
		while(waveSystemState == true){
			switch(state){
				case waveState.idle:
					if(riskEnabled){
						state = waveState.init;
					}else if(safeEnabled){
						
					}else{
						state = waveState.init;
					}
					yield WaitForSeconds(1);
				break;
				case waveState.init:
					isWaveEnd = false;
					init();
					waveText = "Wave Starting";
					hudWave.instance.updateWaveText();
					yield WaitForSeconds(1);
					state = waveState.waveStart;
				break;
				case waveState.waveStart:
					if(_spawnInterval <= 0f){
						_spawnInterval = 0.1f;
					}
					currentEnemies = 0;
					currentBoss = 0;
					waveTimer = _nextWaveTime;
					waveText = "Wave " + waveCount.ToString();
					hudWave.instance.updateWaveText();
					yield WaitForSeconds(2);
					state = waveState.playing;
				break;
				case waveState.playing:
					if(isSpawn){
						spawnEnemy();
					}
					if(isSpawnBoss){
						spawnBoss();
					}
					yield WaitForSeconds(_spawnInterval);
				break;
				case waveState.waveEnd:
					enemyOnStage.Clear();
					bossOnStage.Clear();
					waveText = "Wave Ended";
					hudWave.instance.updateWaveText();
					yield WaitForSeconds(1);
				break;
				case waveState.gameOver:
					audioSource.clip = audioClips[1] as AudioClip;
					audioSource.Play();
					gameOver.instance.gameObject.SetActiveRecursively(true);
					gameOver.instance.scoreText.text = "Your Score: " + hudScore.instance.curScore.ToString();
					upgradeHUD.instance.gameObject.SetActiveRecursively(false);
					saveHighScore.instance.saveScore(hudScore.instance.curScore);
					Debug.Log("Game Over");
					waveSystemState = false;
					yield WaitForSeconds(2);
				break;
			}
		}
	}
	
	function Update(){
		if(currentEnemies < minEnemies && !mainPlayerAnimation.instance.isDead){
			isSpawn = true;
		}
		if(currentEnemies >= maxEnemies || mainPlayerAnimation.instance.isDead){
			isSpawn = false;
		}
		
		if(currentBoss < minBoss && !mainPlayerAnimation.instance.isDead){
			isSpawnBoss = true;
		}
		if(currentBoss >= maxBoss || mainPlayerAnimation.instance.isDead){
			isSpawnBoss = false;
		}
		
		if(mainPlayerAnimation.instance.isDead){
			state = waveState.gameOver;
		}
			
		if(state == waveState.playing){
			waveTimer -= Time.deltaTime;
			waveText = "Wave " + waveCount.ToString() + " Ends In " + parseInt(waveTimer).ToString() + " Seconds";
			hudWave.instance.updateWaveText();
			if(parseInt(waveTimer) < 5){
				waveText = "Wave Ending In " + parseInt(waveTimer).ToString();
				hudWave.instance.updateWaveText();
			}
			if(parseInt(waveTimer) == _waveEndTime){
				state = waveState.waveEnd;
				isWaveEnd = true;
				weapon.instance.damageBoost();
				audioSource.clip = audioClips[0] as AudioClip;
				audioSource.Play();
			}
		}
	}
	
	function init(){
		waveCount++;
		if(waveCount == 1){
			maxEnemies = 10;
			minEnemies = 5;
		}else if(waveCount > 1){
			_spawnInterval -= Random.Range(0.1f,0.5f);
			if(riskEnabled){
				var moreOrLess : int = Random.Range(0,10);
				var randomChance : int = Random.Range(0,10);
				var money : int = 0;
				if(randomChance < 5){
					money = 1;
				}else if(randomChance > 5){
					money = Random.Range(1000,3000);
				}
				mainPlayerStatus.instance.addMoney(money);
				if(moreOrLess <= 2){
					if(waveCount > 3){
						maxBoss += Random.Range(2,4);
						minBoss += Random.Range(0,2);
						maxEnemies += Random.Range(10,20);
						minEnemies += Random.Range(5,10);
						
						myInformation.eMoveSpeed += Random.Range(1,5);
						myInformation.eRunSpeed += Random.Range(1,5);
						myInformation.eRotateSpeed += Random.Range(1,5);
						myInformation.eMinHP += Random.Range(0,5);
						myInformation.eMaxHP += Random.Range(5,10);
	
						myInformation.bMoveSpeed += Random.Range(1,5);
						myInformation.bRunSpeed  += Random.Range(1,5);
						myInformation.bRotateSpeed += Random.Range(1,5);
						myInformation.bMinHP += Random.Range(0,20);
						myInformation.bMaxHP += Random.Range(20,40);
						
					}else{
						myInformation.eMinHP += Random.Range(0,5);
						myInformation.eMaxHP += Random.Range(5,10);
						myInformation.eRunSpeed += Random.Range(1,5);
						
						maxEnemies += Random.Range(10,20);
						minEnemies += Random.Range(5,10);
					}
				}else if(moreOrLess > 2){
					_spawnInterval -= 0.1f;
					if(waveCount > 3){
					
						maxBoss += Random.Range(5,10);
						minBoss += Random.Range(2,5);
						maxEnemies += Random.Range(50,100);
						minEnemies += Random.Range(25,50);
						
						myInformation.eMoveSpeed += Random.Range(5,10);
						myInformation.eRunSpeed += Random.Range(5,10);
						myInformation.eRotateSpeed += Random.Range(5,10);
						myInformation.eMinHP += Random.Range(5,10);
						myInformation.eMaxHP += Random.Range(10,50);
						
						myInformation.bMoveSpeed += Random.Range(10,20);
						myInformation.bRunSpeed  += Random.Range(10,20);
						myInformation.bRotateSpeed += Random.Range(10,20);
						myInformation.bMinHP += Random.Range(10,50);
						myInformation.bMaxHP += Random.Range(50,100);
						
					}else{
						
						myInformation.eMinHP += Random.Range(0,10);
						myInformation.eMaxHP += Random.Range(10,20);
						myInformation.eRunSpeed += Random.Range(1,5);
						
						maxEnemies += Random.Range(50,100);
						minEnemies += Random.Range(25,50);
					}
				}
			}else{
				if(waveCount > 3){
					maxBoss += Random.Range(2,4);
					minBoss += Random.Range(0,2);
					maxEnemies += Random.Range(10,20);
					minEnemies += Random.Range(5,10);
					
					myInformation.eMoveSpeed += Random.Range(1,5);
					myInformation.eRunSpeed += Random.Range(1,5);
					myInformation.eRotateSpeed += Random.Range(1,5);
					myInformation.eMinHP += Random.Range(0,5);
					myInformation.eMaxHP += Random.Range(5,10);
	
					myInformation.bMoveSpeed += Random.Range(1,5);
					myInformation.bRunSpeed  += Random.Range(1,5);
					myInformation.bRotateSpeed += Random.Range(1,5);
					myInformation.bMinHP += Random.Range(0,20);
					myInformation.bMaxHP += Random.Range(20,40);
				}else{
					
					myInformation.eMinHP += Random.Range(0,5);
					myInformation.eMaxHP += Random.Range(5,10);
					myInformation.eRunSpeed += Random.Range(1,5);
					
					maxEnemies += Random.Range(10,20);
					minEnemies += Random.Range(5,10);
				}
			}
		}
		riskEnabled = false;
	}
	
	function spawnEnemy(){
		if(_spawnInterval > 2f){
			for(var i : int = 0; i < 2; i++){
				var randomSpawnPointLoop : Transform;
				var randomEnemyLoop : GameObject;
				var newEnemyLoop : GameObject;
				randomSpawnPointLoop = spawnPoints[Random.Range(0, (spawnPoints.Length - 1))];
				randomEnemyLoop = enemyToSpawn[Random.Range(0, (enemyToSpawn.Length - 1))];
				newEnemyLoop = Instantiate(randomEnemyLoop, randomSpawnPointLoop.position, randomSpawnPointLoop.rotation) as GameObject;
				currentEnemies++;
				enemyOnStage.Push(newEnemyLoop);
			}
		}else if(_spawnInterval <= 2f){
			var randomSpawnPoint : Transform;
			var randomEnemy : GameObject;
			var newEnemy : GameObject;
			randomSpawnPoint = spawnPoints[Random.Range(0, (spawnPoints.Length - 1))];
			randomEnemy = enemyToSpawn[Random.Range(0, (enemyToSpawn.Length - 1))];
			newEnemy = Instantiate(randomEnemy, randomSpawnPoint.position, randomSpawnPoint.rotation) as GameObject;
			currentEnemies++;
			enemyOnStage.Push(newEnemy);
		}
	}
	
	
	function spawnBoss(){
		var randomSpawnPoint : Transform;
		var randomEnemy : GameObject;
		var randomBoss : GameObject;
		if(waveCount >= 3){
			var newBoss : GameObject;
			randomSpawnPoint = spawnPoints[Random.Range(0, spawnPoints.Length)];
			randomBoss = bossToSpawn[Random.Range(0, bossToSpawn.Length)];
			newBoss = Instantiate(randomBoss, randomSpawnPoint.position, randomSpawnPoint.rotation) as GameObject;
			currentBoss++;
			bossOnStage.Push(newBoss);
		}else{
			return;
		}
	}
}
