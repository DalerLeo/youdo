
const ONE = 1
const paymentTypeFormat = (type) => {
    return (Number(type) === ONE) ? 'Банковский счет' : 'Наличными'
}

export default paymentTypeFormat
