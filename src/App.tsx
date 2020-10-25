import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { StyleProvider } from "./components";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: "1rem",
    },
    list: {
      width: "100%",
    },
    checkout: {
      marginTop: "2rem",
    },
  })
);

function CheckoutApp() {
  const classes = useStyles();
  return (
    <StyleProvider>
      <Grid container>
        <Grid item md={8}>
          <List className={classes.root}>
            <ListItem role={undefined} dense button>
              <ListItemIcon>
                <Checkbox edge="start" tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText primary={"Credit card"} />
            </ListItem>
            <ListItem role={undefined} dense button>
              <ListItemIcon>
                <Checkbox edge="start" tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText primary={"Debit card"} />
            </ListItem>
          </List>
        </Grid>
        <Grid item md={4}>
          <Button
            className={classes.checkout}
            size={"large"}
            fullWidth={true}
            variant={"outlined"}
            color="primary"
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </StyleProvider>
  );
}

export { CheckoutApp };
