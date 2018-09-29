import PropTypes from 'prop-types'

const defaultsPropTypes = {
  loading: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default defaultsPropTypes

