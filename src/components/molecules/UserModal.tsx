import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { storage } from "../../modules/firebase";
import moment from "moment";
import { CameraAlt } from "@material-ui/icons";
import { User } from "../../modules/entity/user";

interface Props {
  isOpen: boolean;
  isNew?: boolean;
  user?: User;
  onClose?: () => void;
  onCancel: () => void;
  onConfirm: (data: {
    displayName?: string;
    position?: string;
    description?: string;
    avatarURL?: string;
  }) => void;
}

interface State {
  displayName?: string;
  avatarURL?: string;
  description?: string;
  position?: string;
}

class UserModal extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayName: "",
      avatarURL:
        "https://firebasestorage.googleapis.com/v0/b/discuspin.appspot.com/o/images%2Fdefaulticon.png?alt=media&token=d8fd8be0-e11a-441d-9b0b-a806cd563a83",
      description: "",
      position: ""
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.handleModalOpen();
    }
  }

  // モーダルオープン時
  handleModalOpen = () => {
    const { user } = this.props;
    this.setState({
      ...this.state,
      displayName: user ? user.displayName : "",
      description: user ? user.description : "",
      position: user ? user.position : "",
      avatarURL: user
        ? user.avatarURL
        : "https://firebasestorage.googleapis.com/v0/b/discuspin.appspot.com/o/images%2Fdefaulticon.png?alt=media&token=d8fd8be0-e11a-441d-9b0b-a806cd563a83"
    });
  };

  handleImageInput = async () => {
    const files = (await this.getInputImage()) as FileList;
    const imageRef = storage.ref("images").child(moment().format("X"));
    await imageRef.put(files[0]);
    const url = await imageRef.getDownloadURL();
    this.setState({ avatarURL: url });
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
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose ? this.props.onClose : () => {}}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">ユーザー情報</DialogTitle>
        <div
          style={{
            width: "100px",
            height: "100px",
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
            border: "solid 1px #EAEAEA",
            backgroundColor: "#1B88FF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            cursor: "pointer",
            margin: "20px"
          }}
          onClick={this.handleImageInput}
        >
          {this.state.avatarURL ? (
            <img
              alt="avatar url"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: "0",
                left: "0"
              }}
              src={this.state.avatarURL}
            />
          ) : null}
          <CameraAlt />
        </div>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="displayName"
            name="displayName"
            label="表示名"
            type="text"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({ displayName: e.currentTarget.value });
            }}
            value={this.state.displayName!}
            fullWidth
          />
          <TextField
            margin="normal"
            id="position"
            name="position"
            label="肩書(生徒 etc...)"
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({
                position: e.currentTarget.value
              })
            }
            value={this.state.position!}
            fullWidth
          />
          <TextField
            margin="normal"
            id="description"
            name="description"
            label="自己紹介"
            type="text"
            multiline
            rowsMax="4"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({
                description: e.currentTarget.value
              })
            }
            value={this.state.description!}
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
          {this.props.isNew ? null : (
            <Button onClick={this.props.onCancel} color="primary">
              キャンセル
            </Button>
          )}

          <Button
            type="submit"
            color="primary"
            disabled={!this.state.displayName}
            onClick={() =>
              this.props.onConfirm({
                displayName: this.state.displayName,
                position: this.state.position,
                description: this.state.description,
                avatarURL: this.state.avatarURL
              })
            }
          >
            編集
          </Button>
        </div>
      </Dialog>
    );
  }
}

export default UserModal;
