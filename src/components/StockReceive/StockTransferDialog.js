import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import {Row, Col} from 'react-flexbox-grid'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import getConfig from '../../helpers/getConfig'

const enhance = compose(
    injectSheet({
        loader: {
            width: '100%',
            height: '400px',
            background: '#fff',
            alignItems: 'center',
            zIndex: '999',
            justifyContent: 'center',
            display: 'flex'
        },
        dialog: {
            overflowY: 'auto !important',
            '& > div:first-child > div:first-child': {
                transform: 'translate(0px, 0px) !important'
            }
        },
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            maxHeight: 'none !important',
            marginBottom: '64px'
        },
        content: {
            width: '100%',
            display: 'block',
            '& > div': {
                width: 'auto',
                border: 'none',
                padding: '0',
                maxHeight: '573px',
                '& > div > div:last-child > div > div:first-child': {
                    maxHeight: '465px',
                    overflowY: 'auto',
                    margin: '0 -30px',
                    padding: '0 30px'
                },
                '& > div > div:last-child > div > div:last-child': {
                    padding: '0'
                }
            }
        },
        titleSummary: {
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between'
        },
        downBlock: {
            padding: '20px 30px',
            '& .row': {
                lineHeight: '35px',
                padding: '0 10px',
                display: 'flex',
                justifyContent: 'space-between',
                '& > div:last-child': {
                    textAlign: 'right',
                    fontWeight: '600'
                }
            },
            '& .row:last-child': {
                fontWeight: '600',
                borderTop: '1px #efefef solid'
            }
        },
        subTitle: {
            paddingBottom: '8px',
            fontStyle: 'italic',
            fontWeight: '400'
        },
        titleContent: {
            background: '#fff',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #efefef',
            padding: '0 30px',
            height: '59px',
            zIndex: '999',
            '& button': {
                right: '13px',
                position: 'absolute !important'
            },
            '& div': {
                display: 'flex',
                alignItems: 'center'
            },
            '& .personImage': {
                borderRadius: '50%',
                overflow: 'hidden',
                flexBasis: '35px',
                height: '35px',
                minWidth: '30px',
                width: '35px',
                marginRight: '10px',
                '& img': {
                    display: 'flex',
                    height: '100%',
                    width: '100%'
                }
            }
        },
        tableWrapper: {
            padding: '0 30px',
            maxHeight: '424px',
            overflowY: 'auto',
            '& .row': {
                '&:first-child': {
                    fontWeight: '600'
                }
            },
            '& .dottedList': {
                padding: '15px 0',
                '& > div:last-child': {
                    textAlign: 'right'
                },
                '&:last-child:after': {
                    display: 'none'
                }
            }
        }
    }),
)

const StockTransferDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        data,
        loading
    } = props

    const primaryCurrency = getConfig('PRIMARY_CURRENCY')
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '500px'} : {width: '1000px', maxWidth: 'unset'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            <div className={classes.titleContent}>
                <span>Движения товаров</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            {loading ? <div className={classes.loader}>
                    <CircularProgress/>
                </div>
                : _.map(data, (item) => {
                    const clientName = _.get(item, ['client', 'name'])
                    const marketName = _.get(item, ['market', 'name'])
                    const currency = _.get(item, ['currency', 'name'])
                    const order = _.get(item, ['order'])
                    const customRate = _.get(item, ['customRate'])
                    const internal = _.get(item, 'internal')
                    const amount = _.get(item, ['amount'])
                    return (
                        <Row key={_.get(item, 'id')} className={classes.detailsRow}>
                            <Col xs={4}>{clientName}</Col>
                            <Col xs={3}>{marketName}</Col>
                            <Col xs={3}>{order}</Col>
                            <Col xs={3}>{amount} {currency} {currency !== primaryCurrency && customRate ? '(internal ' + customRate + ' ' + primaryCurrency + ')'
                                : (!customRate ? '(internal ' + (amount / internal) + ' ' + primaryCurrency + ')' : null) }</Col>
                        </Row>

                    )
                })}
        </Dialog>
    )
})

StockTransferDialog.propTyeps = {
    filter: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    detailData: PropTypes.object
}

export default StockTransferDialog