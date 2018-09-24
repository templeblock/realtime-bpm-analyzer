import chai from "chai";
let expect = chai.expect;
import utils from "./../src/utils";


module.exports = () => {
	describe('Utils - CBA Testing', () => {

	  describe('Utils - Basic check', () => {
	  
	    it('Should utils exist and have his children', (done) => {

	      expect(utils).to.be.not.an('undefined');
	      expect(Object.keys(utils).length).to.be.equal(3);

	      done();
	    });

	  });

	  describe('Utils.clone', () => {
	  
	    it('Should clone an object', (done) => {

	      const object1 = {foo:'bar'};

	      const object2 = utils.clone(object1);
	      object2.bar = 'foo';

	      expect(object2.bar).to.be.equal('foo');
	      expect(object1.bar).to.be.an('undefined');

	      done();
	    });

	  });

	  describe('Utils.loopOnThresolds', () => {

	    it('Should test behaviour without callback', (done) => {
	      const subObject = {};

	      utils.loopOnThresolds((object, thresold, stop) => {
	        subObject.foo = thresold;
	        stop(true);
	      });

	      expect(JSON.stringify(subObject)).to.be.equal('{"foo":0.8999999999999999}');
	      
	      done();
	    });



	    it('Should set specific minThresold', (done) => {
	      const specificThresold = 0.60;

	      utils.loopOnThresolds((object, thresold, stop) => {
	        object[thresold] = thresold;
	      }, specificThresold, (object) => {
	        expect(Object.keys(object)[0]).to.be.equal('0.8999999999999999');
	        expect(Object.keys(object)[6]).to.be.equal('0.5999999999999996');
	        expect(Object.keys(object).length).to.be.equal(7);
	        done();

	      });
	    });



	    it('Should assign one value at the first (highest) thresold', (done) => {
	      utils.loopOnThresolds((object, thresold, stop) => {

	        object.foo = thresold;

	        stop(true);
	      }, (object) => {
	        expect(JSON.stringify(object)).to.be.equal('{"foo":0.8999999999999999}');
	        done();
	      });
	    });



	    it('Should assign an object with all thresolds', (done) => {
	      utils.loopOnThresolds((object, thresold, stop) => {

	        object[thresold] = thresold;

	      }, (object) => {
	        expect(Object.keys(object).length).to.be.equal(13);
	        done();
	      });
	    });



	    it('Should return empty objects with onLoop null', (done) => {
	      utils.loopOnThresolds(null, (object) => {
	      	expect(JSON.stringify(object)).to.be.equal('{}');
	      	done();
	      });
	    });

	  });



	  describe('Utils.generateObjectModel', () => {

	    it('Should generate an object with all thresolds as key with defaultValue', (done) => {
	      utils.generateObjectModel(false, (object) => {
	        const keys = Object.keys(object);

	        for (var o = 0; o < keys.length; o++) {
	          const objectThresoldValue = object[Object.keys(object)[o]];
	          expect(objectThresoldValue).to.be.equal(false);
	        }

	        done();
	      });
	    });


	    it('Should assign autonomous object with defaultValue', (done) => {
	      utils.generateObjectModel({}, (object) => {
	        const keys = Object.keys(object);

	        for (var o = 0; o < keys.length; o++) {
	          const objectThresoldValue = object[Object.keys(object)[o]];
	          objectThresoldValue.increment = o;
	        }
	        
	        for (var o = 0; o < keys.length; o++) {
	          const objectThresoldValue = object[Object.keys(object)[o]];
	          expect(objectThresoldValue.increment).to.be.equal(o);
	        }

	      	done();
	      });
	    });

	  });

	});
};

