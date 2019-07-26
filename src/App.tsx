import * as React from "react";
import { Grid } from "@material-ui/core";
import { Route, Switch } from "react-router"; // react-router v4

import Navigation from "./components/templates/Navigation";
import withAuthentication from "./components/hoc/withAuthentication";
import SignIn from "./containers/SignIn";
import Home from "./components/pages/Home";
import Channels from "./components/pages/Channels";
import Threads from "./components/pages/Channels/Threads";
import UserModal from "./components/molecules/UserModal";
import * as routes from "./constants/routes";
import { AppState } from "./modules/reducer";
import { watchUser, unWatchUser, addUser } from "./modules/user";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

interface Props {
  auth: AppState["auth"];
  user: AppState["user"];
  addUser: (
    id: string,
    displayName: string,
    position?: string,
    description?: string,
    avatarURL?: string
  ) => void;
  watchUser: (id: string) => void;
  unWatchUser: () => void;
}

interface State {
  openDialog: boolean;
}

interface UserInfo {
  displayName?: string;
  avatarURL?: string;
  description?: string;
  position?: string;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...this.state,
      openDialog: false
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps: Props) {
    const prev_user = prevProps.auth.authUser;
    const user = this.props.auth.authUser;
    // 監視開始
    if (!prev_user && user) {
      this.props.watchUser(user.uid);
    }
    if (
      prevProps.user.isLoading &&
      !this.props.user.isLoading &&
      !this.props.user.exist &&
      !this.props.user.user
    ) {
      this.setState({ openDialog: true });
    }
  }
  componentWillUnmount() {
    // 監視終了
    this.props.unWatchUser();
  }

  userModalConfirmHandler = (r: UserInfo) => {
    const id = this.props.auth.authUser!.uid;
    this.props.addUser(
      id,
      r.displayName!,
      r.position,
      r.description,
      r.avatarURL
    );
    this.setState({ openDialog: false });
  };

  render() {
    return (
      <div
        className="app"
        style={{ height: "100%", display: "flex", flexFlow: "column" }}
      >
        <Navigation />
        <Grid style={{ height: "100%", overflow: "hidden" }}>
          <Switch>
            <Route exact path={routes.HOME} component={Home} />
            <Route path={routes.SIGN_IN} component={SignIn} />
            <Route path={routes.MESSAGE} component={Threads} />
            <Route path={routes.CHANNEL} component={Channels} />
          </Switch>
        </Grid>
        <UserModal
          isNew={true}
          isOpen={this.state.openDialog}
          onConfirm={this.userModalConfirmHandler}
          onCancel={() => this.setState({ openDialog: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  auth: state.auth
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ watchUser, unWatchUser, addUser }, dispatch);

export default withAuthentication(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
