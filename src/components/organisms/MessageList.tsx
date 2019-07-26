import React from "react";

// material
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { createStyles, WithStyles } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

// state
import { AppState } from "../../modules/reducer";

// components
import ItemMessage from "../molecules/ItemMessage";
import MessageForm from "../molecules/MessageForm";

// types
import { Message } from "../../modules/entity/message";

import { storage } from "../../modules/firebase";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      padding: "0px 16px",
      flex: "1 1 0",
      backgroundColor: theme.palette.background.default
    },
    messageCard: {
      width: "100%",
      height: "100%",
      padding: "16px",
      boxSizing: "border-box",
      overflow: "scroll",
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[2],
      marginTop: "8px",
      marginBottom: "8px"
    }
  });

type Props = {
  thread: AppState["thread"];
  channel: AppState["channel"];
  message: AppState["message"];
  user: AppState["user"];
  sendMessage: (threadId: string, userId: string, body: string) => void;
  watchMessages: (threadId: string) => void;
  unWatchMessage: () => void;
  channelID: string;
  threadID: string;
} & WithStyles<typeof styles>;

type State = {
  messageBody: string;
};

const messageList = withStyles(styles)(
  class extends React.PureComponent<Props, State> {
    messageListRef: React.RefObject<HTMLDivElement>;
    constructor(props: Props) {
      super(props);
      this.state = {
        messageBody: ""
      };
      this.messageListRef = React.createRef();
    }

    componentDidMount = () => {
      this.props.watchMessages(this.props.threadID);
    };

    componentWillUnmount = () => {
      this.props.unWatchMessage();
    };

    componentDidUpdate = (prevProps: Props) => {
      if (prevProps.threadID !== this.props.threadID) {
        this.props.unWatchMessage();
        this.props.watchMessages(this.props.threadID);
      }

      if (prevProps.message.list.length < this.props.message.list.length) {
        const ta = this.messageListRef.current!;
        ta.scrollTop = ta.scrollHeight;
      }
    };

    sendMessage = () => {
      const { threadID } = this.props;
      this.props.sendMessage(
        threadID,
        this.props.user.user!.id,
        this.state.messageBody
      );
      this.setState({ messageBody: "" });
    };

    keyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!this.state.messageBody.trim()) return;
      if (e.keyCode === 13 && e.metaKey) {
        this.sendMessage();
      }
    };

    // 画像の挿入
    insertImage = async () => {
      const files = (await this.getInputImage()) as FileList;
      const imageRef = storage.ref("images").child(Date.now() + "");
      await imageRef.put(files[0]);
      const url = await imageRef.getDownloadURL();
      const img = `![commentImage](${url})`;
      this.setState({
        messageBody: `${this.state.messageBody} ${
          this.state.messageBody ? "\n\n\n\n" : ""
        }${img}`
      });
    };

    getInputImage = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      return new Promise(resolve => {
        input.onchange = () => {
          resolve(input.files!);
        };
      });
    };

    render() {
      const { message, classes } = this.props;
      return (
        <div className={classes.root}>
          <div className={classes.messageCard} ref={this.messageListRef}>
            {message.list.map((item: Message) => (
              <ItemMessage key={item.id} item={item} />
            ))}
          </div>
          <MessageForm
            onKeyDown={this.keyDownHandler}
            onChange={e =>
              this.setState({ messageBody: e.currentTarget.value })
            }
            onInsertImage={this.insertImage}
            onSubmit={this.sendMessage}
            messageBody={this.state.messageBody}
          />
        </div>
      );
    }
  }
);

export default messageList;
