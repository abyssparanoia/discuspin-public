import React from "react";

// material ui
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { createStyles, WithStyles, Tooltip, Fab } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { AppState } from "../../modules/reducer";

// router
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router-dom";

// user module
import ListItem from "../../components/molecules/ListItem";

// types
import { Channel } from "../../modules/entity/channel";
import { Thread } from "../../modules/entity/thread";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      boxSizing: "border-box",
      width: "21vw",
      height: "100%",
      padding: "16px 0px",
      backgroundColor: theme.palette.background.default,
      borderRight: "solid 1px #424242",
      overflow: "scroll"
    },
    title: {
      width: "100%",
      fontWeight: "bold",
      fontSize: "18px",
      padding: "0px 12px",
      color: "#1c54b2"
    },
    addBtn: {
      width: "30px",
      height: "30px",
      marginRight: "8px",
      flex: "1 0 auto",
      minHeight: "10px !important"
    },
    dialogContentText: {
      fontSize: "13px"
    },
    dialogFiled: {
      paddingTop: "12px",
      paddingBottom: "12px",
      fontSize: "12px"
    }
  });

type Props = {
  addChannel: (name: string, description: string) => void;
  watchChannels: () => void;
  unWatchChannels: () => void;
  channel: AppState["channel"];
  channelID?: string;
} & WithStyles<typeof styles> &
  RouteComponentProps;

interface State {
  openDialog: boolean;
  channelName?: string;
  channelDiscription?: string;
}

const channelList = withStyles(styles)(
  withRouter(
    class extends React.PureComponent<Props, State> {
      constructor(props: Props) {
        super(props);
        this.state = {
          ...this.state,
          openDialog: false
        };
      }

      componentDidMount = () => {
        this.props.watchChannels();
      };

      componentDidUpdate = (prevProps: Props) => {
        if (
          prevProps.channel.isLoading &&
          !this.props.channel.isLoading &&
          this.state.openDialog
        ) {
          this.setState({ openDialog: false });
        }
      };

      componentWillUnmount = () => {
        this.props.unWatchChannels();
      };

      handleClickOpen = () => this.setState({ openDialog: true });

      handleClose = () => this.setState({ openDialog: false });

      handleConfirm = () => {
        const { channelName, channelDiscription } = this.state;
        if (channelName && channelDiscription) {
          this.props.addChannel(channelName, channelDiscription);
        }
        this.setState({ openDialog: false });
      };

      handleSelectChannel = (e: React.MouseEvent, item: Channel | Thread) => {
        this.props.history.push(`/${item.id}/threads/`);
      };

      render() {
        const { classes, channel, channelID } = this.props;

        return (
          <div className={classes.root}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-betweeen",
                alignItems: "center",
                marginBottom: "16px"
              }}
            >
              <div className={classes.title}>チャンネル一覧</div>
              <Tooltip title="Add" aria-label="Add">
                <Fab
                  color="secondary"
                  className={classes.addBtn}
                  size="small"
                  onClick={this.handleClickOpen}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </div>

            {channel.channels.map(item => {
              return (
                <ListItem
                  item={item}
                  key={item.id}
                  title={item.title}
                  isActive={item.id === channelID}
                  onClick={this.handleSelectChannel}
                />
              );
            })}

            <Dialog
              open={this.state.openDialog}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">チャンネルの追加</DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.dialogContentText}>
                  チャンネルを追加します。必要事項を入力してください
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="normal"
                  id="channelName"
                  name="channelName"
                  label="チャンネル名"
                  type="text"
                  className={classes.dialogFiled}
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({ channelName: e.currentTarget.value })
                  }
                  fullWidth
                />
                <TextField
                  margin="normal"
                  id="channelDescription"
                  name="channelDescription"
                  label="チャンネル詳細"
                  type="text"
                  multiline
                  rowsMax="8"
                  required
                  className={classes.dialogFiled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({
                      channelDiscription: e.currentTarget.value
                    })
                  }
                  fullWidth
                />
              </DialogContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "16px"
                }}
              >
                <Button onClick={this.handleClose} color="primary">
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={
                    !this.state.channelName! || !this.state.channelDiscription!
                  }
                  onClick={this.handleConfirm}
                >
                  追加
                </Button>
              </div>
            </Dialog>
          </div>
        );
      }
    }
  )
);

export default channelList;
