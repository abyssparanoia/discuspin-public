import React from "react";

import { createStyles, WithStyles, Theme } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

// types
import { Message } from "../../modules/entity/message";
import ReactMarkdown from "react-markdown";

import Box from "@material-ui/core/Box";
import moment from "moment";

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      display: "flex",
      marginBottom: "24px"
    },
    avator: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginRight: "8px",
      objectFit: "cover",
      boxShadow: "0px 2px #000000"
    },
    username: {
      fontSize: "12px",
      color: "white",
      marginRight: "12px",
      textShadow: theme.shadows[2]
    },
    fromnow: {
      fontSize: "10px",
      color: "#CCCCCC",
      textShadow: theme.shadows[2]
    },
    messageBody: {
      fontSize: "14px",
      padding: "10px 12px",
      borderRadius: "6px",
      wordBreak: "break-all",
      cursor: "pointer",
      backgroundColor: theme.palette.background.paper,
      color: "white",
      "&:hover": {
        boxShadow: theme.shadows[5]
      }
    }
  });

type ItemType = {
  item: Message;
} & WithStyles<typeof styles>;

const itemMessage: React.StatelessComponent<ItemType> = props => {
  const { classes, item } = props;
  return (
    <div className={classes.wrapper}>
      <div>
        <img
          alt="user avatar"
          className={classes.avator}
          src={item.user.avatarURL}
        />
      </div>
      <div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div className={classes.username}>{item.user.displayName}</div>
          <div className={classes.fromnow}>
            {moment(item.createdAt, "X").fromNow()}
          </div>
        </div>

        <Box boxShadow={1} className={classes.messageBody}>
          <ReactMarkdown source={item.body} className="markdown" />
        </Box>
      </div>
    </div>
  );
};

export default withStyles(styles)(itemMessage);
