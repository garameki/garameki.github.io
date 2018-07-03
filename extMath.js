extMath=null;// This is dummy. Because there is not 'extMath' object.
libFileRelationship.create('extMath');

Math.normalize8 = function(num){
	return num/0xFF;
};
Math.normalize24 = function(num){
	return num/0xFFFFFF;
};
Math.createGaussianDistribution = function(mu,sigma){
	const s1 = 1/sigma;
	const ss = s1*s1*0.5;
	const s2 = s1*0.398942;
	return function(xx){
		const p = (mu - xx) * (xx - mu) * ss;
		const ans = Math.exp(p)*s2;
		return ans;
	};
};

