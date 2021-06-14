import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { getMainColor } from "nba-color";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
// import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
// import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "red",

    "&:hover": {
      boxShadow: "-1px 10px 29px 0px rgba(0,0,0,0.8)",
    },
  },
  rootback: {
    height: 650,
    backgroundColor: "red",
    "&:hover": {
      boxShadow: "-2px 10px 29px 0px rgba(0,0,0,0.8)",
    },
  },
  header: {
    minHeight: 70,
  },
  media: {
    height: 300,
    backgroundColor: "white",
    // minWidth: 345,
    paddingTop: "56.25%", // 16:9
  },
  mediaBack: {
    height: 620,
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "black",
    backgroundColor: "white",
  },
  square: {
    color: theme.palette.getContrastText("#CC0000"),
    backgroundColor: "#CC0000",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function Players() {
  const classes = useStyles();
  const [roster, setRoster] = useState([]);
  const [teamSelected, setTeamSelected] = useState("POR");
  const [teamData, setTeamData] = useState("1610612757");
  const ref = useRef();

  const handleChange = (event) => {
    setRoster([]);
    setTeamData(event.target.value);
    // setTeamSelected(getMainColor(event.target.abbreviation));
  };

  const playerPosition = (letter) => {
    if (letter === "F-G") {
      return "Forward-Guard";
    }
    if (letter === "F-C") {
      return "Forward-Center";
    }
    if (letter === "F") {
      return "Forward";
    }
    if (letter === "G-F") {
      return "Guard-Forward";
    }
    if (letter === "G") {
      return "Guard";
    }
    if (letter === "C") {
      return "Center";
    }
    return letter;
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

  const currentRoster = roster.map((player) => {
    return (
      <Flippy
        key={player.pl.pid}
        flipOnHover={false}
        flipOnClick={true}
        flipDirection="horizontal"
        ref={ref}
        style={{ width: "400px", height: "650px", margin: 5 }}
      >
        <FrontSide className={classes.root}>
          {/* <Card className={classes.root}> */}
          {/* <CardHeader
                className={classes.header}
                avatar={
                  <Avatar aria-label="Player Number" className={classes.avatar}>
                    {player.pl.num}
                  </Avatar>
                }
                title={`${player.pl.fn} ${player.pl.ln}`}
              /> */}
          <CardMedia
            className={classes.mediaBack}
            image={`https://ak-static.cms.nba.com/wp-content/uploads/silos/nba/latest/440x700/${player.pl.pid}.png`}
          />
          <div className={classes.overlay}>
            {player.pl.fn} {player.pl.ln}
          </div>
          {/* </Card> */}
        </FrontSide>
        <BackSide className={classes.rootback}>
          <Card>
            <CardHeader
              className={classes.header}
              avatar={
                <Avatar
                  aria-label="Player Number"
                  variant="square"
                  className={classes.square}
                >
                  {player.pl.num}
                </Avatar>
              }
              title={`${player.pl.fn} ${player.pl.ln}`}
              subheader={playerPosition(player.pl.pos)}
            />

            <CardMedia
              className={classes.media}
              image={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.pl.pid}.png`}
            />
          </Card>
        </BackSide>
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
          <MenuItem value={1610612757} abbreviation={"POR"}>
            Portland Trail Blazers
          </MenuItem>
          <MenuItem value={1610612737} abbreviation={"ATL"}>
            Atlanta Hawks
          </MenuItem>
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
