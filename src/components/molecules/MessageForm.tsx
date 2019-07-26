import React from "react";

import { createStyles, WithStyles, Theme } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";
import { CameraAlt } from "@material-ui/icons";

const styles = (theme: Theme) =>
  createStyles({
    textarea: {
      fontSize: "14px",
      borderRadius: "2px",
      width: "100%",
      height: "100%",
      resize: "none",
      outline: "none",
      padding: "12px 14px",
      lineHeight: "1.2",
      color: "white",
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[2]
    },
    buttonForm: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      padding: "0px 0px"
    }
  });

type ItemType = {
  messageBody: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onInsertImage: () => void;
  onSubmit: () => void;
} & WithStyles<typeof styles>;

const messageForm: React.StatelessComponent<ItemType> = props => {
  const { classes } = props;
  return (
    <div>
      <form>
        <textarea
          rows={5}
          placeholder="メッセージを入力してください"
          className={classes.textarea}
          value={props.messageBody}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
        ></textarea>
        <div className={classes.buttonForm}>
          <Button onClick={props.onInsertImage} size="small" color="primary">
            <CameraAlt />
          </Button>
          <Button onClick={props.onSubmit} size="small" color="primary">
            送信
          </Button>
        </div>
      </form>
    </div>
  );
};

export default withStyles(styles)(messageForm);
