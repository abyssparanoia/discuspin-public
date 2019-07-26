import { AppState } from "../../modules/reducer";
import { Push } from "connected-react-router";
import React from "react";
import * as routes from "../../constants/routes";
import {
  Paper,
  Typography,
  createStyles,
  WithStyles,
  Theme,
  withStyles,
  CssBaseline,
  Avatar
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/LockOutlined";
import GoogleButton from "react-google-button";

const styles = (theme: Theme) =>
  createStyles({
    main: {
      width: "auto",
      display: "block", // Fix IE 11 issue.
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(6))]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    paper: {
      marginTop: theme.spacing(16),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing(5)}px ${theme.spacing(3)}px ${theme.spacing(
        5
      )}px`
    },
    space: {
      height: 50
    },
    avatar: {
      margin: theme.spacing(2),
      backgroundColor: theme.palette.secondary.main
    }
  });

export interface Redux {
  auth: AppState["auth"];
}

export interface Handler {
  signIn: () => void;
  push: Push;
}

type Props = Redux & Handler & WithStyles<typeof styles>;

export default withStyles(styles)(
  class extends React.PureComponent<Props> {
    componentDidUpdate(prevProps: Props) {
      const { isLoadingSignIn, authUser } = this.props.auth;
      if (prevProps.auth.isLoadingSignIn && !isLoadingSignIn && !!authUser) {
        this.props.push(routes.HOME);
      }
    }

    render() {
      const { classes, signIn } = this.props;

      return (
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <div className={classes.space} />
            <GoogleButton onClick={signIn} />
          </Paper>
        </main>
      );
    }
  }
);
