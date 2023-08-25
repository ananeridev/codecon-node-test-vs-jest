// 03-fakeTimers.test.js 
import {
    describe,
    it,
    jest,
    expect
  } from '@jest/globals'
  
  describe('Spies Test Suite', () => {
    it('should verify calls in a mock', () => {
      jest.useFakeTimers()
      const spy = jest.fn(() => console.log('FOI CHAMADUU'))
      setTimeout(spy, 9000)
      jest.advanceTimersByTime(9000)
      expect(spy).toHaveBeenCalled()
    })
  })
  