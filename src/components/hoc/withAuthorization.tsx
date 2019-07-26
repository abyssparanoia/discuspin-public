import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { push } from "connected-react-router";
import { AppState } from "../../modules/reducer";
import { refreshAuthUID } from "../../modules/auth";
import * as routes from "../../constants/routes";

// TODO: 型パズル解決
const withAuthorization = (Component: any) => {
  const mapStateToProps = (state: AppState) => ({
    authUser: state.auth.authUser,
    isLoading: state.auth.isLoadingRefresh,
    router: state.router
  });

  const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators({ push, refreshAuthUID }, dispatch);

  type MergedProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

  class WithAuthorization extends React.Component<MergedProps> {
    componentDidUpdate() {
      const { isLoading, authUser } = this.props;
      // eslint-disable-next-line no-unused-expressions
      !authUser && !isLoading ? this.props.push(routes.SIGN_IN) : null;
    }
    public render() {
      return this.props.authUser ? <Component /> : null;
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WithAuthorization);
};

export default withAuthorization;
