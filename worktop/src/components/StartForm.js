import React from 'react'
import validation from 'react-validation-mixin'
import compose from 'recompose/compose'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui-pickers/DatePicker'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import ArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft'
import ArrowRightIcon from 'material-ui-icons/KeyboardArrowRight'

import { jsonrpc, RegionPicker } from 'homemaster-jslib'
import PaperPlaneIcon from 'homemaster-jslib/svg-icons/PaperPlane'

import { strategy, ValidatedForm } from 'form'

const styles = {
  root: {
    maxWidth: 700,
    padding: 16
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  submitButton: {
    marginTop: 12,
    width: '50%'
  },
  buttonRow: {
    textAlign: 'center'
  },
  buttonIcon: {
    marginRight: 10
  }
}

class StartForm extends ValidatedForm {
  state = {
    values: {
      orderId: '',
      storeId: '',
      customerName: '',
      customerMobile: '',
      regionCode: null,
      street: '',
      measureDate: null,
      installDate: null,
      installFaucet: false,
      installSink: false
    }
  }

  // TODO: check unique orderId
  validatorTypes = strategy.createInactiveSchema(
    {
      orderId: 'required|size:9',
      storeId: 'required|size:3',
      customerName: 'required',
      customerMobile: 'required|mobile',
      measureDate: 'required',
      installDate: 'required',
      regionCode: 'required',
      street: 'required'
    },
    {
      'required.orderId': '宜家订单号必须输入',
      'size.orderId': '宜家订单号长度为9',
      'required.storeId': '宜家商场号必须输入',
      'size.storeId': '宜家商场号长度为3',
      'required.customerName': '顾客名称必须输入',
      'required.customerMobile': '顾客手机必须输入',
      'required.measureDate': '测量日期必须输入',
      'required.installDate': '安装日期必须输入',
      'required.street': '详细地址必须输入',
      'required.regionCode': '所在地区必须输入'
    }
  )

  handleSubmit = () => {
    this.props.validate(error => {
      if (!error) {
        console.log(this.state.values)
      }
    })
  }

  render = () => {
    const { classes } = this.props
    const { values } = this.state

    return (
      <Paper className={classes.root}>
        <Grid container justify="space-between">
          <Grid item xs={5}>
            <TextField
              name="orderId"
              required
              fullWidth
              margin="normal"
              label="宜家订单号"
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{ classes: { input: classes.orderId } }}
              value={values.orderId}
              onBlur={this.activateValidation}
              onChange={e => {
                var { value } = e.target
                if (/^\d{0,9}$/.test(value) || !value) {
                  this.setState(
                    { values: { ...values, orderId: value } },
                    this.props.handleValidation('orderId')
                  )
                }
              }}
              error={!!this.getFieldError('orderId')}
              helperText={this.getFieldError('orderId')}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              name="storeId"
              required
              fullWidth
              margin="normal"
              label="宜家商场号"
              InputLabelProps={{
                shrink: true
              }}
              value={values.storeId}
              onBlur={this.activateValidation}
              onChange={e => {
                var { value } = e.target
                if (/^\d{0,3}$/.test(value) || !value) {
                  this.setState(
                    { values: { ...values, storeId: value } },
                    this.props.handleValidation('storeId')
                  )
                }
              }}
              error={!!this.getFieldError('storeId')}
              helperText={this.getFieldError('storeId')}
            />
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={24}>
          <Grid item xs={6}>
            <TextField
              name="customerName"
              required
              margin="normal"
              fullWidth
              label="顾客姓名"
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.handleChange('customerName')}
              error={!!this.getFieldError('customerName')}
              helperText={this.getFieldError('customerName')}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="customerMobile"
              required
              margin="normal"
              fullWidth
              label="顾客手机"
              value={values.customerMobile}
              InputLabelProps={{
                shrink: true
              }}
              onBlur={this.activateValidation}
              onChange={e => {
                var { value } = e.target
                // allow only numbers and max 11
                if (/^1\d{0,10}$/.test(value) || !value) {
                  this.setState(
                    { values: { ...values, customerMobile: value } },
                    this.props.handleValidation('customerMobile')
                  )
                }
              }}
              error={!!this.getFieldError('customerMobile')}
              helperText={this.getFieldError('customerMobile')}
            />
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={24}>
          <Grid item xs={6}>
            <DatePicker
              label="测量日期"
              required
              fullWidth
              autoOk
              name="measureDate"
              InputLabelProps={{
                shrink: true
              }}
              disablePast
              maxDate={values.installDate ? addDays(values.installDate, -7) : '2100-01-01'}
              leftArrowIcon={<ArrowLeftIcon />}
              rightArrowIcon={<ArrowRightIcon />}
              value={values.measureDate}
              labelFunc={date => (date ? format(date, 'YYYY/MM/DD') : '')}
              onChange={date =>
                this.handleChange('measureDate')({
                  target: {
                    value: date
                  }
                })
              }
              error={!!this.getFieldError('measureDate')}
              helperText={this.getFieldError('measureDate')}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              label="安装日期"
              required
              fullWidth
              autoOk
              name="installDate"
              InputLabelProps={{
                shrink: true
              }}
              leftArrowIcon={<ArrowLeftIcon />}
              rightArrowIcon={<ArrowRightIcon />}
              value={values.installDate}
              minDate={addDays(values.measureDate || new Date(), 7)}
              labelFunc={date => (date ? format(date, 'YYYY/MM/DD') : '')}
              onChange={date =>
                this.handleChange('installDate')({
                  target: {
                    value: date
                  }
                })
              }
              error={!!this.getFieldError('installDate')}
              helperText={this.getFieldError('installDate')}
            />
          </Grid>
        </Grid>

        <RegionPicker
          name="regionCode"
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          label="所在地区"
          value={values.regionCode}
          preSelect={310100}
          onBlur={this.activateValidation}
          onChange={this.handleChange('regionCode')}
          error={!!this.getFieldError('regionCode')}
          helperText={this.getFieldError('regionCode')}
        />

        <TextField
          name="street"
          required
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
          label="详细地址"
          onBlur={this.activateValidation}
          onChange={this.handleChange('street')}
          error={!!this.getFieldError('street')}
          helperText={this.getFieldError('street')}
        />

        <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.installFaucet}
              onChange={this.handleChange('installFaucet')}
              value="installFaucet"
            />
          }
          label="Secondary"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.installSink}
              onChange={this.handleChange('installSink')}
              value="installSink"
              color="primary"
            />
          }
          label="Primary"
        />
        </FormGroup>
        <div className={classes.buttonRow}>
          <Button
            variant="raised"
            color="primary"
            className={classes.submitButton}
            onClick={this.handleSubmit}
          >
            <PaperPlaneIcon className={classes.buttonIcon} />提交订单
          </Button>
        </div>
      </Paper>
    )
  }
}

// validation should come after withStyles
export default compose(withStyles(styles), validation(strategy))(StartForm)
