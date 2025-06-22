import React from "react";
import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ user, text, setText, onSubmit }) => {
  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={user?.avatarUrl}
      />
      <div className={styles.form}>
        <TextField
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="contained" onClick={onSubmit} disabled={!text.trim()}>
          Отправить
        </Button>
      </div>
    </div>
  );
};
