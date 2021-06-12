import React, { useEffect, useState } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  header: {
    minHeight: 70,
  },
  media: {
    height: 0,
    minWidth: 345,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#113CCF",
  },
}));

function Players() {
  const classes = useStyles();
  const [roster, setRoster] = useState([]);

  useEffect((async) => {
    axios
      .get("https://data.nba.com/prod/v1/2020/teams/1610612757/roster.json")
      .then((res) => {
        console.log(res.data.league.standard);

        Object.values(res.data.league.standard.players).forEach((player) => {
          let temp = player.personId;
          axios
            .get(
              "https://data.nba.com/data/v2015/json/mobile_teams/nba/2020/players/playercard_" +
                temp +
                "_02.json"
            )
            .then((playerCard) => {
              setRoster((oldRoster) => [...oldRoster, playerCard.data]);
            });
        });
      });
  }, []);
  console.log(roster);

  const currentRoster = roster.map((player) => {
    console.log(player);
    return (
      <Grid item md={3} key={player.pl.pid}>
        {player.pl.fn} {player.pl.ln}
        <CardMedia
          className={classes.media}
          image={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.pl.pid}.png`}
        />
      </Grid>
    );
  });

  return (
    <div>
      <Grid container spacing={2}>
        {currentRoster}
      </Grid>
    </div>
  );
}

export default Players;
