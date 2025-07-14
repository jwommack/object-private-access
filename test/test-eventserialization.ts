import { GenericEventPublic, GenericEventPrivate } from '../src/index';
import { it } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as assert from 'assert/strict';

describe('Event Serialization', function() {
  let pub: GenericEventPublic;
  let priv: GenericEventPrivate;
  beforeEach(function() {
    // Reset the objects
    pub = new GenericEventPublic();
    priv = new GenericEventPrivate();
  });

  describe('Public parameter object', function() {
    it('public should have object style access', function() {
      expect(pub.__hiddenValue).to.be.true
      //console.log(pub, JSON.stringify(pub), pub.__hiddenValue);
      expect(pub, 'property like').to.have.property('__hiddenValue', true);
    });
  });

  describe('Private parameter object', function() {
    it('private should have object style access', function() {
      //priv.__newhidden = 'set new hidden';
      //console.log(`[before] priv.__example = ${priv.__example}`);
      priv.__example = 'Fucking new';
      //console.log(`[after] priv.__example = ${priv.__example}`);
      expect(priv.__hiddenValue).to.be.true
      //console.log(priv, JSON.stringify(priv), priv.__hiddenValue);
      expect(priv, 'property like').to.have.property('__hiddenValue', true);
    });

    it('private should show hidden values with accessor', function() {
      priv.__otherHidden = 'testing';
      const descriptors = Object.getOwnPropertyDescriptors(
        Reflect.getPrototypeOf(priv) // prevent coercion
      );
      const entries = Object.entries(descriptors);
      let key = priv.showHidden()[0];
      const key1 = { [`${key}`]: priv[key] };
      //console.log({
        //'ShowHidden': priv.showHidden(),
        //'showHidden[0]': key1,
        //descriptors,
        //entries
      //});
      // TODO: Right now these aren't pointers, they're effectively clones
      //   - This means we'll have to update the serialized references every
      //     time that the setter is triggered. Ideally they'd be references.
      priv.__hiddenValue = false;
    });
  });

  describe('ObjectDefine parameters', function() {
    // Useful rescource on this: https://medium.com/@ctrlaltmonique/setting-shadowing-properties-in-javascript-c672c4786436
    it('not sure yet', function() {
      // Set operatio on this field will silently fail,
      //   there might be other implications
      Object.defineProperty(pub, "__field", {
        get: function() {
          return 'This would let us make a non-setable, non-serialized';
        },
        enumerable: true, // Internal flags
        configurable: true, // allows redefinition w/o TypeError
      }); 
      // Can not split the Object.definedProperty calls and add set() later
      //   unless configurable: true is specified in it.
    });
  });

});
