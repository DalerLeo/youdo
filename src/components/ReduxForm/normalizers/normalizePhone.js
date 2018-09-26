import fp from 'lodash/fp'

const FOUR = 4
const FOURTEEN = 14

const isNumber = fp.flow(fp.replace('+', '0'), fp.toNumber, fp.isNaN)
const filled = fp.flow(fp.size, fp.eq(FOURTEEN))

const normalizePhone = (nextVal, preVal) => {
  if (fp.size(nextVal) < FOUR) {
    return '+998'
  }

  if (isNumber(nextVal) || filled(nextVal)) {
    return preVal
  }
  return nextVal
}

export default normalizePhone
