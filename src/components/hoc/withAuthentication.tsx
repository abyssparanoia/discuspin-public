import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { refreshAuthUID } from "../../modules/auth";

// TODO: 型パズル解決
const withAuthentication = (Component: any) => {
  const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators({ refreshAuthUID }, dispatch);

  type MergedProps = ReturnType<typeof mapDispatchToProps>;
  class WithAuthentication extends React.Component<MergedProps> {
    componentDidMount() {
      this.props.refreshAuthUID();
    }
    public render() {
      return <Component />;
    }
  }

  return connect<{}, ReturnType<typeof mapDispatchToProps>>(
    null,
    mapDispatchToProps
  )(WithAuthentication);
};

export default withAuthentication;
