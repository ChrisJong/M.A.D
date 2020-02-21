#pragma strict

public class upgradeHUD extends MonoBehaviour {
	
	public static var instance : upgradeHUD;
	public var myInformation : informationHolder;
	public var mySkin : GUISkin;
	
	public enum menuItem {
		nothing,
		player = 0,
		weapon = 1,
		turret = 2
	}
	public var menuState : menuItem = menuItem.player;
	public var menuText : String = "Player";
	
	private var _screenWidth : float = 0f;
	private var _screenHeight : float = 0f;
	private var _halfSW : float = 0f;
	private var _halfSH : float = 0f;
	
	// Prices
	private var _priceIncrease : float = 1.5f;
	
	// Prices (Player).
	private var _healthCost : int = 300f;
	private var _defenseCost : int = 300f;
	
	// Prices (Weapon).
	private var _nFireRateCost : int = 300f;
	private var _nDamageCost : int = 300f;
	private var _nSpeedCost : int = 300f;
	
	private var _rFireRateCost : int = 300f;
	private var _rDamageCost : int = 400f;
	private var _rSpeedCost : int = 300f;
	private var _rAOECost : int = 400f;
	
	private var _sFireRateCost : int = 300f;
	private var _sDamageCost : int = 300f;
	private var _sSpeedCost : int = 300f;
	
	// Prices (Turret).
	private var _tFireRate : int = 500f;
	private var _tDamageCost : int = 500f;
	private var _tRangeCost : int = 500f;
	private var _tRotationCost : int = 500f;

	private var _tTwoFireRate : int = 500f;
	private var _tTwoDamageCost : int = 500f;
	private var _tTwoRangeCost : int = 500f;
	private var _tTwoRotationCost : int = 500f;
	
	
	private static var _layout : Rect = Rect(0,0,0,0);
	private static var _layoutOffsetY : float = 50f;
	private static var _layoutWidth : float = 800f;
	private static var _layoutHeight: float = 400f;
	private static var _halfLW : float = _layoutWidth * 0.5f;
	private static var _halfLH : float = _layoutHeight * 0.5f;
	
	private static var _menuLayout : Rect = Rect(0,0,0,0);
	private static var _menuWidth : float = 750f;
	private static var _menuHeight : float = 350f;
	private static var _halfMW : float = _menuWidth * 0.5f;
	private static var _halfMH : float = _menuHeight * 0.5f;
	private static var _menuPadding : float = 5.25f;
	
	private static var _navLayout : Rect = Rect(0,0,0,0);
	private static var _navWidth : float = _menuWidth;
	private static var _navHeight : float = 40f;
	private static var _halfNW : float = _navWidth * 0.5f;
	private static var _halfNH : float = _navHeight * 0.5f;
	
	private static var _navButtonWidth : float = 100f;
	private static var _navButtonHeight: float = 30f;
	private static var _navButtonOffset : float = 10f;
	
	function Awake(){
		instance = this;
		_screenWidth = Screen.width;
		_screenHeight = Screen.height;
		_halfSW = _screenWidth * 0.5f;
		_halfSH = _screenHeight * 0.5f;
		_layout = new Rect(_halfSW - _halfLW,(_halfSH - _halfLH) - _layoutOffsetY, _layoutWidth, _layoutHeight);
		_navLayout = new Rect(_halfSW - _halfNW,(_halfSH + _halfLH) - _layoutOffsetY,_navWidth, _navHeight);
		_menuLayout = new Rect(_halfLW - _halfMW, _halfLH - _halfMH, _menuWidth, _menuHeight);
	}
	
	public function OnGUI(){
		GUI.skin = mySkin;
		if(waveSystem.instance.state == waveSystem.instance.waveState.waveEnd){
			waveEnd();
		}else if(waveSystem.instance.safeEnabled && waveSystem.instance.isWaveEnd){
			GUI.Box(Rect(_layout),"Upgrade Menu - " + menuText.ToString(), "menuWindow");
			GUILayout.BeginArea(Rect(_layout));
				upgrade();
			GUILayout.EndArea();
			GUILayout.BeginArea(Rect(_navLayout));
				button();
			GUILayout.EndArea();
		}else{
			return;
		}
	}
	
	function waveEnd(){
		if(GUI.Button(Rect((_halfSW - 75), (_halfSH - 25) - 35, 150, 50), "Upgrade & Continue")){
			waveSystem.instance.safeEnabled = true;
			waveSystem.instance.state = waveSystem.instance.waveState.idle;
		}
		if(GUI.Button(Rect((_halfSW - 50), (_halfSH - 25) + 35, 100, 50), "Risk")){
			waveSystem.instance.riskEnabled = true;
			waveSystem.instance.state = waveSystem.instance.waveState.idle;
		}
	}
	
