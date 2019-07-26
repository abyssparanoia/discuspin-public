import * as React from "react";
import WithAuthorization from "../hoc/withAuthorization";
import { Grid, Theme, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import ChannelList from "../../containers/ChannelList";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100%",
      flexGrow: 1,
      backgroundColor: theme.palette.background.default
    }
  });

type Props = {} & WithStyles<typeof styles>;

class Home extends React.Component<Props> {
  public render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root}>
        <ChannelList />
      </Grid>
    );
  }
}

const home = withStyles(styles)(Home);

export default WithAuthorization(home);
