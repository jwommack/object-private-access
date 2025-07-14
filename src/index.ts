export class Generico {
  protected name;
  private tsPrivate;
  #truelyPrivateProps = 'There are dozens of us!';
  publicProp = 'What? Like you don\'t have one?';

  constructor(name: string, private promoteMeBro = '') {
    this.name = name; // Old style promotion
    this.tsPrivate = `secret ${name}`;
  }

  publicPropFunc = () => {
    return 'Oof';
  }

  private privatePropFunc = () => {
    return 'Le Oof';
  }

  #newPrivatePropFunc = () => {
    return 'How are you even here Oofs';
  }

  normalFunc(args: object = {}) {
    return `called with ${args}`;
  }

  private privateFunc(args: object = {}) {
    return `private func called with ${args}`;
  }

  #newPrivateFunc(args: object = {}) {
    return `truly private func called with ${args}`;
  }
}

interface event {
  [key: string]: string | undefined;
}
interface hiddenValues {
  [key: string]: any;
}
const expr = /__*/;
export class GenericEventPrivate {

  #priv: hiddenValues = {};
  #__hiddenValue: boolean = true;
  // TODO: Pretty much what I want to do here isn't currently possible in ES6
  // TODO: This may REQUIRE assigning to a private object.
  constructor(...a: any[]) {
    //super(...a);

    const handler = {
      //get __hiddenValue() {
        //return this.__hiddenValue
      //},
      //set __hiddenValue(value: boolean) {
        //this.__hiddenValue = value
      //},
      get: (target: any, name: any, receiver: any) => {
        console.log('get', target, name);
        if(!(Reflect.has(target, name)) && !(target?.[name])) {
          console.log(`Getting non-existent property '${name}'`);
          if (name[0] === '_' && name[1] === '_') { 
            return this.#priv?.[name];
          }
          return undefined;
        }
        console.log(`get target found for ${name}`);
        return target?.[name];
        //return Reflect.get(target, name, receiver);
      },
      set: (target: any, name: any, value: any, receiver: any) => {
        console.log('set', target, name, value, receiver);
        if(!Reflect.has(target, name) || !(target?.[name])) {
          console.log(`Setting non-existent property '${name.toString()}', initial value: ${value}`);
          if (name[0] === '_' && name[1] === '_') {
            console.log('Checking private access in lambda');
            this.#priv[`${name}`] = value;
            console.log('SEKRITS', this.#priv); // Can has access?
            return this.#priv[`${name}`] == value
          }
        } else {
          console.log(`Target found for ${name}`);
          return target[name];
        }
        return Reflect.set(target, name, value, receiver);
      }
    };
    return new Proxy(this, handler);
  }
  //get['__*'](key: string) {
  get __hiddenValue() {
    return this.#__hiddenValue;
  }
  set __hiddenValue(value: boolean) {
    this.#__hiddenValue = value;
  }
    //return this.#priv[key];
  //}
  //set[expr](key: string, value: unknown) {
    //if(! this.#priv[`${key}`]) {
      //Object.assign(this.#priv, { [`${key}`]: value });
    //} else {
      //this.#priv[key] = value;
    //}
  //}
  
  /**
   * For access to hidden values on serialization
   */
  showHidden() {
    // TODO: This if fucking ugly
    //   -  TODO: Cache this and only do it on change to hiddens..
    //   - Concerns around Reflection, in other langs it's slow. Might be fine here.
    //   - filter().map() is almost always a wrong optimization.
    return Object.entries(
      Object.getOwnPropertyDescriptors(
        Reflect.getPrototypeOf(this)
      )
    )
    .filter(e => {
      return typeof e[1].get === 'function' && e[0] !== '__proto__';
    }).map(e => e[0] as keyof typeof this);
  }
}

export class GenericEventPublic {
  __hiddenValue = true;
}

export class ProxyEventPrivate {
  [k: string]: any;
  constructor() {
    return new Proxy<ProxyEventPrivate>(this, {
      get(thiz, prop) {
        console.log(`getting ${String(prop)}`);
      },
      set(thiz, prop, value) {
        console.log(`setting ${String(prop)} to ${value}`);
        return true;
      }
    });
  }
}

//Object.definePropertry(instance, "__field", {
//get: function() {
//return 'This would let us make a non-setable, non-serialized';
//}
//});