	private function button(){
		if(GUI.Button(Rect(0 + _navButtonOffset, 0, _navButtonWidth, _navButtonHeight), "Player")){
			menuState = menuItem.player;
			menuText = "Player";
		}
		if(GUI.Button(Rect(100 + _navButtonOffset, 0, _navButtonWidth, _navButtonHeight), "Weapon")){
			menuState = menuItem.weapon;
			menuText = "Weapons";
		}
		if(GUI.Button(Rect(200 + _navButtonOffset, 0, _navButtonWidth, _navButtonHeight), "Turret")){
			menuState = menuItem.turret;
			menuText = "Turrets";
		}
		if(GUI.Button(Rect((_navWidth - _navButtonWidth) - _navButtonOffset, 0, _navButtonWidth, _navButtonHeight), "Exit")){
			waveSystem.instance.state = waveSystem.instance.waveState.init;
			waveSystem.instance.safeEnabled = false;
		}
	}
	
	private function upgrade(){
		GUILayout.BeginArea(Rect(_menuLayout));
			switch(menuState){
				case menuItem.player:
					menuPlayer();
				break;
				
				case menuItem.weapon:
					menuWeapon();
				break;
				
				case menuItem.turret:
					menuTurret();
				break;
			}
		GUILayout.EndArea();
	}
	
