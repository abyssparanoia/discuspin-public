import React from "react";

// material ui
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import AddIcon from "@material-ui/icons/Add";
import { Tooltip, Fab } from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// TODO: user 作る
import { auth } from "../../modules/firebase";

// state
import { AppState } from "../../modules/reducer";

// user component
import ListItem from "../molecules/ListItem";

// types
import { Thread as ThreadTypes } from "../../modules/entity/thread";
import { RouteComponentProps, withRouter } from "react-router-dom";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "24vw",
      borderRight: "solid 1px #424242",
      padding: "16px 0",
      backgroundColor: theme.palette.background.default
    },
    title: {
      width: "100%",
      fontWeight: "bold",
      fontSize: "18px",
      color: "#1c54b2",
      wordBreak: "break-all",
      marginRight: "8px"
    },
    dialogContentText: {
      fontSize: "13px"
    },
    dialogFiled: {
      paddingTop: "12px",
      paddingBottom: "12px",
      fontSize: "12px"
    },
    addButton: {
      width: "30px",
      height: "30px",
      flex: "1 0 auto",
      minHeight: "10px !important"
    }
  });

// state & props
type Props = {
  addThread: (
    title: string,
    description: string,
    channel_id: string,
    user_id: string
  ) => void;
  watchThread: (channel_id: string) => void;
  unWatchThread: () => void;
  thread: AppState["thread"];
  channel: AppState["channel"];
  channelID: string;
  threadID?: string;
} & WithStyles<typeof styles> &
  RouteComponentProps;

type State = {
  openDialog: boolean;
  threadTitle?: string;
  threadDescription?: string;
};

const threadList = withStyles(styles)(
  withRouter(
    class extends React.PureComponent<Props, State> {
      constructor(props: Props) {
        super(props);
        this.state = {
          ...this.state,
          openDialog: false
        };
      }

      componentDidMount() {
        const { channelID } = this.props;
        this.props.watchThread(channelID);
      }

      componentDidUpdate(prevProps: Props) {
        const { channelID } = this.props;
        if (prevProps.channelID !== channelID) {
          this.props.unWatchThread();
          this.props.watchThread(channelID);
        }
      }

      componentWillUnmount() {
        this.props.unWatchThread();
      }

      openDialog = () => {
        this.setState({ openDialog: true });
      };
      handleClose = () => {
        this.setState({ openDialog: false });
      };
      handleConfirm = () => {
        const uid = auth.currentUser ? auth.currentUser.uid : null;
        const { threadTitle, threadDescription } = this.state;
        const { channelID } = this.props;
        if ((!uid && !this.props.match) || !threadTitle) return;

        this.props.addThread(
          threadTitle,
          threadDescription || "",
          channelID,
          uid!
        );
        this.setState({ openDialog: false });
      };

      handleSelectThread = (threadID: string) => (_: React.MouseEvent) => {
        this.props.history.push(
          `/${this.props.channelID}/threads/${threadID}/`
        );
      };

      render() {
        const { classes, thread, channel, channelID, threadID } = this.props;

        const currentChannel = channel.channels.find(v => v.id === channelID)!;
        return (
          <div className={classes.root}>
            {currentChannel ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 12px",
                  marginBottom: "16px"
                }}
              >
                <div className={classes.title}>{currentChannel.title}</div>
                <Tooltip
                  title="スレッドの追加"
                  aria-label="スレッドの追加"
                  className={classes.addButton}
                >
                  <Fab size="small" color="secondary" onClick={this.openDialog}>
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </div>
            ) : null}

            {thread.list.map((thread: ThreadTypes) => {
              return (
                <ListItem
                  key={thread.id}
                  title={thread.title}
                  item={thread}
                  isActive={thread.id === threadID}
                  onClick={this.handleSelectThread(thread.id)}
                />
              );
            })}
            <Dialog
              open={this.state.openDialog}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">スレッドの追加</DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.dialogContentText}>
                  スレッドを追加します。必要事項を入力してください
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="normal"
                  id="threadTitle"
                  name="threadTitle"
                  label="スレッド タイトル"
                  type="text"
                  className={classes.dialogFiled}
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({ threadTitle: e.currentTarget.value })
                  }
                  fullWidth
                />
                <TextField
                  margin="normal"
                  id="threadDescription"
                  name="threadDescription"
                  label="スレッド詳細"
                  type="text"
                  multiline
                  rowsMax="8"
                  required
                  className={classes.dialogFiled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.setState({
                      threadDescription: e.currentTarget.value
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
                    !this.state.threadTitle! || !this.state.threadDescription!
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

export default threadList;
