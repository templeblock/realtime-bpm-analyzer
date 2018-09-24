'use strict';

var analyzer = require("./analyzer.js");
var utils = require("./utils.js");

/**
 * RealTimeBPMAnalyzer Class
 */
class RealTimeBPMAnalyzer {


  /**
   * Define default configuration
   * @param  {Object} config Configuration
   */

  constructor (config = {}) {

    /**
     * Default configuration
     * @type {Object}
     */

    this.options = {
      element: null,
      scriptNode: {
        bufferSize: 4096,
        numberOfInputChannels: 1,
        numberOfOutputChannels: 1
      },
      continuousAnalysis: false,
      muteAnalysisAtIntervalCount: 2000,
      computeBPMDelay: 10000,
      stabilizationTime: 20000,
      pushTime: 2000,
      pushCallback: (err, bpm) => {
        console.log('bpm', bpm);
      },
      onBpmStabilized: (thresold) => {
        this.clearValidPeaks(thresold);
      },
      webAudioAPI: {
        OfflineAudioContext: typeof window == 'object' && (window.OfflineAudioContext || window.webkitOfflineAudioContext);
      }
    }

    /**
     * Overriding default configuration
     */

    Object.assign(this.options, config);

    /**
     * Initialize variables and thresolds object's
     */

    this.initClass();
  }



  /**
   * Instentiate some vars, counter, ..
   * @return {[type]} [description]
   */

  initClass () {

    /**
     * Used to temporize the BPM computation
     */

    this.minValidThresold = 0.30;

    /**
     * Used to temporize the BPM computation
     */

    this.cumulatedPushTime = 0;

    /**
     * Used to temporize the BPM computation
     */

    this.waitPushTime = null;
    this.waitStabilization = null;

    /**
     * Contain all valid peaks
     */

    this.validPeaks = utils.generateObjectModel([]);

    /**
     * Next index (+10000 ...) to take care about peaks
     */

    this.nextIndexPeaks = utils.generateObjectModel(0);

    /**
     * Number / Position of chunks
     */

    this.chunkCount = 1;


  }


  /**
   * Remve all validPeaks between the minThresold pass in param to optimize the weight of datas
   * @param  {Float} minThresold Value between 1 and 0
   */
  clearValidPeaks (minThresold) {

    console.log('[clearValidPeaks] function: under', minThresold);

    /**
     * Set (to down) the minValidThresold to limit the recording of new peaks
     */
    
    this.minValidThresold = minThresold.toFixed(2);

    utils.loopOnThresolds((object, thresold) => {

      /**
       * Remove 'useless' datas under the minThresold.
       */

      if (thresold < minThresold) {
        delete this.validPeaks[thresold];
        delete this.nextIndexPeaks[thresold];
      }
    });
  }

  /**
   * [evaluateValidPeaks description]
   * @param  {[type]} thresold        [description]
   * @param  {[type]} channelData     [description]
   * @param  {[type]} currentMaxIndex [description]
   * @return {[type]}                 [description]
   */
  
  evaluateValidPeaks (thresold, channelData, currentMaxIndex) {

    /**
     * Compute the minimum index with all previous chunks
     * @type {integer}
     */
    const currentMinIndex = currentMaxIndex - this.options.scriptNode.bufferSize;

    /**
     * Are we authorized to detect a peak at this chunk ?
     */

    if (this.nextIndexPeaks[thresold] < currentMaxIndex) {

      /**
       * Get the offset on the current chunk datas
       */

      const offsetForNextPeak = this.nextIndexPeaks[thresold] % 4096; // 0 - 4095

      analyzer.findPeaksAtThresold(channelData, thresold, offsetForNextPeak, (peaks, atThresold) => {
        
        /**
         * Test if we have detected peaks
         */

        if (typeof(peaks) != 'undefined' && peaks != undefined) {
          Object.keys(peaks).forEach((key) => {
            if (typeof peaks[key] != 'undefined') {

              /**
               * Add if the 'relative' index peak to the validPeaks Object and update the nextIndexPeaks 
               * (10000 indexes = 1/4s muting)
               */

              this.nextIndexPeaks[atThresold] = currentMinIndex + peaks[key] + 10000;
              this.validPeaks[atThresold].push(currentMinIndex + peaks[key]);

            }
          });
        }
      });
    }

  }

