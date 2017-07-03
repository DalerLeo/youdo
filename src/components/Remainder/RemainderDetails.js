import React from 'react'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'
import ArrowLeftIcon from './ArrowLeftIcon'
import ArrowRightIcon from './ArrowRightIcon'

const colorBlue = '#12aaeb !important'
const enhance = compose(
    injectSheet({
        dottedList: {
            padding: '20px 0'
        },
        wrapper: {
            color: '#333 !important',
            borderTop: '1px #efefef solid',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 30px',
            paddingBottom: '20px',
            '& a': {
                color: colorBlue
            }
        },
        loader: {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
        },
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '15px 0',
            fontWeight: '700',
            borderBottom: '1px #efefef solid'

        },
        content: {
            width: '100%',
            overflow: 'hidden',
            '& > .row': {
                overflowY: 'auto',
                overflowX: 'hidden',
                margin: '0 -0.5rem'
            },
            '& > .row:first-child': {
                fontWeight: '600',
                lineHeight: '20px'
            }
        }

    }),
    withState('openDetails', 'setOpenDetails', false)
)

const iconStyle = {
    icon: {
        color: 'rgba(0, 0, 0, 0.56)',
        width: 20,
        height: 20
    },
    button: {
        width: 20,
        height: 20,
        padding: 0
    }
}

const RemainderDetails = enhance((props) => {
    const {classes} = props

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <div className={classes.titleLabel}>Парти товаров</div>
                <div className={classes.gridPagination}>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}>
                        <ArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        iconStyle={iconStyle.icon}
                        style={iconStyle.button}>
                        <ArrowRightIcon />
                    </IconButton>
                </div>
            </div>
            <div className={classes.content}>
                <Row className='dottedList'>
                    <Col xs={3}>Код</Col>
                    <Col style={{textAlign: 'center'}} xs={3}>Дата приемки</Col>
                    <Col xs={3}>Срок годности</Col>
                    <Col xs={2}>Кол-во</Col>
                    <Col xs={1}>Статус</Col>
                </Row>
                <Row className='dottedList'>
                    <Col xs={3}>Z857OA458795215ZAR</Col>
                    <Col style={{textAlign: 'center'}} xs={3}>25 Сен, 2015</Col>
                    <Col xs={3}>25 Сен, 2015</Col>
                    <Col xs={2}>100 шт</Col>
                    <Col xs={1}>Ok</Col>
                </Row>

            </div>

        </div>
    )
})

RemainderDetails.propTypes = {

}

export default RemainderDetails
