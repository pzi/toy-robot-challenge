const { readFile } = require('fs')
const Logger = require('js-logger')

Logger.useDefaults()

const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST']

const TABLE = {
  boundaries: {
    x: [0, 5],
    y: [0, 5],
  },
}
Object.freeze(TABLE)

/** The Robot */
const ROBOT = {
  /** @property {number|null} x - the X position */
  x: null,
  /** @property {number|null} y - the Y position */
  y: null,
  /** @property {string|null} facing - the direction the robot is facing */
  facing: null,
}
Object.seal(ROBOT)

/** Updates the robot properties.
 * @param {number} x
 * @param {number} y
 * @param {string} facing
 * @returns void
 */
const updateRobot = (x, y, facing) => {
  ROBOT.x = Number(x)
  ROBOT.y = Number(y)
  ROBOT.facing = facing
  // Logger.log('New location:', Object.values(ROBOT).join(','))
}

/** Reports the current location of the robot to the console.
 * @returns {void}
 */
const report = () => {
  if (isRobotPlaced()) {
    Logger.info(Object.values(ROBOT).join(','))
  } else {
    Logger.warn('Robot has not been placed.')
  }
}

/** Checks whether the robot has been placed on the table.
 * @returns {boolean}
 */
const isRobotPlaced = () => Object.values(ROBOT).filter(v => v === null).length === 0

/** Rotate the robot in the provided direction. */
const rotateRobot = direction => {
  let newDirection = ''
  const clockwise = direction === 'RIGHT'
  if (ROBOT.facing === 'NORTH') newDirection = clockwise ? 'EAST' : 'WEST'
  if (ROBOT.facing === 'EAST') newDirection = clockwise ? 'SOUTH' : 'NORTH'
  if (ROBOT.facing === 'SOUTH') newDirection = clockwise ? 'WEST' : 'EAST'
  if (ROBOT.facing === 'WEST') newDirection = clockwise ? 'NORTH' : 'SOUTH'
  updateRobot(ROBOT.x, ROBOT.y, newDirection)
}

/** Checks if the robot placement is valid.
 * @param {number} x
 * @param {number} y
 * @param {string} facing
 * @returns boolean
 */
const isValidPlacement = (x, y, facing) => {
  if (!x || !y || !facing) return false

  const [minX, maxX] = TABLE.boundaries.x
  const [minY, maxY] = TABLE.boundaries.y
  const isValidDirection = DIRECTIONS.includes(String(facing).toUpperCase())
  return x >= minX && x <= maxX && y >= minY && y <= maxY && isValidDirection
}

const moveRobot = () => {
  const [minX, maxX] = TABLE.boundaries.x
  const [minY, maxY] = TABLE.boundaries.y
  let newX = ROBOT.x
  let newY = ROBOT.y

  switch (ROBOT.facing) {
    case 'NORTH':
      newY = Math.min(Math.min(ROBOT.y + 1, maxY), maxY)
      break
    case 'EAST':
      newX = Math.min(Math.min(ROBOT.x + 1, maxX), maxX)
      break
    case 'SOUTH':
      newY = Math.max(Math.max(ROBOT.y - 1, minY), minY)
      break
    case 'WEST':
      newX = Math.max(Math.max(ROBOT.x - 1, minX), minX)
      break
    default:
      Logger.warn('Robot is facing somewhere else.')
      return
  }
  updateRobot(newX, newY, ROBOT.facing)
}

const INPUT_FILE = process.argv[2] ?? './input_a.txt'

readFile(INPUT_FILE, 'utf-8', (error, data) => {
  if (error) {
    Logger.error(`Error reading file:\n-->`, error.message, '\n')
    return
  }

  // Ensure we use consistent line endings
  const lines = data.replace(/\r\n/g,'\n').split('\n');
  // Read lines
  lines.forEach(line => {
    console.log(line)

    const [command, location] = line.split(' ')
    if (!command) {
      return
    }

    switch (command) {
      case 'PLACE':
        const locationInput = location.split(',')
        const [x, y, facing] = locationInput
        if (isValidPlacement(x, y, facing) && !isRobotPlaced()) {
          updateRobot(x, y, facing)
        }
        break
      case 'MOVE':
        if (!isRobotPlaced()) return
        moveRobot()
        break
      case 'LEFT':
      case 'RIGHT':
        if (!isRobotPlaced()) return
        rotateRobot(command)
        break
      case 'REPORT':
        report()
        break
      default:
        Logger.warn(`Invalid command supplied: ${command}`)
    }
  })
})

module.exports = {
  updateRobot,
  report,
  isValidPlacement,
}
