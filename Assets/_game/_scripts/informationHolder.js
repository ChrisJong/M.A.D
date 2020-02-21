#pragma strict

public static class informationHolder {

	// --- Main Player Information ---
	public var maxHP : int = 100;
	public var minHP : int = 0;
	public var maxHPLimit : int = 300;
	
	public var forwardSpeed : float = 10f;
	public var backwardSpeed : float = 5f;
	public var strafeSpeed : float = 5f;
	public var jumpSpeed : float = 8f;
	public var slideSpeed : float = 10f;
	
	public var maxDefensePoint : int = 30;
	public var minDefensePoint : int = 0;
	public var maxDefensePointLimit : int = 150f;
	
	public var minMoney : int = 0;
	
	// -- Weapons --
	//Normal.
	public var nDamage : float = 10f;
	public var nSpeed : float = 350f;
	public var nFireRate : float = 0.2f;
	public var nFireRateLimit : float = 0.04f;
	public var nSpeedLimit : float = 600f;
	public var nDamageLimit : float = 150f;
	
	//Rocket.
	public var rSpeed : float = 200f;
	public var rDamage : float = 5f;
	public var rAOE : float = 10f;
	public var rFireRate : float = 0.7f;
	public var rFireRateLimit : float = 0.3f;
	public var rDamageLimit : float = 30f;
	public var rSpeedLimit : float = 400f;
	public var rAOELimit : float = 30f;
	
	//Shotgun.
	public var sSpeed : float = 300f;
	public var sDamage : float = 3f;
	public var sSpreadMin : float = 1f;
	public var sSpreadMax : float = 15f;
	public var sFireRate : float = 0.5f;
	public var sFireRateLimit : float = 0.2f;
	public var sDamageLimit : float = 40f;
	public var sSpeedLimit : float = 500f;
	public var sSpreedMinLimit : float = 5f;
	
	// -- Turrets --
	//Turret One.
	public var tOneBulletDamge : float = 2f;
	public var tOneBulletSpeed : float = 100f;
	public var tOneRadius : float = 12f;
	public var tOneRange : float = 10f;
	public var tOneRotateSpeed : float = 2f;
	public var turretOneFireRate : float = 7f;
	public var tOneBulletDamgeLimit : float = 30f;
	public var tOneBulletSpeedLimit : float = 300f;
	public var tOneRadiusLimit : float = 32f;
	public var tOneRangeLimit : float = 30f;
	public var tOneRotateSpeedLimit : float = 20f;
	
	//Two.
	public var tTwoBulletDamge : float = 2f;
	public var tTwoBulletSpeed : float = 100f;
	public var tTwoRadius : float = 12f;
	public var tTwoRange : float = 10f;
	public var tTwoRotateSpeed : float = 2f;
	public var tTwoFireRate : float = 7f;
	public var tTwoBulletDamgeLimit : float = 30f;
	public var tTwoBulletSpeedLimit : float = 300f;
	public var tTwoRadiusLimit : float = 32f;
	public var tTwoRangeLimit : float = 30f;
	public var tTwoRotateSpeedLimit : float = 20f;
	
	// -- Enemies --
	//Enemy.
	public var eMinHP : int = 30;
	public var eMaxHP : int = 40;
	public var eMoveSpeed : float = 5f;
	public var eRunSpeed : float = 15f;
	public var eRotateSpeed : float = 10f;
	public var eMeleeDamage : int = 5;
	public var eMeleeFireRate : float = 1f;
	public var eBulletDamage : int = 5;
	public var eBulletSpeed : int = 100;
	public var eBulletFireRate : float = 2f;
	
	//Boss.
	public var bMinHP : int = 500;
	public var bMaxHP : int = 1000;
	public var bMoveSpeed : float = 10f;
	public var bRunSpeed : float = 30f;
	public var bRotateSpeed : float = 10f;
	public var bBulletDamage : int = 5;
	public var bBulletSpeed : int = 100;
	public var bBulletFireRate : float = 2f;
	public var bMeleeFireRate : float = 1f;
	public var bMeleeDamage : int = 5;
	
	private function informationHolder(){
		
	}
}
