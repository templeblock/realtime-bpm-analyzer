'use strict';

/**
 * Function container
 * @type {Object}
 */

const utils = {};



/**
 * Loop between .9 and .3 to check peak for each thresolds
 * @param  {Function} onLoop   Function for each iteration
 * @param  {Function} callback Function executed at the end
 * @return {Mixed}             Return of 'callback' function
 */

utils.loopOnThresolds = (onLoop, minValidThresold, callback) => {

  /**
   * Top starting value to check peaks
   */

  let thresold = 0.95;

  /**
   * Minimum value to check peaks
   */

  if (typeof minValidThresold == 'function' 
   || typeof minValidThresold == 'undefined') {

    callback = minValidThresold || callback;

    minValidThresold = 0.30;
  
  }

  /**
   * Optionnal object to store data
   */

  let object = {};

  /**
   * Loop between 0.90 and 0.30 (theoretically it is 0.90 but it is 0.899999, due because of float manipulation)
   */

  do {
    let stop = false;
    thresold -= 0.05;
    onLoop && onLoop(object, thresold, (bool) => {
      stop = bool;
    });
    if (stop) break;
  } while (thresold > minValidThresold);

  /**
   * Ended callback
   */
  return callback && callback(object);
}



/**
 * Real clone an object
 * @param  {Object} object Contain an object without recusive entries.
 * @return {Object}        Cloned object
 */

utils.clone = (object) => {

  /**
   * Use JSON to duplicate a Javascript Object
   */

  return JSON.parse(JSON.stringify(object));

};



/**
 * Generate an object with each keys (thresolds) with a defaultValue
 * @param  {Mixed}  defaultValue Contain the înitial value for each thresolds
 * @return {Object}              Object with thresolds key initialized with a defaultValue
 */

utils.generateObjectModel = (defaultValue, callback) => {

  /**
   * Loop on thresolds to build an object with thresolds keys and valued with the defaultValue
   */

  return utils.loopOnThresolds((object, thresold) => {

    /**
     * Add the thresold as key and clone the defaultValue to not assign the same object id.
     */

    object[thresold.toString()] = utils.clone(defaultValue);

  }, (object) => {

    /**
     * Return a callback or the object (asyn|sync)
     */

    return callback && callback(utils.clone(object)) || object;

  });
}



/**
 * Export utils function container
 */

module.exports = utils;