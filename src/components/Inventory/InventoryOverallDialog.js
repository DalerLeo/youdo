import _ from 'lodash'
import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import numberWithoutSpaces from '../../helpers/numberWithoutSpaces'
import Tooltip from '../ToolTip'
import t from '../../helpers/translate'

const enhance = compose(
    injectSheet({
        dialog: {
            background: 'rgba(0,0,0, 0.54)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            position: 'fixed',
            padding: '100px 0',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            overflowY: 'auto',
            zIndex: '1000'
        },
        content: {
            background: '#fff',
            width: '900px',
            margin: 'auto 0',
            '& header': {
                fontWeight: '600',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 5px 5px 30px',
                borderBottom: '1px #efefef solid'
            },
            '& section': {
                padding: '0 30px 10px',
                '& .row': {
                    padding: '15px 0',
                    '&:first-child': {
                        fontWeight: '600'
                    },
                    '&:last-child:after': {
                        display: 'none'
                    }
                }
            },
            '& footer': {
                padding: '8px',
                textAlign: 'right',
                borderTop: '1px #efefef solid'
            }
        },
        actionButton: {
            '& span': {
                color: '#12aaeb !important',
                fontWeight: '600 !important'
            }
        }
    })
)

const InventoryOverallDialog = enhance((props) => {
    const {
        classes,
        data,
        formData,
        closeDialog,
        submitDialog
    } = props

    const ZERO = 0
    const items = _.filter(_.map(data, (item) => {
        const id = _.get(item, 'id')
        const find = _.find(formData, (o, i) => {
            const formId = _.toInteger(i)
            return id === formId
        })
        const title = _.get(item, 'title')
        const measurement = _.get(item, ['measurement', 'name'])
        const balance = _.toNumber(_.get(item, 'balance'))
        const defects = _.toNumber(_.get(item, 'defects'))
        const inputAmount = _.toNumber(numberWithoutSpaces(_.get(find, 'amount')))
        const inputDefect = _.toNumber(numberWithoutSpaces(_.get(find, 'defect')))
        const amountDiff = inputAmount - balance
        const defectDiff = inputDefect - defects
        return {
            id,
            title,
            measurement,
            amount: inputAmount,
            defect: inputDefect,
            amountDiff: amountDiff > ZERO ? '+' + amountDiff : amountDiff,
            defectDiff: defectDiff > ZERO ? '+' + defectDiff : defectDiff
        }
    }), item => _.get(item, 'amount') > ZERO || _.get(item, 'defect') > ZERO)

    return (
        <div className={classes.dialog}>
            <div className={classes.content}>
                <header>
                    <span>Инвентаризация товаров</span>
                    <IconButton
                        onTouchTap={() => { closeDialog(false) }}>
                        <CloseIcon color={'#666'}/>
                    </IconButton>
                </header>
                <section>
                    <Row className="dottedList">
                        <Col xs={6}>{t('Товар')}</Col>
                        <Col xs={3}>{t('Кол-во')}</Col>
                        <Col xs={3}>{t('Разница')}</Col>
                    </Row>
                    {_.map(items, (item) => {
                        return (
                            <Row key={item.id} className="dottedList">
                                <Col xs={6}>{item.title}</Col>
                                <Col xs={3}>
                                    <Tooltip position={'left'} text={t('ОК / Брак')}>
                                        {item.amount} / {item.defect} {item.measurement}
                                    </Tooltip>
                                </Col>
                                <Col xs={3}>
                                    <Tooltip position={'left'} text={t('ОК / Брак')}>
                                        {item.amountDiff} / {item.defectDiff} {item.measurement}
                                    </Tooltip>
                                </Col>
                            </Row>
                        )
                    })}
                </section>
                <footer>
                    <FlatButton
                        label={t('Сохранить')}
                        onTouchTap={() => { submitDialog(items, closeDialog) }}
                        className={classes.actionButton}/>
                </footer>
            </div>
        </div>
    )
})

export default InventoryOverallDialog
