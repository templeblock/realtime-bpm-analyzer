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
    
    const rAudioContext = new wae.RenderingAudioContext();


    fs.readFile(__dirname + "/fixtures/new_order-blue_monday.wav", (err, buffer) => {
      if (err) console.log(err);



      /**
       * Get AudioBuffer from buffer
       */

      rAudioContext.decodeAudioData(buffer).then((audioBuffer) => {

        const {length, numberOfChannels, sampleRate} = audioBuffer;
        const context = new wae.OfflineAudioContext(numberOfChannels, length, sampleRate);

        const audioBufferSourceNode = context.createBufferSource();
        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.start(0);

        // AudioBuffer
        //   console.log(audioBuffer.constructor.name); 
        // AudioBufferSourceNode
        //   console.log(audioBufferSourceNode.constructor.name); 
        // Buffer
        //   console.log(buffer.constructor.name); 

        return callback && callback(null, audioBufferSourceNode, audioBuffer, buffer);

      });

    });
  }



  describe('CBA - _getFixtureAudioBuffer', () => {

	  it('Should test the fixture (new_order-blue_monday.wav) with _getFixtureAudioBuffer()', (done) => {
      
      _getFixtureAudioBuffer((err, audioBufferSourceNode, audioBuffer, buffer) => {

        if (err) console.log(err);

        expect(audioBuffer.duration).to.be.equal(30); // Seconds
        expect(audioBuffer.length).to.be.equal(1323000);
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

        const source = analyzer.getLowPassSource(audioBuffer.buffer, wae.OfflineAudioContext);

        source.start(0);

        done();
      });

    });



    it('Should detect differences between original and lowered fixture', (done) => {

      _getFixtureAudioBuffer((err, audioBufferSourceNodeOriginal, audioBufferOriginal, bufferOriginal) => {

        _getFixtureAudioBuffer((err, audioBufferSourceNode, audioBuffer, buffer) => {

          if (err) console.log(err);

          const rAudioContext = new wae.RenderingAudioContext();
          const analyser = rAudioContext.createAnalyser();
          audioBufferSourceNode.connect(analyser);
          analyser.connect(rAudioContext.destination);
          
          let source = analyzer.getLowPassSource(audioBuffer, wae.OfflineAudioContext);

          source.start(0);

          const sourceOriginal = audioBufferSourceNodeOriginal.buffer.getChannelData(0);
          source = source.buffer.getChannelData(0);


          let isEqual = true;
          const audioBufferLength = source.length;
          for (var o = 0; o < audioBufferLength; o++) {
            if (source[o] != sourceOriginal[o]) {
              console.log(source[o], o);
              console.log(source[o - 1], o);
              isEqual = false;
              break;
            } else {
              console.log(sourceOriginal[o], source[o]);
            }
          }

          console.log(o);
          
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