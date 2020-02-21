#pragma strict

public static class mainPlayerHelper {

	public class clipPlanePoints extends System.ValueType {
		public var upperLeft : Vector3;
		public var upperRight : Vector3;
		public var lowerLeft : Vector3;
		public var lowerRight : Vector3;
	}
	
	public function clampAngle(angle : float, min : float, max : float):float{
		
		if(angle < -360){
			angle += 360;
		}
		if(angle > 360){
			angle -= 360;
		}
		
		return Mathf.Clamp(angle,min,max);
	}
	
	public function clipPlaneAtNear(pos : Vector3):clipPlanePoints{
		var clipPlanePoints = new clipPlanePoints();
		
		if(Camera.mainCamera == null){
			return clipPlanePoints;
		}
		
		var transform = Camera.mainCamera.transform;
		var halfFOV = (Camera.mainCamera.fieldOfView / 2) * Mathf.Deg2Rad;
		var aspect = Camera.mainCamera.aspect;
		var distance = Camera.mainCamera.nearClipPlane;
		var height = distance * Mathf.Tan(halfFOV);
		var width = height * aspect;
		
		clipPlanePoints.lowerRight = pos + transform.right * width;
		clipPlanePoints.lowerRight -= transform.up * height;
		clipPlanePoints.lowerRight += transform.forward * distance;
		
		clipPlanePoints.lowerLeft = pos - transform.right * width;
		clipPlanePoints.lowerLeft -= transform.up * height;
		clipPlanePoints.lowerLeft += transform.forward * distance;
		
		clipPlanePoints.upperRight = pos + transform.right * width;
		clipPlanePoints.upperRight += transform.up * height;
		clipPlanePoints.upperRight += transform.forward * distance;
		
		clipPlanePoints.upperLeft = pos - transform.right * width;
		clipPlanePoints.upperLeft += transform.up * height;
		clipPlanePoints.upperLeft += transform.forward * distance;
		
		
		return clipPlanePoints;
	}

}
