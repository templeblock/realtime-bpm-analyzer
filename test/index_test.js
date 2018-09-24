'use strict';

/**
 * Get expect function for testing
 */
import chai from "chai";
let expect = chai.expect;

import utilsTests from "./_utils.js";
import analyzer from "./../src/analyzer";
const wae = require("web-audio-engine");
const AudioBuffer = require("web-audio-engine").AudioBuffer;
const fs = require("fs");

/**
 * Unit test for the RealTime BPM Analyzer
 */

describe('RealTime BPM Analyzer', () => {

  utilsTests();

  /**
   * Test Analyzer functions
      getLowPassSource
      findPeaksAtThresold
      computeBPM
      getTopCandidates
      identifyIntervals
      groupByTempo
   */
  


  const _getFixtureAudioBuffer = (callback) => {

    /**
     * Instanciate an audioContext
     */
    
    const AudioContext = wae.RenderingAudioContext;
    const context = new AudioContext();


    fs.readFile(__dirname + "/fixtures/bass-test.wav", (err, buffer) => {
      if (err) console.log(err);

      /**
       * Get AudioBuffer from buffer
       */

      context.decodeAudioData(buffer).then((audioBuffer) => {

        callback && callback(null, audioBuffer, buffer);

      })

    });
  }



  describe('CBA - _getFixtureAudioBuffer', () => {

	  it('Should test the fixture (bass-test.wav) with _getFixtureAudioBuffer()', (done) => {
      
      _getFixtureAudioBuffer((err, audioBuffer) => {

        if (err) console.log(err);

        expect(audioBuffer.length).to.be.equal(338688);
        expect(audioBuffer.sampleRate).to.be.equal(44100);
        expect(audioBuffer.constructor.name).to.be.equal('AudioBuffer');

        done();
      });

    });
  
  });

  

  describe('CBA - Analyzer.getLowPassSource', () => {


    it('Should test self execution of getLowPassSource', (done) => {
      
      _getFixtureAudioBuffer((err, audioBuffer, buffer) => {
        if (err) console.log(err);

        const OfflineAudioContext = wae.OfflineAudioContext;
        const source = analyzer.getLowPassSource(buffer, OfflineAudioContext);

        source.start(0);

        done();
      });

    });



    it('Should detect differences between original and lowered fixture', (done) => {

      const OfflineAudioContext = wae.OfflineAudioContext;

      _getFixtureAudioBuffer((err, audioBufferOriginal, bufferOriginal) => {

        _getFixtureAudioBuffer((err, audioBuffer, buffer) => {

          if (err) console.log(err);
          
          let source = analyzer.getLowPassSource(audioBuffer, OfflineAudioContext);

          source.start(0);

          audioBufferOriginal = audioBufferOriginal.getChannelData(0);
          source = source.buffer.getChannelData(0);

          let isEqual = true;
          const audioBufferLength = audioBuffer.length;
          for (var o = 0; o < audioBufferLength; o++) {
            if (audioBuffer[o] != audioBufferOriginal[o]) {
              isEqual = false;
              break;
            }
          }
          
          const wait = setTimeout(() => {
            if ( ! isEqual) {
              done();
            } else {
              done(new Error('isEqual ' + isEqual));
            }
          }, 1000);
        });
      });

    });

  });

  

  describe('CBA - Analyzer.findPeaksAtThresold', () => {

	  it('Test onLoop function', (done) => {
      // findPeaksAtThresold(data, thresold, *offset, *callback)
      // -- EASY
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

    it('Test onLoop function', (done) => {
      // findPeaksAtThresold(data, thresold, *offset, *callback)
      // -- EASY
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





    /**
   * Test Index functions
      clearValidPeaks
      evaluateValidPeaks
      muteAnalyzer
      stabilizeBPM
      reloadAnalyzer
      computeData
      analyze
   */
  
});