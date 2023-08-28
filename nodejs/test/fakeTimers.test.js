import { describe, mock, it } from 'node:test';
import assert from 'node:assert';

mock.timers.enable(['setInterval']); 

describe('Fake Timers by Erick Wendel <3 test suite', () => {

    it('should advance in time and trigger timers when calling .tick function multiple times', (t) => {
        t.mock.timers.enable()
        const fn = t.mock.fn()
      
        setTimeout(fn, 2000)
      
        t.mock.timers.tick(1000)
        t.mock.timers.tick(500)
        t.mock.timers.tick(500)
      
        assert.strictEqual(fn.mock.callCount(), 1)
        t.mock.timers.reset()
      })
})


const { formatName } = require('./sua-funcao-formatName'); 

describe('formatName', () => {
  it('deve formatar um nome corretamente', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const result = formatName(user);

    expect(result).toBe('John Doe');
  });
});


