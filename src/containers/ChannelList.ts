import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addChannel, watchChannels, unWatchChannels } from "../modules/channel";
import { AppState } from "../modules/reducer";

import ChannelList from "../components/organisms/ChannelList";

const mapStateToProps = (state: AppState) => ({
  channel: state.channel
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ addChannel, watchChannels, unWatchChannels }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelList);
