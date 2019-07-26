import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  fetchThreads,
  addThread,
  watchThread,
  unWatchThread
} from "../modules/thread";
import { AppState } from "../modules/reducer";
import { push } from "connected-react-router";
import ThreadList from "../components/organisms/ThreadList";

const mapStateToProps = (state: AppState) => ({
  thread: state.thread,
  channel: state.channel
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchThreads,
      addThread,
      watchThread,
      unWatchThread,
      push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreadList);
