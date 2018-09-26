const horizontalScroll = (elementToScroll) => {
  const ONE = 1
  const MINUS_ONE = -1
  const MULTIPLY = 35
  const scrollHorizontally = (event) => {
    const customEvent = window.event || event
    const delta = Math.max(MINUS_ONE, Math.min(ONE, (customEvent.wheelDelta || -customEvent.detail)))
    elementToScroll.scrollLeft -= (delta * MULTIPLY)
    customEvent.preventDefault()
  }
  if (elementToScroll.addEventListener) {
    elementToScroll.addEventListener('mousewheel', scrollHorizontally, false)
    elementToScroll.addEventListener('DOMMouseScroll', scrollHorizontally, false)
  } else {
    elementToScroll.attachEvent('onmousewheel', scrollHorizontally)
  }
}

export default horizontalScroll
