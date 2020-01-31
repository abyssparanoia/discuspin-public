import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// sample theme
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    // primary: {
    //   light: '#757ce8',
    //   main: '#282c34',
    //   dark: '#002884',
    //   contrastText: '#fff'
    // },
    // secondary: {
    //   light: '#ff7961',
    //   main: '#f44336',
    //   dark: '#ba000d',
    //   contrastText: '#000'
    // },
    error: {
      main: red.A400
    }
  }
})

export default theme
