import React from 'react'

import { connectSearchBox } from 'react-instantsearch-dom'
import { SearchBoxProvided } from 'react-instantsearch-core'
import TextField from '@material-ui/core/TextField'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    textfield: {
      width: '100%',
      marginRight: '12px !important;'
    },
    form: {
      padding: '16px',
      backgroundColor: theme.palette.background.default,
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  })
)

const SearchBox = ({ currentRefinement, refine }: SearchBoxProvided) => {
  const classes = useStyles()
  return (
    <form className={classes.form} noValidate action="" role="search">
      <TextField
        id="standard-basic"
        label="Search"
        className={classes.textfield}
        value={currentRefinement}
        onChange={event => refine(event.currentTarget.value)}
      />
      <Button variant="contained" color="primary" onClick={() => refine('')}>
        reset
      </Button>
    </form>
  )
}

export const CustomSearchBox = connectSearchBox(SearchBox)
