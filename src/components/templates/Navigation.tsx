import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { push } from "connected-react-router";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import UserModal from "../molecules/UserModal";

import { AppState } from "../../modules/reducer";
import { signOut } from "../../modules/auth";
import * as routes from "../../constants/routes";

import { updateUser } from "../../modules/user";

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ signOut, push, updateUser }, dispatch);

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

interface State {
  anchorEl?: EventTarget & Element;
  openDialog: boolean;
}

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      anchorEl: undefined,
      openDialog: false
    };
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.auth.isLoadingSignOut && !this.props.auth.isLoadingSignOut) {
      this.props.push(routes.SIGN_IN);
    }
  }

  // メニューを開く
  handleOpenMenu = (event: React.MouseEvent) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  // メニューを閉じる
  handleCloseMenu = () => {
    this.setState({ anchorEl: undefined });
  };

  // サインアウト
  handleSignOut = () => {
    this.props.signOut();
    this.handleCloseMenu();
  };

  handleUserModalConfirm = (data: any) => {
    const { user } = this.props.user;
    this.props.updateUser(
      user!.id,
      data.displayName,
      data.position,
      data.description,
      data.avatarURL
    );
    this.setState({ openDialog: false, anchorEl: undefined });
  };

  render() {
    const { user } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" style={{ flex: 1 }}>
            Discuspin
          </Typography>
          {user.user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <img
                alt="avatar url"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "8px"
                }}
                src={user.user.avatarURL!}
              />
              <Button onClick={this.handleOpenMenu}>
                {user.user.displayName}
              </Button>
            </div>
          ) : (
            <ul />
          )}

          <Menu
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleCloseMenu}
          >
            <MenuItem onClick={this.handleSignOut}>サインアウト</MenuItem>
            <MenuItem onClick={() => this.setState({ openDialog: true })}>
              ユーザー情報編集
            </MenuItem>
          </Menu>
        </Toolbar>
        <UserModal
          user={user.user}
          isNew={false}
          isOpen={this.state.openDialog}
          onConfirm={this.handleUserModalConfirm}
          onCancel={() => this.setState({ openDialog: false })}
        />
      </AppBar>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
