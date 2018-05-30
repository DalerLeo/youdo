const ONE = 1
const MINUS_ONE = -1
const ZERO = 0
const TWO = 2
const TREE = 3
const TWENTY = 20
const FIVE = 5

const numberToWord = (value) => {
  let value2 = value
  let arrNumbers = []
  arrNumbers[ONE] = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать']
  arrNumbers[TWO] = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто']
  arrNumbers[TREE] = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']
  const numberParser = (num, _desc) => {
    let num1 = num
    let words = ''
    let numHundred = ''
    if (num1.length === TREE) {
      numHundred = num1.substr(ZERO, ONE)
      num1 = num1.substr(ONE, TREE)
      words = arrNumbers[TREE][numHundred] + ' '
    }
    if (num1 < TWENTY) words += arrNumbers[ONE][parseFloat(num1)] + ' '
    else {
      let firstNum = num1.substr(ZERO, ONE)
      let secondNum = num1.substr(ONE, TWO)
      words += arrNumbers[TWO][firstNum] + ' ' + arrNumbers[ONE][secondNum] + ' '
    }
    let lastNum = ''
    switch (_desc) {
      case ZERO:
        words += 'сум'
        break
      case ONE:
        lastNum = parseFloat(num1.substr(MINUS_ONE))
        if (lastNum === ONE) words += 'тысяча '
        else if (lastNum > ONE && lastNum < FIVE) words += 'тысячи '
        else words += 'тысяч '
        words = words.replace('один ', 'одна ')
        words = words.replace('два ', 'две ')
        break
      case TWO:
        lastNum = parseFloat(num1.substr(MINUS_ONE))
        if (lastNum === ONE) words += 'миллион '
        else if (lastNum > ONE && lastNum < FIVE) words += 'миллиона '
        else words += 'миллионов '
        break
      case TREE:
        lastNum = parseFloat(num1.substr(MINUS_ONE))
        if (lastNum === ONE) words += 'миллиард '
        else if (lastNum > ONE && lastNum < FIVE) words += 'миллиарда '
        else words += 'миллиардов '
        break
      default:
        break
    }
    words = words.replace('  ', ' ')
    return words
  }
  const decimalsParser = (num) => {
    let firstNum = num.substr(ZERO, ONE)
    let secondNum = parseFloat(num.substr(ONE, TWO))
    let words = ' ' + firstNum + secondNum
    words += ' тийин'
    return words
  }
  if (!value2 || value2 === ZERO) return false
  if (typeof value2 !== 'number') {
    value2 = value2.replace(',', '.')
    value2 = parseFloat(value2)
    if (isNaN(value2)) return false
  }
  value2 = value2.toFixed(TWO)
  let numberDecimals = ''
  if (value2.indexOf('.') !== MINUS_ONE) {
    let numberArr = value2.split('.')
    value2 = numberArr[ZERO]
    numberDecimals = numberArr[ONE]
  }
  let numberLength = value2.length
  let words = ''
  let numParser = ''
  let count = ZERO
  for (let p = (numberLength - ONE); p >= ZERO; p--) {
    let numDigit = value2.substr(p, ONE)
    numParser = numDigit + numParser
    if ((numParser.length === TREE || p === ZERO) && !isNaN(parseFloat(numParser))) {
      words = numberParser(numParser, count) + words
      numParser = ''
      count++
    }
  }
  if (numberDecimals) words += decimalsParser(numberDecimals)
  return words.charAt(ZERO).toUpperCase() + words.substring(ONE)
}

export default numberToWord
