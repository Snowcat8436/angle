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

		for(proptery of _valuesEnd)
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