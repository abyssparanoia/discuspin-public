import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { AppState } from "../modules/reducer";
import { sendMessage, watchMessages, unWatchMessage } from "../modules/message";

import MessageList from "../components/organisms/MessageList";

const mapStateToProps = (state: AppState) => ({
  thread: state.thread,
  channel: state.channel,
  message: state.message,
  user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ sendMessage, watchMessages, unWatchMessage }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);
