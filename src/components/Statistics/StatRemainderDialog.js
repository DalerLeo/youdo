import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import CloseIcon2 from '../CloseIcon2'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import {Row, Col} from 'react-flexbox-grid'
import Pagination from '../GridList/GridListNavPagination'
import dateFormat from '../../helpers/dateFormat'
import numberFormat from '../../helpers/numberFormat'

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
        popUp: {
            color: '#333 !important',
            overflowY: 'hidden !important',
            fontSize: '13px !important',
            position: 'relative',
            padding: '0 !important',
            overflowX: 'hidden',
            height: '100%'
        },
        content: {
            width: '100%',
            display: 'block',
            '& > div:last-child': {
                padding: '0 30px',
                borderTop: '1px #efefef solid'
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

const StatRemainderDialog = enhance((props) => {
    const {
        open,
        onClose,
        classes,
        detailData,
        filterItem
    } = props

    const loading = _.get(detailData, 'detailLoading')
    const agentName = _.get(detailData, ['rowDetail', '0', 'title'])
    const measurement = _.get(detailData, ['rowDetail', '0', 'measurement', 'name'])

    const remainderList = _.map(_.get(detailData, ['data', 'results']), (item) => {
        const balance = numberFormat(_.get(item, ['balance']), measurement)
        const barcode = _.get(item, 'barcode')
        const createdDate = dateFormat(_.get(item, 'createdDate'))
        const isDefect = _.get(item, 'isDefect') ? 'Брак' : 'OK'

        return (
            <Row key={barcode} className="dottedList">
                <Col xs={3}>{barcode}</Col>
                <Col xs={4}>{createdDate}</Col>
                <Col xs={3}>{balance}</Col>
                <Col xs={2} style={{textAlign: 'left'}}>{isDefect}</Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            open={open}
            onRequestClose={onClose}
            className={classes.dialog}
            contentStyle={loading ? {width: '400px'} : {width: '700px'}}
            bodyStyle={{minHeight: 'auto'}}
            bodyClassName={classes.popUp}>
            {loading ? <div className={classes.loader}>
                <CircularProgress/>
            </div>
                : <div>
                    <div className={classes.titleContent}>
                        <div>{agentName}</div>
                        <IconButton onTouchTap={onClose}>
                            <CloseIcon2 color="#666666"/>
                        </IconButton>
                    </div>
                    <div className={classes.content}>
                        <div className={classes.tableWrapper}>
                            <Row className="dottedList">
                                <Col xs={3}>Код</Col>
                                <Col xs={4}>Дата приемки</Col>
                                <Col xs={3}>Кол-во</Col>
                                <Col xs={2} style={{textAlign: 'left'}}>Статус</Col>
                            </Row>
                            {remainderList}
                        </div>
                        <Pagination filter={filterItem}/>
                    </div>
                </div>}
        </Dialog>
    )
})

StatRemainderDialog.propTyeps = {
    filterItem: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool
}

export default StatRemainderDialog
