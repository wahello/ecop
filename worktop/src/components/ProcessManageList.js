import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import dateFormat from 'date-fns/format'

import { withStyles } from 'material-ui/styles'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from 'material-ui/Table'
import { searchProcess } from 'model/actions'

const styles = {
  rowNumber: {
    textAlign: 'center'
  }
}

const columns = [
  { id: 'rowNumber', disablePadding: true, label: '' },
  { id: 'externalOrderId', disablePadding: true, label: '订单号' },
  { id: 'storeId', disablePadding: true, label: '商场号' },
  { id: 'customerName', disablePadding: false, label: '顾客姓名' },
  { id: 'customerRegionName', disablePadding: false, label: '顾客地区' },
  { id: 'startTime', disablePadding: false, label: '发起时间' },
  { id: 'confirmedMeasurementDate', disablePadding: false, label: '测量日期' },
  { id: 'confirmedInstallationDate', disablePadding: false, label: '安装日期' },
  { id: 'status', disablePadding: false, label: '状态' }
]

class EnhancedTableHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { order, orderBy } = this.props

    return (
      <TableHead>
        <TableRow>
          {columns.map(column => {
            return (
              <TableCell
                key={column.id}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            )
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
}

class ProcessManageList extends Component {
  state = {
    data: [],
    order: 'desc',
    orderBy: 'startTime'
  }

  componentWillReceiveProps = nextProps => {
    // make a copy of the process data
    if (this.props.processes !== nextProps.processese) {
      this.setState({ data: nextProps.processes.slice() })
    }
  }

  componentDidMount = () => {
    this.refresh()
  }

  refresh = () => {
    this.props.dispatch(searchProcess())
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    const data =
      order === 'desc'
        ? this.state.data.sort(
            (a, b) =>
              b[orderBy] < a[orderBy] || b[orderBy] === undefined ? -1 : 1
          )
        : this.state.data.sort((a, b) => {
            return a[orderBy] < b[orderBy] || b[orderBy] === undefined ? -1 : 1
          })

    this.setState({ data, order, orderBy })
  }

  render() {
    const { classes } = this.props
    const { data, order, orderBy } = this.state

    return (
      <Table className={classes.table}>
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={this.handleRequestSort}
        />
        <TableBody>
          {data.map((p, idx) => (
            <TableRow hover tabIndex={-1} key={idx}>
              <TableCell className={classes.rowNumber} padding="none">
                {idx + 1}
              </TableCell>
              <TableCell padding="none">{p.externalOrderId}</TableCell>
              <TableCell padding="none">{p.storeId}</TableCell>
              <TableCell padding="none">{p.customerName}</TableCell>
              <TableCell padding="none">{p.customerRegionName}</TableCell>
              <TableCell>
                {dateFormat(p.startTime, 'YYYY/MM/DD HH:mm:ss')}
              </TableCell>
              <TableCell>
                {p.confirmedMeasurementDate
                  ? dateFormat(p.confirmedMeasurementDate, 'YYYY/MM/DD')
                  : ''}
              </TableCell>
              <TableCell>
                {p.confirmedInstallationDate
                  ? dateFormat(p.confirmedInstallationDate, 'YYYY/MM/DD')
                  : ''}
              </TableCell>
              <TableCell>{p.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}

ProcessManageList.propTypes = {
  /**
   * A list of camunda `process` objects in prop `processes`
   */
  processes: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = state => ({
  processes: state.process.processList
})

export default compose(connect(mapStateToProps), withStyles(styles))(
  ProcessManageList
)