  /**
   * Stop all (we have enougth interval counts)
   * @param  {[type]} err [description]
   * @param  {[type]} bpm [description]
   * @return {[type]}     [description]
   */
  
  muteAnalyzer (err, bpm) {

    console.log('[freezePushBack]');

    /**
     * Stop the push callback function
     */

    this.waitPushTime = 'never';

    /**
     * Set extra scope value to record any peaks
     */

    this.minValidThresold = 1.1;

  }



  /**
   * [stabilizeBPM description]
   * @param  {[type]} timeout [description]
   * @return {[type]}         [description]
   */
  
  stabilizeBPM (timeout) {

    console.log('[onBpmStabilized] function: Fired !');
        
    this.options.onBpmStabilized(thresold);

    // After x milliseconds, we reinit the analyzer
    if (this.options.continuousAnalysis) {
    
      clearTimeout(this.waitStabilization);
    
      this.waitStabilization = timeout;
    }
  }



  /**
   * [reloadAnalyzer description]
   * @return {[type]} [description]
   */
  
  reloadAnalyzer () {
  
    console.log('[waitStabilization] setTimeout: Fired !');

    /**
     * Reduce this value to zero after the first iteration because of this next reload of the options
     */

    this.options.computeBPMDelay = 0;

    /**
     * Reset initial value to options
     */

    this.initClass();

  }



  /**
   * [computeData description]
   * @return {[type]} [description]
   */
  
  computeData () {
    /**
     * Counting time over pushes
     */

    this.cumulatedPushTime += this.options.pushTime;


    /**
     * Compute bpm by testing intervals etc on validPeaks
     */

    analyzer.computeBPM(this.validPeaks, event.inputBuffer.sampleRate, (err, bpm, thresold) => {
      
      /**
       * Push Datas with the callback function
       */

      this.options.pushCallback(err, bpm, thresold);

      /**
       * Mute analizer (if we have enougth interval counts)
       */
      
      if (!err && (bpm && bpm[0].count >= this.options.muteAnalysisAtIntervalCount)) {
      
        this.muteAnalyzer();

      }

      /**
       * Stabilize BPM by increment the minThresold and
       * clear 'useless' data and/or reload analyzer deplyed by the last stabilisation
       */

      if (this.cumulatedPushTime >= this.options.computeBPMDelay && this.minValidThresold < thresold) {
        
        this.stabilizeBPM(setTimeout(() => {
    
          this.reloadAnalyzer();
      
        }, this.options.stabilizationTime));

      }
    });
  }


  /**
   * Attach this function to an audioprocess event on a audio/video node to compute BPM / Tempo in realtime
   */
  
  analyze (event) {
    /**
     * Compute the maximum index with all previous chunks
     * @type {integer}
     */
    const currentMaxIndex = this.options.scriptNode.bufferSize * this.chunkCount;

    /**
     * Apply a low pass filter to the buffer
     * @type {integer}
     */
    const source = analyzer.getLowPassSource(event.inputBuffer, this.options.webAudioAPI.OfflineAudioContext);
    
    /**
     * Force the source to start at the begin
     */
    source.start(0);

    utils.loopOnThresolds((object, thresold) => {

      /**
       * Try to detect a valids peaks at the specified thresold
       */

      this.evaluateValidPeaks(thresold, source.buffer.getChannelData(0), currentMaxIndex);

    }, this.minValidThresold, () => {

      /**
       * Execute a push callbacked function to send datas
       */
      
      if (this.waitPushTime === null) {

        this.waitPushTime = setTimeout(() => {

          this.waitPushTime = null;

          /**
           * Execute the push function container
           */

          this.computeData();
  
        }, this.options.pushTime);

        /**
         * Couting chunks
         */
        
        this.chunkCount++;
      }
    });
  }
}



// Export
module.exports = RealTimeBPMAnalyzer;

// Extend tool to global window scope
window.RealTimeBPMAnalyzer = RealTimeBPMAnalyzer;
