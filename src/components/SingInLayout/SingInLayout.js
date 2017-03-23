import React from 'react'
import Container from '../Container'

function DashboardLayout (props) {
    return (
        <Container>
            {props.children}
        </Container>
    )
}

export default DashboardLayout
