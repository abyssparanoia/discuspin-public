import React from "react";

import { createStyles, WithStyles, Theme } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

// types
import { Channel } from "../../modules/entity/channel";
import { Thread } from "../../modules/entity/thread";

const styles = (theme: Theme) =>
  createStyles({
    channel: {
      fontSize: "13px",
      padding: "24px 12px",
      cursor: "pointer",
      transition: "128ms",
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      "&:hover": {
        background: "#424242"
      }
    },
    channelActive: {
      fontSize: "13px",
      padding: "24px 12px",
      cursor: "pointer",
      transition: "128ms",
      backgroundColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[4],
      color: theme.palette.text.primary
    }
  });

type Item = Channel | Thread;
type ItemType = {
  title: string;
  isActive: boolean;
  item?: Item;
  onClick?: (e: React.MouseEvent, item: Item) => void;
} & WithStyles<typeof styles>;

const listItem: React.StatelessComponent<ItemType> = props => {
  const { classes, item } = props;
  return (
    <div
      className={props.isActive ? classes.channelActive : classes.channel}
      onClick={(e: React.MouseEvent) =>
        props.onClick ? props.onClick(e, item!) : null
      }
    >
      {props.title}
    </div>
  );
};

export default withStyles(styles)(listItem);
