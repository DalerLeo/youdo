import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import ArrowDownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import ArrowUpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import Pagination from '../GridList/GridListNavPagination'
import {Row} from 'react-flexbox-grid'

const enhance = compose(
    injectSheet({
        loader: {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            background: '#fff'
        },
        dialog: {
            padding: '0!important',
            '& .row': {
                alignItems: 'center',
                '& > div': {
                    lineHeight: '50px'
                }
            }
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: '50px',
            fontWeight: '600',
            borderBottom: '1px #efefef solid',
            margin: '0',
            boxSizing: 'border-box',
            padding: '0 30px'

        },
        content: {
            width: '100%',
            padding: '0 30px',
            boxSizing: 'border-box',
            '& > .row': {
                margin: '0',
                padding: '0',
                '& > div': {
                },
                '& > div:first-child': {
                    display: 'flex',
                    '& > svg': {
                        width: '20px !important',
                        height: '20px !important'
                    }
                }
            },
            '& > .row:first-child': {
                fontWeight: '600',
                lineHeight: '20px',
                borderBottom: 'solid 1px #efefef'
            },
            '& .dottedList:last-child:after': {
                content: '""',
                backgroundImage: 'none'
            }
        },
        infoBlock: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: '70px',
            fontWeight: '600',
            borderBottom: '1px #efefef solid',
            margin: '0',
            boxSizing: 'border-box',
            padding: '0 30px'
        },
        info: {
            display: 'flex',
            width: '45%',
            justifyContent: 'space-between',
            '& span': {
                fontWeight: '500'
            }
        }

    })
)

const iconStyle = {
    icon: {
        color: '#666666',
        width: 24,
        height: 24,
        lineHeight: 'normal'
    },
    button: {
        width: 48,
        height: 48,
        '& > div': {
            lineHeight: 'none'
        }
    }
}

const ClientBalanceCreateDialog = enhance((props) => {
    const {open, loading, filter, onClose, classes} = props
    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            contentStyle={loading ? {width: '1000px'} : {width: '1000px', minWidth: 'auto', maxWidth: 'auto'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.dialog}>
                <Row className={classes.title}>
                    <div>ИНФОРМАЦИЯ ПО БОЛАНСУ КЛИЕНТА</div>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}
                        onTouchTap={onClose}>
                        <CloseIcon2/>
                    </IconButton>
                </Row>
                <div className={classes.infoBlock}>
                    <div className={classes.info}>
                        <div>
                            <span>Клиент</span>
                            <div>ООО Наименование клиента</div>
                        </div>
                        <div>
                            <span>Баланс</span>
                            <div>- 800 000 UZS</div>
                        </div>
                    </div>
                    <Pagination filter={filter}/>
                </div>
                <div className={classes.content}>
                    <Row>
                        <div style={{flexBasis: '5%', maxWidth: '5%'}}></div>
                        <div style={{flexBasis: '25%', maxWidth: '25%'}}>Транзакция / Заказ</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%'}}>Дата</div>
                        <div style={{flexBasis: '40%', maxWidth: '40%'}}>Описание</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>Сумма</div>
                    </Row>
                    <Row className='dottedList'>
                        <div style={{flexBasis: '5%', maxWidth: '5%'}}><ArrowDownIcon/></div>
                        <div style={{flexBasis: '25%', maxWidth: '25%'}}>Z-123122</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%'}}>2017-02-10</div>
                        <div style={{flexBasis: '40%', maxWidth: '40%'}}>В какой магазин и на какую сумму заказ</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>1 000 000 UZS</div>
                    </Row>
                    <Row className='dottedList'>
                        <div style={{flexBasis: '5%', maxWidth: '5%'}}><ArrowUpIcon/></div>
                        <div style={{flexBasis: '25%', maxWidth: '25%'}}>Z-123122</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%'}}>2017-02-10</div>
                        <div style={{flexBasis: '40%', maxWidth: '40%'}}>В какой магазин и на какую сумму заказ</div>
                        <div style={{flexBasis: '15%', maxWidth: '15%', textAlign: 'right'}}>1 000 000 UZS</div>
                    </Row>
                </div>
        </Dialog>
    )
})

ClientBalanceCreateDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default ClientBalanceCreateDialog
