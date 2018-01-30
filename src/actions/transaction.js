import _ from 'lodash'
import sprintf from 'sprintf'
import axios from '../helpers/axios'
import * as API from '../constants/api'
import * as actionTypes from '../constants/actionTypes'
import * as serializers from '../serializers/Transaction/transactionSerializer'

export const transactionCreateIncomeAction = (formValues, cashboxId) => {
    const requestData = serializers.createIncomeSerializer(formValues, cashboxId)
    const payload = axios()
        .post(API.TRANSACTION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_INCOME,
        payload
    }
}

export const acceptCashListFetchAction = () => {
    const payload = axios()
        .get(API.TRANSACTION_ACCEPT_CASH)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_ACCEPT_CASH,
        payload
    }
}

export const transactionCreateExpenseAction = (formValues, cashboxId) => {
    const requestData = serializers.createExpenseSerializer(formValues, cashboxId)
    const payload = axios()
        .post(API.TRANSACTION_CREATE, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_EXPENSE,
        payload
    }
}

export const pendingTransactionFetchAction = (filter) => {
    const page = filter && _.get(filter.getParams(), 'dPage')
    const currency = filter && _.get(filter.getParams(), 'openCurrency')
    const division = filter && _.get(filter.getParams(), 'openDivision')
    const user = filter && _.get(filter.getParams(), 'openUser')
    const params = {
        transaction: 0,
        user,
        type: 1,
        currency,
        division,
        'page': page
    }

    const payload = axios()
        .get(API.ORDER_TRANSACTION, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ORDER_TRANSACTION,
        payload
    }
}

export const transactionCreateSendAction = (formValues, cashboxId, withPersent, defaultCurrency, sameCurType) => {
    const requestData = serializers.createSendSerializer(formValues, cashboxId, withPersent, defaultCurrency, sameCurType)
    const payload = axios()
        .post(API.TRANSACTION_SEND, requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_SEND,
        payload
    }
}
export const acceptClientTransactionAction = (data) => {
    const payload = axios()
        .post(API.ACCEPT_CLIENT_TRANSACTION, data)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.ACCEPT_CLIENT_TRANSACTION,
        payload
    }
}
export const transactionDeleteAction = (id) => {
    const payload = axios()
        .delete(sprintf(API.TRANSACTION_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_DELETE,
        payload
    }
}

export const deleteTransactionAction = (id) => {
    const payload = axios()
        .post(sprintf(API.TRANSACTION_PAYMENT_DELETE, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_PAYMENT_DELETE,
        payload
    }
}

export const transactionUpdateExpenseAction = (id, formValues, cashboxId) => {
    const requestData = serializers.createExpenseSerializer(formValues, cashboxId)
    const payload = axios()
        .put(sprintf(API.TRANSACTION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_UPDATE,
        payload
    }
}
export const transactionEditPaymentAction = (formValues, clientId, transId) => {
    const requestData = serializers.updateTransactionSerializer(formValues, clientId)
    const payload = axios()
        .put(sprintf(API.CLIENT_BALANCE_SUPER_USER, transId), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.CLIENT_BALANCE_SUPER_USER,
        payload
    }
}

export const transactionDetelePaymentAction = (id, formValues, cashboxId) => {
    const requestData = serializers.createExpenseSerializer(formValues, cashboxId)
    const payload = axios()
        .delete(sprintf(API.TRANSACTION_PAYMENT_DELETE, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_PAYMENT_DELETE,
        payload
    }
}

export const transactionUpdateIncomeAction = (id, formValues, cashboxId) => {
    const requestData = serializers.createIncomeSerializer(formValues, cashboxId)
    const payload = axios()
        .put(sprintf(API.TRANSACTION_ITEM, id), requestData)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_UPDATE_INCOME,
        payload
    }
}

export const transactionListFetchAction = (filter, cashboxId, isSuperUser) => {
    const params = serializers.listFilterSerializer(filter.getParams(), cashboxId, isSuperUser)
    const payload = axios()
        .get(API.TRANSACTION_LIST, {params})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_LIST,
        payload
    }
}

export const transactionItemFetchAction = (id) => {
    const payload = axios()
        .get(sprintf(API.TRANSACTION_ITEM, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_ITEM,
        payload
    }
}

export const transactionInfoFetchAction = (id) => {
    const payload = axios()
        .get(API.CLIENT_TRANSACTION_LIST, {params: {transaction: id, 'page_size': 100}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_INFO,
        payload
    }
}

export const transactionConvertAction = (date, currency, order) => {
    const params = serializers.convertSerializer(date, currency, order)
    const payload = axios()
        .post(API.PENDING_PAYMENTS_CONVERT, params)
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.PENDING_PAYMENTS_CONVERT,
        payload
    }
}

export const usersListFetchAction = () => {
    const payload = axios()
        .get(API.USERS_LIST, {params: {page_size: 50}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.USERS_LIST,
        payload
    }
}

export const transactionCategoryPopopDataAction = (id) => {
    const payload = axios()
        .get(API.TRANSACTION_CATEGORY_DATA_LIST, {params: {transaction: id, page_size: 100}})
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_CATEGORY_DATA_LIST,
        payload
    }
}

export const transactionDetalizationAction = (id) => {
    const payload = axios()
        .get(sprintf(API.TRANSACTION_DETALIZATION_LIST, id))
        .then((response) => {
            return _.get(response, 'data')
        })
        .catch((error) => {
            return Promise.reject(_.get(error, ['response', 'data']))
        })

    return {
        type: actionTypes.TRANSACTION_DETALIZATION_LIST,
        payload
    }
}
