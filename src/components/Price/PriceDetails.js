import React from 'react'
import moment from 'moment'
import {compose, withState} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'
import Edit from 'material-ui/svg-icons/image/edit'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import {Row, Col} from 'react-flexbox-grid'

const colorBlue = '#12aaeb !important'

const enhance = compose(
    injectSheet({
        title: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '65px',
            padding: '0 30px',
            borderBottom: '1px #efefef solid'
        },
        titleLabel: {
            fontSize: '18px',
            color: '#333',
            fontWeight: '700',
            cursor: 'pointer'
        },
        titleButtons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        bodyTitle: {
            fontWeight: '600',
            marginBottom: '10px'
        },
        container: {
            display: 'flex',
            width: '100%'

        },
        detailBody: {
            padding: '0 30px'
        },
        sides: {
            flexBasis: '27%'
        },
        leftSide:{

            flexBasis: '35%'
        },
        rightSide: {
            flexBasis: '65%'
        }
    })
)

const PriceDetails = enhance((props) => {
    const {
        classes
    } = props
    return (<div>
        <div className={classes.title}>
            <div className={classes.titleLabel}>Stiralniy poroshek Mif</div>
        </div>
        <div className={classes.container}>
            <div className={classes.detailBody}>
                <div className={classes.left}>LEFTside
                    <div className={classes.bodyTitle}>Sebestoimost tovara</div>
                </div>
                <div className={classes.rightSide}>
                    <div className={classes.bodyTitle}>Formiravaniya sen</div>
                </div>

                asddasdas
            </div>

        </div>

    </div>)
})

export default PriceDetails
