import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Flippy, { FrontSide, BackSide } from "react-flippy";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      boxShadow: "-1px 10px 29px 0px rgba(0,0,0,0.8)",
    },
  },
  header: {
    minHeight: 70,
  },
  media: {
    height: 0,
    minWidth: 345,
    paddingTop: "56.25%", // 16:9
  },

  avatar: {
    backgroundColor: "#113CCF",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function Players() {
  const classes = useStyles();
  const [roster, setRoster] = useState([]);
  const [teamSelected, seTeamSelected] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const ref = useRef();

  const handleChange = (event) => {
    setTeamData(event.target.value);
  };

  useEffect(() => {
    axios
      .get(`https://data.nba.com/prod/v1/2020/teams/${teamData}/roster.json`)
      .then((res) => {
        console.log(res, "Team data");

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
  }, [teamData]);
  console.log(roster);

  const currentRoster = roster.map((player) => {
    return (
      <Flippy
        key={player.pl.pid}
        flipOnHover={false} // default false
        flipOnClick={true} // default false
        flipDirection="horizontal" // horizontal or vertical
        ref={ref} // to use toggle method like ref.curret.toggle()
        // if you pass isFlipped prop component will be controlled component.
        // and other props, which will go to div
      >
        <Grid className={classes.card} item>
          <FrontSide>
            <Card className={classes.root}>
              <CardHeader
                className={classes.header}
                avatar={
                  <Avatar aria-label="Player Number" className={classes.avatar}>
                    {player.pl.num}
                  </Avatar>
                }
                title={`${player.pl.fn} ${player.pl.ln}`}
              />

              <CardMedia
                className={classes.media}
                image={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.pl.pid}.png`}
              />
            </Card>
          </FrontSide>
          <BackSide>
            <Card className={classes.root}>
              <CardHeader
                className={classes.header}
                avatar={
                  <Avatar aria-label="Player Number" className={classes.avatar}>
                    {player.pl.num}
                  </Avatar>
                }
                title={`${player.pl.fn} ${player.pl.ln}`}
              />
              {player.pl.fn} {player.pl.ln}
            </Card>
          </BackSide>
        </Grid>
      </Flippy>
    );
  });

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Team</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={teamData}
          onChange={handleChange}
        >
          <MenuItem value={1610612757}>Portland Trail Blazers</MenuItem>
        </Select>
      </FormControl>
      <br />
      <Grid container spacing={2}>
        {currentRoster}
      </Grid>
    </div>
  );
}

export default Players;
