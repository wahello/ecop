import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import update from 'immutability-helper'

import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import green from 'material-ui/colors/green'
import PreviewIcon from '@material-ui/icons/RemoveRedEye'
import CancelIcon from '@material-ui/icons/Cancel'
import SearchIcon from '@material-ui/icons/Search'

import CheckboxBlankCircle from 'homemaster-jslib/svg-icons/CheckboxBlankCircle'

import { searchProcess } from 'model/actions'
import dateFormat from 'utils/date-fns'
import EnhancedTableHead from 'widget/TableHead'
import VariablesForm from './VariablesForm'
import { isValidOrderId } from 'utils/validators'

const toolbarStyles = theme => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    flexBasis: 170
  },
  cancelIcon: {
    width: 36,
    height: 36
  }
})

class SearchToolbar extends Component {
  state = {
    values: {
      orderId: ''
    }
  }

  handleSearch = () => {
    this.props.onSearch(this.state.values)
  }

  render() {
    const { values } = this.state
    const { classes } = this.props

    return (
      <Toolbar
        classes={{ root: classes.root }}
        onKeyDown={e => e.keyCode === 13 && this.handleSearch()}
      >
        <FormControl className={classNames(classes.margin, classes.textField)}>
          <InputLabel>订单号</InputLabel>
          <Input
            value={values.orderId}
            onChange={e => {
              var { value } = e.target
              if (!value || isValidOrderId(value, true)) {
                this.setState({
                  values: update(values, {
                    orderId: {
                      $set: value.toUpperCase()
                    }
                  })
                })
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  classes={{ root: classes.cancelIcon }}
                  onClick={() => {
                    this.setState({
                      values: update(values, {
                        orderId: {
                          $set: ''
                        }
                      })
                    })
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button variant="raised" color="primary" onClick={this.handleSearch}>
          <SearchIcon /> &nbsp;搜&nbsp;索
        </Button>
      </Toolbar>
    )
  }
}

SearchToolbar.propTypes = {
  onSearch: PropTypes.func.isRequired
}
SearchToolbar = withStyles(toolbarStyles)(SearchToolbar)

const listStyles = theme => ({
  rowNumber: {
    textAlign: 'center'
  },
  actual: {
    color: green[500]
  },
  confirmed: {
    color: theme.palette.primary.main
  },
  na: {
    color: theme.palette.secondary.main
  },
  legend: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  legendLabel: {
    verticalAlign: 'middle',
    marginLeft: '1em'
  },
  notfound: {
    padding: theme.spacing.unit * 2
  }
})

const statusName = {
  ACTIVE: '进行中',
  EXTERNALLY_TERMINATED: '已取消',
  COMPLETED: '已完成',
  INTERNALLY_TERMINATED: '已取消'
}

const columns = [
  { id: 'rowNumber', disablePadding: true, label: '' },
  { id: 'externalOrderId', disablePadding: true, label: '订单号' },
  { id: 'storeId', disablePadding: true, label: '商场号' },
  { id: 'customerName', disablePadding: false, label: '顾客姓名' },
  { id: 'customerRegionName', disablePadding: false, label: '顾客地区' },
  { id: 'startTime', disablePadding: false, label: '发起时间' },
  { id: 'actualMeasurementDate', disablePadding: false, label: '测量日期' },
  { id: 'shippingDate', disablePadding: false, label: '发货日期' },
  { id: 'receivingDate', disablePadding: false, label: '收货日期' },
  { id: 'actualInstallationDate', disablePadding: false, label: '安装日期' },
  { id: 'status', disablePadding: false, label: '状态' },
  { id: 'action', disablePadding: false }
]

class ProcessList extends Component {
  state = {
    order: 'desc',
    orderBy: 'startTime'
  }

  handleRequestSort = columnId => {
    const orderBy = columnId
    let order = 'desc'

    if (this.state.orderBy === columnId && this.state.order === 'desc') {
      order = 'asc'
    }
    if (order === 'desc') {
      this.props.data.sort(
        (a, b) => (b[orderBy] < a[orderBy] || b[orderBy] === undefined ? -1 : 1)
      )
    } else {
      this.props.data.sort((a, b) => {
        return a[orderBy] < b[orderBy] || b[orderBy] === undefined ? -1 : 1
      })
    }

    this.setState({ order, orderBy })
  }

  render() {
    const { classes, data } = this.props
    const { order, orderBy } = this.state

    if (data === undefined) return null

    if (data.length === 0) {
      return (
        <Typography variant="subheading" className={classes.notfound}>
          没有符合条件的订单
        </Typography>
      )
    } else {
      return (
        <Fragment>
          <Table>
            <EnhancedTableHead
              columns={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {data.map((p, idx) => {
                const measureDate =
                  p.actualMeasurementDate ||
                  p.confirmedMeasurementDate ||
                  p.scheduledMeasurementDate

                return (
                  <TableRow hover tabIndex={-1} key={idx}>
                    <TableCell className={classes.rowNumber} padding="none">
                      {idx + 1}
                    </TableCell>
                    <TableCell padding="none">{p.externalOrderId}</TableCell>
                    <TableCell padding="none">{p.storeId}</TableCell>
                    <TableCell padding="none">{p.customerName}</TableCell>
                    <TableCell padding="none">{p.customerRegionName}</TableCell>
                    <TableCell padding="none">
                      {dateFormat(p.startTime, 'YYYY/MM/DD HH:mm:ss')}
                    </TableCell>
                    <TableCell
                      className={
                        (p.actualMeasurementDate && classes.actual) ||
                        (p.confirmedMeasurementDate && classes.confirmed) ||
                        (!measureDate && classes.na) ||
                        null
                      }
                    >
                      {measureDate
                        ? dateFormat(measureDate, 'YYYY/MM/DD')
                        : '无需测量'}
                    </TableCell>
                    <TableCell>
                      {dateFormat(p.shippingDate, 'YYYY/MM/DD')}
                    </TableCell>
                    <TableCell>
                      {dateFormat(p.receivingDate, 'YYYY/MM/DD')}
                    </TableCell>
                    <TableCell
                      className={
                        (p.actualInstallationDate && classes.actual) ||
                        (p.confirmedInstallationDate && classes.confirmed)
                      }
                    >
                      {dateFormat(
                        p.actualInstallationDate ||
                          p.confirmedInstallationDate ||
                          p.scheduledInstallationDate,
                        'YYYY/MM/DD'
                      )}
                    </TableCell>
                    <TableCell>{statusName[p.state]}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          this.props.onProcessAction(p.id, 'view')
                        }}
                      >
                        <PreviewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <Typography variant="subheading" className={classes.legend}>
            <CheckboxBlankCircle className={classes.legendLabel} /> - 预约日期
            <CheckboxBlankCircle
              className={classNames(classes.legendLabel, classes.confirmed)}
            />{' '}
            - 确认日期
            <CheckboxBlankCircle
              className={classNames(classes.legendLabel, classes.actual)}
            />{' '}
            - 实际完成日期
          </Typography>
        </Fragment>
      )
    }
  }
}

ProcessList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * When user initiates an action for a process in the list, call this func
   * with the processInstanceId and the action name
   */
  onProcessAction: PropTypes.func.isRequired
}

ProcessList = withStyles(listStyles)(ProcessList)

class ProcessManager extends Component {
  state = {
    form: {
      open: false,
      processInstanceId: null
    }
  }

  componentDidMount = () => {
    this.doSearch()
  }

  doSearch = cond => {
    this.props.dispatch(searchProcess(cond))
  }

  openVariableForm = processInstanceId => {
    this.setState({
      form: {
        open: true,
        processInstanceId
      }
    })
  }

  render() {
    const { form } = this.state

    return (
      <Fragment>
        <Paper style={{ marginBottom: 16 }}>
          <SearchToolbar onSearch={cond => this.doSearch(cond)} />
        </Paper>
        <Paper>
          <ProcessList
            data={this.props.processes}
            onProcessAction={this.openVariableForm}
          />
        </Paper>

        <VariablesForm
          {...form}
          onClose={() => {
            this.setState({
              form: {
                open: false,
                processInstanceId: null
              }
            })
          }}
        />
      </Fragment>
    )
  }
}

ProcessManager.propTypes = {
  /**
   * A list of camunda `process` objects in prop `processes`
   */
  processes: PropTypes.arrayOf(PropTypes.object)
}

export default connect(state => ({
  processes: state.process.processList
}))(ProcessManager)