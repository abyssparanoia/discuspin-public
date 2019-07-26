import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import SignIn, { Redux, Handler } from "../components/pages/SignIn";
import { signIn } from "../modules/auth";
import { AppState } from "../modules/reducer";
import { push } from "connected-react-router";

const mapStateToProps = (state: AppState): Redux => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch: Dispatch): Handler =>
  bindActionCreators({ signIn, push }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
