import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List from 'material-ui/List'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ExitToAppIcon from 'material-ui-icons/ExitToApp'
import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline'
import SearchIcon from 'material-ui-icons/Search'

import TaskListIcon from 'homemaster-jslib/svg-icons/TaskList'
import StartForm from './StartForm'

const drawerWidth = 180

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 26
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 9
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default
  },
  content: {
    flexGrow: 1
  },
  listItemText: {
    whiteSpace: 'nowrap'
  }
})

class AppFrame extends React.Component {
  state = {
    open: true
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props

    let MenuItem = props => (
      <ListItem button>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText className={classes.listItemText} primary={props.text} />
      </ListItem>
    )

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              IKEA Worktop Process Control
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            )
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <MenuItem icon={<AddCircleOutlineIcon />} text="新增订单" />
            <MenuItem icon={<TaskListIcon />} text="我的任务" />
            <MenuItem icon={<SearchIcon />} text="订单查询" />
            <MenuItem icon={<ExitToAppIcon />} text="退出登录" />
          </List>
        </Drawer>
        <main className={classes.main}>
          <div className={classes.toolbar} />
          <div className={classes.content}>
            <StartForm />
          </div>
        </main>
      </div>
    )
  }
}

AppFrame.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AppFrame)
