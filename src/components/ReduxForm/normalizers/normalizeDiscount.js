const normalizeDiscount = value => {
    const MAX = 100
    if (!value) {
        return value
    }

    return value > MAX ? MAX : value
}

export default normalizeDiscount
