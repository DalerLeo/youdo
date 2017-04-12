import React from 'react'
import injectJSS from 'react-jss'
import SingInLayout from '../../components/SingInLayout'
import Container from '../../components/Container'

const NotFound = ({classes}) => {
    return (
        <SingInLayout>
            <Container className={classes.wrapper}>
                <h1 className={classes.content}>
                    404 <br/>
                    Page not found
                </h1>
            </Container>
        </SingInLayout>
    )
}

export default injectJSS({
    wrapper: {
        height: '100%',
        display: 'flex !important',
        justifyContent: 'center',
        flexDirection: 'column'
    },

    content: {
        textAlign: 'center'
    }
})(NotFound)
