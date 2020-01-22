const { readFile } = require('fs')

const DIRECTIONS = ['NORTH', 'EAST', 'SOUTH', 'WEST']

const TABLE = {
  boundaries: {
    x: [0, 5],
    y: [0, 5]
  }
}
Object.freeze(TABLE)

/** The Robot */
const ROBOT = {
  /** @property {number|null} x - the X position */
  x: null,
  /** @property {number|null} y - the Y position */
  y: null,
  /** @property {string|null} facing - the direction the robot is facing */
  facing: null
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
  // console.log('New location:', Object.values(ROBOT).join(','))
}

/** Reports the current location of the robot to the console.
 * @returns {void}
 */
const report = () => {
  if (isRobotPlaced()) {
    console.info(Object.values(ROBOT).join(','))
  } else {
    // console.warn('Robot has not been placed.')
  }
}

/** Checkes whether the robot has been placed on the table.
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
      console.log('Robot is facing somewhere else.')
      return
  }
  updateRobot(newX, newY, ROBOT.facing)
}

readFile('./input_a.txt', 'utf-8', (error, data) => {
  if (error) {
    throw error
  }

  // Read lines
  const lines = data.split('\n')
  lines.forEach(line => {
    const [command, location] = line.split(' ')
    if (!command || !command.length) return

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
        console.warn(`Invalid command supplied: ${command}`)
    }
  })
})
