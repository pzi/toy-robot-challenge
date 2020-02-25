const { updateRobot, report, isValidPlacement } = require('./index')
const Logger = require('js-logger')

const resetRobot = () => updateRobot(null, null, null)

describe('report', () => {
  let warnSpy
  let infoSpy
  beforeEach(() => {
    warnSpy = jest.spyOn(Logger, 'warn').mockImplementation()
    infoSpy = jest.spyOn(Logger, 'info').mockImplementation()
  })

  afterEach(() => {
    warnSpy.mockRestore()
    infoSpy.mockRestore()
    resetRobot()
  })

  describe('Without a valid robot placement', () => {
    beforeEach(() => {
      report()
    })

    it('Warns about the robot not being placed', () => {
      expect(warnSpy).toHaveBeenCalledWith('Robot has not been placed.')
    })
  })

  describe('With a valid robot placement', () => {
    beforeEach(() => {
      updateRobot(0, 0, 'NORTH')
      report()
    })

    it('Reports the location of the robot', () => {
      expect(infoSpy).toHaveBeenCalledWith('0,0,NORTH')
    })
  })
})

describe('isValidPlacement', () => {
  describe('With any missing params', () => {
    test.each([
      [null, null, null, false],
      [0, null, null, false],
      [null, 0, null, false],
      [null, null, 0, false],
      [0, 0, null, false],
      [0, null, 0, false],
      [null, 0, 0, false],
      [undefined, undefined, undefined, false],
      [0, undefined, undefined, false],
      [undefined, 0, undefined, false],
      [undefined, undefined, 0, false],
    ])('isValidPlacement(%p, %p, %p)', (a, b, c, expected) => {
      expect(isValidPlacement(a, b, c)).toBe(expected)
    })
  })
})
