#pragma strict

public class rocketExplosion extends MonoBehaviour {
	
	public var myInformation : informationHolder;
	
	public var layerMask : LayerMask;
	
	private var _explosionRadius : float = 10f;
	private var _explosionPower : float = 150f;
	private var _explosionDamage : float = 10f;
	private var _explosionTimeout : float = 2f;
	
	private var particle : ParticleEmitter;
	
	function Awake(){
		_explosionRadius = myInformation.rAOE;
		_explosionDamage = myInformation.rDamage * 0.3f;
		particle = GetComponentInChildren(ParticleEmitter) as ParticleEmitter;
	}
	
	function Start(){
		var explosionPosition : Vector3 = transform.position;
	
		// Apply damage to close by objects first
		var colliders : Collider[] = Physics.OverlapSphere(explosionPosition, _explosionRadius, layerMask);
		for(var hit in colliders){
			// Calculate distance from the explosion position to the closest point on the collider
			var closestPoint : Vector3 = hit.ClosestPointOnBounds(explosionPosition);
			var distance : float = Vector3.Distance(closestPoint, explosionPosition);
	
			// The hit points we apply fall decrease with distance from the explosion point
			var hitPoints : float = 1.0 - Mathf.Clamp01(distance / _explosionRadius);
			hitPoints *= _explosionDamage;
	
			// Tell the rigidbody or any other script attached to the hit object how much damage is to be applied!
			hit.SendMessageUpwards("applyDamage", hitPoints, SendMessageOptions.DontRequireReceiver);
		}
	
		// Apply explosion forces to all rigidbodies
		// This needs to be in two steps for ragdolls to work correctly.
		colliders = Physics.OverlapSphere(explosionPosition, _explosionRadius, layerMask);
		for(var hit in colliders){
			if (hit.tag == "enemy"){
				hit.rigidbody.AddExplosionForce(_explosionPower, explosionPosition, _explosionRadius, 3f);
			}
		}
		
		// stop emitting particles
		if(particle.emit == true){
			yield WaitForSeconds(0.5);
			particle.minEmission = 0;
			particle.maxEmission = 0;
			yield WaitForSeconds(2);
			particle.emit = false;
	    }
		
	    // destroy the explosion after a while
		Destroy(gameObject, _explosionTimeout);
		
	}

}