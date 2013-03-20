/**
 * @author sole / http://soledadpenades.com
 * @author mrdoob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 * @author endel / http://endel.me
 */

#TWEEN = TWEEN or ( () -> )
 
 class TWEENclass
 	constructor: () ->
 	getAll: () ->
 		return -tweens
 	removeAll: () ->
 		_tweens = []
 	add: (tween) ->
 		_tweens.push( #{tween} )
 	remove: (tween) ->
 		i = _tweens.indexOf tween
 		if i isnt -1 then _tweens.splice( i, 1 );
 	update: (time) ->
 		if _tweens.length is 0 then return false;
 		i=0
 		numTweens = _tweens.length
 		#time = time !== undefined ? time : ( window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
 		while i < numTweens
 			if _tweens[ i ].update( time )
 				i++
 			else
 				_tweens.splice( i, 1 )
 				numTweens --
 		return true;

TWEEN.Tween = (object) ->
	_object = object;
	_valuesStart = {};
	_valuesEnd = {};
	_valuesStartRepeat = {};
	_duration = 1000;
	_repeat = 0;
	_delayTime = 0;
	_startTime = null;
	_easingFunction = TWEEN.Easing.Linear.None;
	_interpolationFunction = TWEEN.Interpolation.Linear;
	_chainedTweens = [];
	_onStartCallback = null;
	_onStartCallbackFired = false;
	_onUpdateCallback = null;
	_onCompleteCallback = null;

	for field of obejct
		_valuesStart[ field ] = parseFloat(object[ field ], 10) 

	this.to = (properties, duration) ->
		_duration = duration if duration isnt undefined
		_valuesEnd = properties;
		return this

	this.start = (time) ->
		TWEEN.add this
		_onStartCallbackFired = false
		_startTime = if time isnt undefined then time else ( if window.performance isnt undefined and window.performance.now isnt undefined then window.performance.now() else Date.now() )
		_startTime += _delayTime;

		for proptery of _valuesEnd
			if _valuesEnd[ property ] instanceof Array

				if _valuesEnd[ property ].length is 0 
					continue

				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] )

			_valuesStart[ property ] = _object[ property ];

			if ( _valuesStart[ property ] instanceof Array ) is false
				_valuesStart[ property ] *= 1.0

			_valuesStartRepeat[ property ] = _valuesStart[ property ] or 0

		return this

	this.stop = () ->
		TWEEN.remove this 
		return this

	this.delay = (amount) ->
		_delayTime = amount
		return this

	this.repeat = (time) ->
		_repeat = times
		return this

	this.easing = (easing) ->
		_reasingFunction = easing;
		return this;

	this.interpolation = (interpolation) ->
		_interpolationFunction = interpolation;
		return this;

	this.chain = () ->
		_chainedTweens = arguments
		return this

	this.onStart = ( callback ) ->
		_onStartCallback = callback
		return this

	this.onUpdate = ( callback ) ->
		_onUpdateCallback = callback
		return this

	this.onComplete = ( callback ) ->
		_onCompleteCallback = callback
		return this

	this.update = (time) ->
		if time < _startTime then return true
		if _onStartCallbackFired  is false
			if _onStartCallback isnt null
				_onStartCallback.call _object 
			_onStartCallbackFired = true

		elapsed = ( time - _startTime ) / _duration
		elapsed if elapsed > 1 then 1 else elapsed;

		value = _easingFunction elapsed

		for property of _valuesEnd
			start= _valuesStart[ property ] || 0
			end = _valuesEnd[ property ]

			if end instanceof Array
				_object[ property ] = _interpolationFunction end, value 
			else
				if typeof end is "string" then end = start + parseFloat end, 10
				_object[ property ] = start + ( end - start ) * value

		if _onUpdateCallback isnt null then _onUpdateCallback.call _object, value

		if elapsed is 1
			if _repeat > 0
				if isFinite _repeat then _repeat--

				for property of _valuesStartRepeat
					if typeof _valuesEnd[ property ] is "string"
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat _valuesEnd[ property ], 10
					
					_valuesStart[ property ] = _valuesStartRepeat[ property ]

				_startTime = time + _delayTime
				return true
			else
				if _onCompleteCallback isnt null then _onCompleteCallback.call _object 

				for i in [0.._chainedTweens.length]
					_chainedTweens[ i ].start time 

				return false
				
		return true