	private function menuPlayer(){
		GUI.Label(Rect(0,0 + _menuPadding,300,30),"Increase Max HP: " + myInformation.maxHP + " (+" + 20 + ")");
		if(mainPlayerStatus.instance.playerMoney >= _healthCost && myInformation.maxHP < myInformation.maxHPLimit){
			if(GUI.Button(Rect(250,0 + _menuPadding,80,25),"$" + _healthCost.ToString())){
				mainPlayerStatus.instance.curHP += 20f;
				myInformation.maxHP += 20f;
				mainPlayerStatus.instance.playerMoney -= _healthCost;
				_healthCost *= _priceIncrease;
				hudMoney.instance.updateMoney();
			}
		}
		
		if(mainPlayerStatus.instance.turretEnabled){
			GUI.Label(Rect(0,30 + _menuPadding,300,30),"Increase Defense Points: " + myInformation.maxDefensePoint  + " (+" + 20 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _defenseCost && myInformation.maxDefensePoint < myInformation.maxDefensePointLimit){
				if(GUI.Button(Rect(250,30 + _menuPadding,80,25),"$" + _defenseCost.ToString())){
					myInformation.maxDefensePoint += 20f;
					mainPlayerStatus.instance.playerMoney -= _defenseCost;
					_defenseCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
		}else{
			GUI.Label(Rect(0,30 + _menuPadding,300,30),"Increase Defense Points: N/A");
		}
		
		GUI.Label(Rect(0,60 + _menuPadding,300,30),"Heal Current HP: " + mainPlayerStatus.instance.curHP + " (+" + 40 + ")");
		if(mainPlayerStatus.instance.playerMoney >= 200 && mainPlayerStatus.instance.curHP < myInformation.maxHP){
			if(GUI.Button(Rect(250,60 + _menuPadding,80,25),"$" + 200)){
				mainPlayerStatus.instance.curHP += 40f;
				mainPlayerStatus.instance.playerMoney -= 200;
				hudMoney.instance.updateMoney();
			}
		}
		
	}
	
	private function menuWeapon(){
		GUI.Label(Rect(0,0 + _menuPadding,200,30),"Normal Weapon: ");
		GUI.Label(Rect(30,30 + _menuPadding,300,30),"Decrease Fire Rate: " + myInformation.nFireRate + " (-" + 0.02 + ")");
		if(mainPlayerStatus.instance.playerMoney >= _nFireRateCost && myInformation.nFireRate > myInformation.nFireRateLimit){
			if(GUI.Button(Rect(250,30 + _menuPadding,80,25),"$" + _nFireRateCost.ToString())){
				myInformation.nFireRate -= 0.02f;
				mainPlayerStatus.instance.playerMoney -= _nFireRateCost;
				_nFireRateCost *= _priceIncrease;
				hudMoney.instance.updateMoney();
			}
		}
		
		GUI.Label(Rect(30,60 + _menuPadding,300,30),"Increase Bullet Damage: " + myInformation.nDamage + " (+" + 5 + ")");
		if(mainPlayerStatus.instance.playerMoney >= _nDamageCost && myInformation.nDamage < myInformation.nDamageLimit){
			if(GUI.Button(Rect(250,60 + _menuPadding,80,25),"$" + _nDamageCost.ToString())){
				myInformation.nDamage += 5f;
				weapon.instance.pNormalDamage = myInformation.nDamage;
				mainPlayerStatus.instance.playerMoney -= _nDamageCost;
				_nDamageCost *= _priceIncrease;
				hudMoney.instance.updateMoney();
			}
		}
		
		GUI.Label(Rect(30,90 + _menuPadding,300,30),"Increase Bullet Speed: " + myInformation.nSpeed + " (+" + 10 + ")");
		if(mainPlayerStatus.instance.playerMoney >= _nSpeedCost && myInformation.nSpeed < myInformation.nSpeedLimit){
			if(GUI.Button(Rect(250,90 + _menuPadding,80,25),"$" + _nSpeedCost.ToString())){
				myInformation.nSpeed += 10f;
				mainPlayerStatus.instance.playerMoney -= _nSpeedCost;
				_nSpeedCost *= _priceIncrease;
				hudMoney.instance.updateMoney();
			}
		}
		
		GUI.Label(Rect(400, 0 + _menuPadding, 200, 30),"Shotgun: ");
		if(!weapon.instance.shotgunEnabled && mainPlayerStatus.instance.playerMoney >= 200){
			if(GUI.Button(Rect(480, 0, 80, 30),"Buy $200") && mainPlayerStatus.instance.playerMoney >= 200){
				weapon.instance.shotgunEnabled = true;
				pickUpSpawn.instance.pickUpObjects[5] = Resources.Load("pickUpShotgunAmmo") as GameObject;
				mainPlayerStatus.instance.playerMoney -= 200f;
				hudMoney.instance.updateMoney();
			}
		}else if(weapon.instance.shotgunEnabled){
			GUI.Label(Rect(480, 0 + _menuPadding, 200, 30), "Shotgun Brought");
			
			GUI.Label(Rect(430, 30 + _menuPadding, 300, 30), "Decrease Fire Rate: " + myInformation.sFireRate + " (-" + 0.05 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _sFireRateCost && myInformation.sFireRate > myInformation.sFireRateLimit){
				if(GUI.Button(Rect(650, 30 + _menuPadding, 80,25),"$" + _sFireRateCost.ToString())){
					myInformation.sFireRate -= 0.05f;
					mainPlayerStatus.instance.playerMoney -= _sFireRateCost;
					_sFireRateCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			
			GUI.Label(Rect(430, 60 + _menuPadding, 300, 30), "Increase Shotgun Damage: " + myInformation.sDamage + " (+" + 5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _sDamageCost && myInformation.sDamage < myInformation.sDamageLimit){
				if(GUI.Button(Rect(650, 60 + _menuPadding, 80,25),"$" + _sDamageCost.ToString())){
					myInformation.sDamage += 5f;
					weapon.instance.pShotgunDamage = myInformation.sDamage;
					mainPlayerStatus.instance.playerMoney -= _sDamageCost;
					_sDamageCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			
			GUI.Label(Rect(430, 90 + _menuPadding, 300, 30), "Increase Shotgun Speed: " + myInformation.sSpeed + " (+" + 10 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _sSpeedCost && myInformation.sSpeed < myInformation.sSpeedLimit){
				if(GUI.Button(Rect(650, 90 + _menuPadding, 80,25),"$" + _sSpeedCost.ToString())){
					myInformation.sSpeed += 10f;
					mainPlayerStatus.instance.playerMoney -= _sSpeedCost;
					_sSpeedCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			
			GUI.Label(Rect(430, 120 + _menuPadding, 300, 30), "Buy Ammo: (Shotgun Left: " + weapon.instance.shotgunLeft + ")");
			if(mainPlayerStatus.instance.playerMoney >= 200){
				if(GUI.Button(Rect(650, 120 + _menuPadding, 100,25),"+10 For $200")){
					weapon.instance.shotgunLeft += 10f;
					mainPlayerStatus.instance.playerMoney -= 200f;
					hudMoney.instance.updateMoney();
				}
			}
		}
		
		GUI.Label(Rect(0,150 + _menuPadding,300,30),"Rocket Launcher: ");
		if(!weapon.instance.rocketEnabled && mainPlayerStatus.instance.playerMoney >= 200){
			if(GUI.Button(Rect(130,150,80,30),"Buy $200") && mainPlayerStatus.instance.playerMoney >= 200){
				weapon.instance.rocketEnabled = true;
				pickUpSpawn.instance.pickUpObjects[4] = Resources.Load("pickUpRocketAmmo") as GameObject;
				mainPlayerStatus.instance.playerMoney -= 200f;
				hudMoney.instance.updateMoney();
			}		
		}else if(weapon.instance.rocketEnabled){
			GUI.Label(Rect(130,150 + _menuPadding,200,30),"Rocket Launcher Brought");
			
			GUI.Label(Rect(30,180 + _menuPadding,300,30),"Decrease Fire Rate: " + myInformation.rFireRate + " (-" + 0.05 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _rFireRateCost && myInformation.rFireRate > myInformation.rFireRateLimit){
				if(GUI.Button(Rect(250,180 + _menuPadding,80,25),"$" + _rFireRateCost.ToString())){
					myInformation.rFireRate -= 0.05f;
					mainPlayerStatus.instance.playerMoney -= _rFireRateCost;
					_rFireRateCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			
			GUI.Label(Rect(30,210 + _menuPadding,300,30),"Increase Rocket Damage: " + myInformation.rDamage + " (+" + 2.5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _rDamageCost && myInformation.rDamage < myInformation.rDamageLimit){
				if(GUI.Button(Rect(250,210 + _menuPadding,80,25),"$" + _rDamageCost.ToString())){
					myInformation.rDamage += 2.5f;
					weapon.instance.pRocketDamage = myInformation.rDamage;
					mainPlayerStatus.instance.playerMoney -= _rDamageCost;
					_rDamageCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			
			GUI.Label(Rect(30,240 + _menuPadding,300,30),"Increase Rocket Speed: " + myInformation.rSpeed + " (+" + 10 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _rSpeedCost && myInformation.rSpeed < myInformation.rSpeedLimit){
				if(GUI.Button(Rect(250,240 + _menuPadding,80,25),"$" + _rSpeedCost.ToString())){
					myInformation.rSpeed += 10f;
					mainPlayerStatus.instance.playerMoney -= _rSpeedCost;
					_rSpeedCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			
			GUI.Label(Rect(30,270 + _menuPadding,300,30),"Increase Rocket AOE: " + myInformation.rAOE + " (+" + 2.5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _rAOECost && myInformation.rAOE < myInformation.rAOELimit){
				if(GUI.Button(Rect(250,270 + _menuPadding,80,25),"$" + _rAOECost.ToString())){
					myInformation.rAOE += 2.5f;
					mainPlayerStatus.instance.playerMoney -= _rAOECost;
					_rAOECost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			GUI.Label(Rect(30,300 + _menuPadding,300,30),"Buy Ammo: (Rockets Left: " + weapon.instance.rocketLeft + ")");
			if(mainPlayerStatus.instance.playerMoney >= 200){
				if(GUI.Button(Rect(250,300 + _menuPadding,100,25),"+10 For $200")){
					weapon.instance.rocketLeft += 10f;
					mainPlayerStatus.instance.playerMoney -= 200f;
					hudMoney.instance.updateMoney();
				}
			}
		}
	}
	
	private function menuTurret(){
		GUI.Label(Rect(0,0 + _menuPadding,200,30), "Turret Level 1: ");
		if(!mainPlayerStatus.instance.turretEnabled && mainPlayerStatus.instance.playerMoney >= 1000){
			if(GUI.Button(Rect(130,0,80,30),"Buy $1000") && mainPlayerStatus.instance.playerMoney >= 1000){
				mainPlayerStatus.instance.turretEnabled = true;
				mainPlayerStatus.instance.playerMoney -= 1000f;
				hudMoney.instance.updateMoney();
				mainPlayerController.instance.currentNumber = 0; 
			}
		}else if(mainPlayerStatus.instance.turretEnabled){
			GUI.Label(Rect(130,0 + _menuPadding,300,30),"Turret Level 1 Brought");
			GUI.Label(Rect(30,30,200,30), "Increase Turret Damage: " + myInformation.tOneBulletDamge + " (+" + 5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tDamageCost && myInformation.tOneBulletDamge < myInformation.tOneBulletDamgeLimit){
				if(GUI.Button(Rect(300,25 + _menuPadding,80,25),"$" + _tDamageCost.ToString())){
					myInformation.tOneBulletDamge += 5f;
					mainPlayerStatus.instance.playerMoney -= _tDamageCost;
					_tDamageCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			GUI.Label(Rect(30,60,300,30), "Increase Turret Range: " + myInformation.tOneRadius + " (+" + 2 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tRangeCost && myInformation.tOneRadius < myInformation.tOneRadiusLimit){
				if(GUI.Button(Rect(300,55 + _menuPadding,80,25),"$" + _tRangeCost.ToString())){
					myInformation.tOneRadius += 2f;
					myInformation.tOneRange += 2f;
					mainPlayerStatus.instance.playerMoney -= _tRangeCost;
					_tRangeCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			GUI.Label(Rect(30,90,300,30), "Increase Turret Attack Speed: " + myInformation.tOneBulletSpeed + " (+" + 2.5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tFireRate && myInformation.tOneBulletSpeed < myInformation.tOneBulletSpeedLimit){
				if(GUI.Button(Rect(300,85 + _menuPadding,80,25),"$" + _tFireRate.ToString())){
					myInformation.tOneBulletSpeed += 2.5f;
					mainPlayerStatus.instance.playerMoney -= _tFireRate;
					_tFireRate *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			GUI.Label(Rect(30,120,300,30), "Increase Turret Rotation Speed: " + myInformation.tOneRotateSpeed + " (+" + 0.5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tRotationCost && myInformation.tOneRotateSpeed < myInformation.tOneRotateSpeedLimit){
				if(GUI.Button(Rect(300,115 + _menuPadding,80,25),"$" + _tRotationCost.ToString())){
					myInformation.tOneRotateSpeed += 0.5f;
					mainPlayerStatus.instance.playerMoney -= _tRotationCost;
					_tRotationCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
		}
		
		GUI.Label(Rect(0,180 + _menuPadding,200,30), "Turret Level 2: ");
		if(!mainPlayerStatus.instance.turretTwoEnabled && mainPlayerStatus.instance.playerMoney >= 1000){
			if(GUI.Button(Rect(130,180,80,30),"Buy $1000") && mainPlayerStatus.instance.playerMoney >= 1000){
				mainPlayerStatus.instance.turretTwoEnabled = true;
				mainPlayerStatus.instance.playerMoney -= 1000f;
				hudMoney.instance.updateMoney();
				mainPlayerController.instance.currentNumber = 1; 
			}
		}else if(mainPlayerStatus.instance.turretTwoEnabled){
			GUI.Label(Rect(130,180 + _menuPadding,300,30),"Turret Level 2 Brought");
			GUI.Label(Rect(30,210,300,30), "Increase Turret Damage: " + myInformation.tTwoBulletDamge + " (+" + 5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tTwoDamageCost && myInformation.tTwoBulletDamge < myInformation.tTwoBulletDamgeLimit){
				if(GUI.Button(Rect(300,205 + _menuPadding,100,25),"$" + _tTwoDamageCost.ToString())){
					myInformation.tTwoBulletDamge += 5f;
					mainPlayerStatus.instance.playerMoney -= _tTwoDamageCost;
					_tTwoDamageCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			GUI.Label(Rect(30,240,300,30), "Increase Turret Range: " + myInformation.tTwoRadius + " (+" + 2 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tTwoRangeCost && myInformation.tTwoRadius < myInformation.tTwoRadiusLimit){
				if(GUI.Button(Rect(300,235 + _menuPadding,100,25),"$" + _tTwoRangeCost.ToString())){
					myInformation.tTwoRadius += 2f;
					myInformation.tTwoRange += 2f;
					mainPlayerStatus.instance.playerMoney -= _tTwoRangeCost;
					_tTwoRangeCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			GUI.Label(Rect(30,270,300,30), "Increase Turret Attack Speed: " + myInformation.tTwoBulletSpeed + " (+" + 2.5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tTwoFireRate && myInformation.tTwoBulletSpeed < myInformation.tTwoBulletSpeedLimit){
				if(GUI.Button(Rect(300,265 + _menuPadding,100,25),"$" + _tTwoFireRate.ToString())){
					myInformation.tTwoBulletSpeed += 2.5f;
					mainPlayerStatus.instance.playerMoney -= _tTwoFireRate;
					_tTwoFireRate *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
			GUI.Label(Rect(30,300,300,30), "Increase Turret Rotation Speed: " + myInformation.tTwoRotateSpeed + " (+" + 0.5 + ")");
			if(mainPlayerStatus.instance.playerMoney >= _tTwoRotationCost && myInformation.tTwoRotateSpeed < myInformation.tTwoRotateSpeedLimit){
				if(GUI.Button(Rect(300,295 + _menuPadding,100,25),"$" + _tTwoRotationCost.ToString())){
					myInformation.tTwoRotateSpeed += 0.5f;
					mainPlayerStatus.instance.playerMoney -= _tTwoRotationCost;
					_tTwoRotationCost *= _priceIncrease;
					hudMoney.instance.updateMoney();
				}
			}
		}
		GUI.Label(Rect(30,335,650,30), "Note: None of these upgrades will take affect on turrets already out on the field. You have to sell and rebuild.");
	}
}