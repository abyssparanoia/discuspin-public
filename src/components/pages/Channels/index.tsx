import * as React from "react";
import WithAuthorization from "../../hoc/withAuthorization";
import { Grid, Theme, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/core/styles";
import ChannelList from "../../../containers/ChannelList";
import ThreadList from "../../../containers/ThreadList";
import { RouteComponentProps, withRouter } from "react-router-dom";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100%",
      flexGrow: 1,
      backgroundColor: theme.palette.background.default
    }
  });

type Props = {} & WithStyles<typeof styles> &
  RouteComponentProps<{ channelID: string }>;

class Channel extends React.Component<Props> {
  public render() {
    const { classes } = this.props;
    const { channelID } = this.props.match.params;
    return (
      <Grid container className={classes.root}>
        <ChannelList channelID={channelID} />
        <ThreadList channelID={channelID} />
      </Grid>
    );
  }
}

export default WithAuthorization(withStyles(styles)(withRouter(Channel)));
