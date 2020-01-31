import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
// import Link from 'next/link'
import { Link } from 'src/components/atoms'
import { Credential } from 'src/firebase/interface'
import { ModalUserEdit } from './ModalUserEdit'
import { useDispatch } from 'react-redux'
import { unsetImage } from 'src/modules/user'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  menu: {
    width: '300px'
  },
  menuItem: {
    padding: `${theme.spacing(2)}px !important`
  }
}))

interface Props {
  credential?: Credential
  handleSignOut: () => void
}

export const MenuAppBar = ({ credential, handleSignOut }: Props) => {
  const classes = useStyles({})
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | undefined>(undefined)
  const [openUserModal, setOpenUserModal] = useState<boolean>(false)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const handleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => setAnchorEl(e.currentTarget)

  const handleClose = () => setAnchorEl(undefined)

  const handleOpenUserModal = () => setOpenUserModal(true)
  const handleCloseUserModal = () => {
    setOpenUserModal(false)
    dispatch(unsetImage())
  }

  return (
    <div className={classes.root}>
      <ModalUserEdit open={openUserModal} closeHandler={handleCloseUserModal} />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link href="/">Discusspin</Link>{' '}
          </Typography>
          {credential && (
            <div>
              <IconButton
                aria-label="Account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                className={classes.menu}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem className={classes.menuItem} onClick={handleSignOut}>
                  サインアウト
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={handleOpenUserModal}>
                  ユーザー編集
                </MenuItem>
              </Menu>
            </div>
          )}
          {!credential && <Link href="/sign_in">SignIn</Link>}
        </Toolbar>
      </AppBar>
    </div>
  )
}