TWEEN.Easing =
	Linear: 
		None: (k) -> return k
	Quadratic: 
		In: (k) -> return k*k
		Out: (k) -> return k*(2-k)
		InOut: (k) -> if (k*=2) < 1) then return 0.5 * k * k else - 0.5 * ( --k * ( k - 2 ) - 1 )
	Cubic:
		In: (k) -> return k * k * k
		Out: (k) -> return --k * k * k + 1
		InOut: (k) -> if (k*=2) < 1) then return 0.5 * k * k * k else return 0.5 * ( ( k -= 2 ) * k * k + 2 )
	Quartic:
		In: (k) -> return k * k * k * k
		Out: (k) ->	return 1 - ( --k * k * k * k )
		InOut: (k) -> if ( ( k *= 2 ) < 1) then return 0.5 * k * k * k * k else return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 )
	Quintic:
		In: (k) -> return k * k * k * k * k
		Out: (k) ->	return --k * k * k * k * k + 1
		InOut: (k) -> if ( ( k *= 2 ) < 1 ) then return 0.5 * k * k * k * k * k else return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 )
	Sinusoidal:
		In: (k) -> return 1 - Math.cos k*Math.PI/2
		Out: (k) ->	return Math.sin k*Math.PI/2 		
		InOut: (k) -> return 0.5*( 1-Math.cos Math.PI*k )
	Exponential: 
		In: (k) -> return if k is 0 then 0 else Math.pow 1024, k - 1 
		Out: (k) ->	return if k is 1 then 1 else 1 - Math.pow 2, - 10 * k 
		InOut: (k) ->
			if ( k is 0 ) return 0
			if ( k is 1 ) return 1
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow 1024, k - 1 
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 )
	Circular:
		In: (k) -> return 1 - Math.sqrt 1-k*k
		Out: (k) ->	return Math.sqrt 1-(--k*k)
		InOut: (k) -> if ( k *= 2 ) < 1 then return - 0.5 * ( Math.sqrt( 1 - k * k) - 1) else return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
	Elastic:
		In: (k) ->
			a = 0.1
			p = 0.4
			if k is 0 then return 0;
			if k is 1 then return 1;
			if not a or a < 1
				a = 1
				s = p / 4
			else 
				s = p * Math.asin( 1 / a ) / ( 2 * Math.PI )

			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) )

		Out: (k) ->
			a = 0.1
			p = 0.4
			if k is 0 then return 0;
			if k is 1 then return 1;
			if not a or a < 1
				a = 1
				s = p / 4
			else 
				s = p * Math.asin( 1 / a ) / ( 2 * Math.PI )

			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 )

		InOut(k) ->
			a = 0.1
			p = 0.4
			if k is 0 then return 0;
			if k is 1 then return 1;
			if not a or a < 1
				a = 1
				s = p / 4
			else 
				s = p * Math.asin( 1 / a ) / ( 2 * Math.PI )

			if ( k *= 2 ) < 1  
				return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) )
			
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1
	Back:
		In: (k) ->
			s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s )
		Out: (k) ->
			s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1
		InOut: (k) ->
			s = 1.70158 * 1.525;
			if ( k *= 2 ) < 1 then return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) ) else return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 )
	Bounce: 
		In: (k) -> return 1 - TWEEN.Easing.Bounce.Out( 1 - k )
		Out: (k) ->
			if k < ( 1 / 2.75 )
				return 7.5625 * k * kz
			else if ( k < ( 2 / 2.75 ) )
				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75
			else if ( k < ( 2.5 / 2.75 ) )
				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375
			else
				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375

		InOut: (k) ->
			if k < 0.5 then return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5 else return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5

TWEEN.Interpolation = 