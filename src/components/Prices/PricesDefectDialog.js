import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import {compose, withReducer} from 'recompose'
import injectSheet from 'react-jss'
import Dialog from 'material-ui/Dialog'
import {Row, Col} from 'react-flexbox-grid'
import CircularProgress from 'material-ui/CircularProgress'
import IconButton from 'material-ui/IconButton'
import numberFormat from '../../helpers/numberFormat'
import CloseIcon2 from '../CloseIcon2'
import MainStyles from '../Styles/MainStyles'

const enhance = compose(
    injectSheet(_.merge(MainStyles, {
        defect: {
            padding: '10px 0',
            width: '100%',
            '& .row:first-child': {
                fontWeight: '600',
                padding: '20px 0',
                position: 'relative'
            },
            '& .row': {
                padding: '10px 0',
                position: 'static',
                '& > div:last-child': {
                    textAlign: 'right'
                }
            },
            '& img': {
                display: 'block',
                marginLeft: 'auto',
                width: '50px'
            }
        },
        bigImage: {
            background: '#eee',
            position: 'absolute',
            top: '-59px',
            left: '0',
            width: '100%',
            height: '100%'
        }
    })),
    withReducer('state', 'dispatch', (state, action) => {
        return {...state, ...action}
    }, {open: false}),
)

const customContentStyle = {
    width: '600px',
    maxWidth: 'none'
}
const PricesDefectDialog = enhance((props) => {
    const {open, onClose, classes, defectData} = props
    const defectItems = _.map(defectData, (item) => {
        const amount = numberFormat(_.get(item, 'amount'))
        const barcode = _.get(item, 'barcode')
        const comment = _.get(item, 'comment')
        const imgURL = _.get(item, ['image', 'file'])
        const measurement = _.get(item, ['measurement', 'name'])

        return (
            <Row key={barcode} className="dottedList">
                <Col xs={2}>{barcode}</Col>
                <Col xs={2}>{amount} {measurement}</Col>
                <Col xs={6}>{comment}</Col>
                <Col xs={2}><img src={imgURL} alt=""/></Col>
            </Row>
        )
    })

    return (
        <Dialog
            modal={true}
            contentStyle={customContentStyle}
            open={open}
            onRequestClose={onClose}
            bodyClassName={classes.popUp}
            autoScrollBodyContent={true}>
            <div className={classes.titleContent}>
                <span>Бракованные товараы</span>
                <IconButton onTouchTap={onClose}>
                    <CloseIcon2 color="#666666"/>
                </IconButton>
            </div>
            <div className={classes.bodyContent}>
                <div className={classes.loader}>
                    <CircularProgress size={40} thickness={4}/>
                </div>
                <div className={classes.innerWrap}>
                    <div className={classes.inContent} style={{minHeight: '350px', position: 'relative'}}>
                        <div className={classes.defect}>
                            <Row className="dottedList">
                                <Col xs={2}>Баркод</Col>
                                <Col xs={2}>Кол-во</Col>
                                <Col xs={6}>Комментарий</Col>
                                <Col xs={2}></Col>
                            </Row>
                            {defectItems}
                        </div>
                        <div className={classes.bigImage}>

                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
})
PricesDefectDialog.propTyeps = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    defectData: PropTypes.object
}
export default PricesDefectDialog
