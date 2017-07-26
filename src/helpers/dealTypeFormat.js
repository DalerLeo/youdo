const ONE = 1
const dealTypeFormat = (type) => {
    return (Number(type) === ONE) ? 'Консигнация' : 'Стандартная'
}

export default dealTypeFormat
