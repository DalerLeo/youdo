import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import * as ROUTES from '../../constants/routes'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Link} from 'react-router'
import sprintf from 'sprintf'
import * as TRANS_TYPE from '../../constants/transactionTypes'
import {TRANSACTION_STAFF_EXPENSE_DIALOG, TRANSACTION_DETALIZATION_DIALOG, TRANSACTION_INFO_OPEN} from './index'
import t from '../../helpers/translate'

const enhance = compose(
    injectSheet({
        format: {
            '& > div': {
                display: 'inline-block',
                marginRight: '10px',
                '&:after': {
                    content: '","'
                },
                '&:last-child': {
                    marginRight: '0',
                    '&:after': {
                        display: 'none'
                    }
                }
            }
        }
    })
)
const TransactionsFormat = enhance((props) => {
    const {
        id,
        classes,
        type,
        order,
        user,
        client,
        provider,
        handleClickAgentIncome,
        supply,
        supplyExpanseId,
        expenseCategory,
        incomeCategory,
        handleOpenCategoryPopop,
        handleOpenDetalization,
        comment
    } = props
    const clientName = _.get(client, 'name')
    const clientID = _.get(client, 'id')
    const providerID = _.get(provider, 'id')
    const userName = _.get(user, 'firstName') + ' ' + _.get(user, 'secondName')
    const expenseCategoryName = _.get(expenseCategory, 'name')
    const incomeCategoryName = _.get(incomeCategory, 'name')

    const categoryName = incomeCategoryName || expenseCategoryName
    const categoryOptions = _.get(_.first(_.get(incomeCategory, 'options')), 'keyName') || _.get(_.first(_.get(expenseCategory, 'options')), 'keyName')
    const redirect = (pathname, query, linkName) => {
        return (
            <Link target={'_blank'} to={{
                pathname: pathname,
                query: query
            }}>{linkName}</Link>
        )
    }
    const openDialog = (handleOpenDialog, keyname, linkName) => {
        return (
            <Link onClick={() => handleOpenDialog(id, keyname)}>
                {linkName}
            </Link>
        )
    }
    const categoryOutput = () => {
        switch (categoryOptions) {
            case 'order': return redirect(sprintf(ROUTES.ORDER_ITEM_PATH, order), {search: order, exclude: false}, categoryName)
            case 'supply': return redirect(sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), {search: supply}, categoryName)
            case 'client': return redirect(ROUTES.CLIENT_BALANCE_LIST_URL, {search: clientID}, categoryName)
            case 'staff_expanse': return handleOpenCategoryPopop
                ? openDialog(handleOpenCategoryPopop, 'staff_expanse', categoryName)
                : redirect(ROUTES.TRANSACTION_LIST_URL, {[TRANSACTION_STAFF_EXPENSE_DIALOG]: id}, categoryName)
            case 'transaction_child': return handleOpenDetalization
                ? openDialog(handleOpenDetalization, 'transaction_child', categoryName)
                : redirect(ROUTES.TRANSACTION_LIST_URL, {[TRANSACTION_DETALIZATION_DIALOG]: id}, categoryName)
            case 'provider': return redirect(ROUTES.PROVIDER_BALANCE_LIST_URL, {search: providerID}, categoryName)
            default: return <span>{categoryName}</span>
        }
    }

    const output = () => {
        switch (type) {
            case TRANS_TYPE.FROM_TRANSFER: return <span>{t('Перевод с кассы')}</span>

            case TRANS_TYPE.TO_TRANSFER: return <span>{t('Перевод на кассу')}</span>

            case TRANS_TYPE.ORDER: return redirect(sprintf(ROUTES.ORDER_ITEM_PATH, order), {search: order, exclude: false}, 'Оплата заказа №' + order)

            case TRANS_TYPE.INCOME: return <span>{t('Приход')}</span>

            case TRANS_TYPE.OUTCOME: return <span>{t('Расход')}</span>

            case TRANS_TYPE.INCOME_TO_CLIENT: return <span>{t('Приход на счет клиента')} {redirect(ROUTES.CLIENT_BALANCE_LIST_URL, {search: client.id}, clientName)}</span>

            case TRANS_TYPE.OUTCOME_FROM_CLIENT: return <span>{t('Снято со счета клиента')}</span>

            case TRANS_TYPE.INCOME_FROM_AGENT: return handleClickAgentIncome
                ? <Link onClick={handleClickAgentIncome}><strong>{t('Приемка наличных с агента')} {userName}</strong></Link>
                : redirect(ROUTES.TRANSACTION_LIST_URL, {[TRANSACTION_INFO_OPEN]: id}, t('Приемка наличных с агента') + ' ' + userName)

            case TRANS_TYPE.OUTCOME_FOR_SUPPLY_EXPANSE: return <span>{t('Расход на поставку')}{redirect(sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), {search: supply}, '№' + supply)}</span>

            case TRANS_TYPE.SUPPLY_EXPENCE: return <span>{t('Доп. расход')} {supplyExpanseId ? '№' + supplyExpanseId : ''} {t('на поставку')}
                {redirect(sprintf(ROUTES.SUPPLY_ITEM_PATH, supply), {search: supply}, '№' + supply)}</span>

            default: return null
        }
    }
    return (
        <div className={classes.format}>
            {output() && <div><strong>{t('Описание')}: </strong>{output()}</div>}
            {categoryName && <div><strong>{t('Категория')}: </strong>{categoryOutput()}</div>}
            {comment && <div><strong>{t('Комментарий')}: </strong>{comment}</div>}
        </div>
    )
})

TransactionsFormat.propTypes = {
    type: PropTypes.number.isRequired,
    order: PropTypes.number,
    id: PropTypes.number.isRequired,
    expenseCategory: PropTypes.object,
    client: PropTypes.object,
    user: PropTypes.object,
    supply: PropTypes.number,
    supplyExpanseId: PropTypes.number
}

export default TransactionsFormat
