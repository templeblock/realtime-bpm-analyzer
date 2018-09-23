'use strict';

/**
 * Get expect function for testing
 */
import chai from "chai";
let expect = chai.expect;
import utils from "./../src/utils";
// import analyzer from "./../src/analyzer";
import horseman from "./horseman";
import fs from "fs";


/**
 * Unit test for the RealTime BPM Analyzer
 */

describe('RealTime BPM Analyzer', () => {

  /**
   * Test Utility functions
   */

  describe('Utils', () => {

    it('Test onLoop function', (done) => {
      utils.loopOnThresolds((object, thresold, stop) => {
      	// We add an entry to object
      	object.foo = thresold;
      	// Stop the loop at first iteration
      	stop(true);
      }, (object) => {
	    	// Check if object have only ONE entry
	    	expect(JSON.stringify(object)).to.be.equal('{"foo":0.8999999999999999}');
	      done();
    	});
    });

    it('Test callback (second param) without onLoop', (done) => {
      utils.loopOnThresolds(null, (object) => {
      	expect(JSON.stringify(object)).to.be.equal('{}');
      	done();
      });
    });

    it('Test Object Model generation', (done) => {
      utils.generateObjectModel(false, (object) => {
      	expect(JSON.stringify(object)).to.be.not.equal('{}');
      	done();
      });
    });
  });


  /**
   * Test Analyzer functions
   */

  describe('Analyzer', () => {
	  it('Test low pass filter applying', (done) => {
      // fs.readFile('./src/analyzer.js', 'utf8', function (err, data) {
      //   if (err) throw err;

        horseman(['./build/bundle.js', './build/webaudiotestapi-final.js'], function (callback) {
          $(document).ready(function() {
            console.log($);
            console.log(AudioContext);
            console.log(window.WebAudioTestAPI);

            var audioContext = new (window.WebAudioTestAPI && window.WebAudioTestAPI.AudioContext)();
            // Create an empty three-second stereo buffer at the sample rate of the AudioContext
            var buffer = audioContext.createBuffer(2, audioContext.sampleRate * 3, audioContext.sampleRate);
            // Fill the buffer with white noise;
            // just random values between -1.0 and 1.0
            for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
              // This gives us the actual array that contains the data
              var nowBuffering = buffer.getChannelData(channel);
              for (var i = 0; i < buffer.length; i++) {
                // Math.random() is in [0; 1.0]
                // audio needs to be in [-1.0; 1.0]
                nowBuffering[i] = Math.random() * 2 - 1;
              }
            }

            const source = analyzer.getLowPassSource(buffer, window.WebAudioTestAPI.OfflineAudioContext);
            expect(typeof source.buffer).to.be.not.equal('AudioBuffer');
            done();
            callback();
          });
      });
      // })
    });


	  it('Test onLoop function', (done) => {
      // findPeaksAtThresold(data, thresold, *offset, *callback)
      // -- EASY

      //
      // getTopCandidates(candidates)
      // -- EASY
      // identifyIntervals(peaks)
      // -- MEDIUM
      // groupByTempo(sampleRate)
      // -- MEDIUM
	      // computeBPM(data, callback)
	      // -- HARD
	    done();
	  });
  });
});