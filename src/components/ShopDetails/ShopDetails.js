import React from 'react'
import {compose} from 'recompose'
import injectSheet from 'react-jss'
import CircularProgress from 'material-ui/CircularProgress'

import ShopDetailsTab from '../ShopDetailsTab'
import ShopDetailsInfo from '../ShopDetailsInfo'

const enhance = compose(
    injectSheet({
        wrapper: {
            width: '100%',
            display: 'flex'
        },
        loader: {
            width: '100%',
            background: '#fff',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)
const ShopDetails = enhance((props) => {
    const {classes, loading, data, tabData} = props

    if (loading) {
        return (
            <div className={classes.loader}>
                <div>
                    <CircularProgress size={100} thickness={6} />
                </div>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            <ShopDetailsInfo data={data}></ShopDetailsInfo>
            <ShopDetailsTab tabData={tabData} data={data}></ShopDetailsTab>
        </div>
    )
})


ShopDetails.propTypes = {
    data: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired,
    tabData: React.PropTypes.shape({
        tab: React.PropTypes.string.isRequired,
        handleTabChange: React.PropTypes.func.isRequired
    })

}

export default ShopDetails

