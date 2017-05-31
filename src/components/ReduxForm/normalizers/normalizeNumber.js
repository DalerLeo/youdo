const normalizeNumber = value => {
    if (!value) {
        return value
    }

    const onlyNums = value.replace(/[^\d]/g, '')
    return onlyNums.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default normalizeNumber
