import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { getMainColor } from "nba-color";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { CardContent } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "red",
    border: "1px solid black",
    borderRadius: "5px",

    "&:hover": {
      boxShadow: "-1px 10px 29px 0px rgba(0,0,0,0.8)",
    },
  },
  rootback: {
    height: 650,
    backgroundColor: "red",
    borderRadius: "5px",
    border: "1px solid black",
    "&:hover": {
      boxShadow: "-2px 10px 29px 0px rgba(0,0,0,0.8)",
    },
  },
  header: {
    minHeight: 70,
    borderRadius: "5px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  media: {
    height: 300,

    backgroundColor: "white",
    // minWidth: 345,
    paddingTop: "56.25%", // 16:9
  },
  mediaBack: {
    height: 620,
    // background: `url(${("./logo.png")})`,
    borderRadius: "5px",
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "black",
    backgroundColor: "white",
    opacity: 0.8,
  },
  square: {
    color: theme.palette.getContrastText("#CC0000"),
    backgroundColor: "#CC0000",
  },
  formControl: {
    marginBottom: theme.spacing(1),
    minWidth: 200,
  },
}));

const options = [
  { value: 1610612757, label: "Portland Trail Blazers" },
  { value: 1610612737, label: "Atlanta Hawks" },
  ,
];

function Players() {
  const classes = useStyles();
  const [roster, setRoster] = useState([]);
  const [teamSelected, setTeamSelected] = useState("POR");
  const [teamData, setTeamData] = useState("1610612757");
  const ref = useRef();

  const handleChange = (event) => {
    if (event.label !== teamSelected) {
      setRoster([]);
      setTeamData(event.value);
      setTeamSelected(event.label);
    }
    console.log(event);
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
              console.log(playerCard.data);
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
        style={{
          width: "400px",
          height: "650px",
          margin: 5,
        }}
      >
        {/* Front of Card Start */}
        <FrontSide className={classes.root}>
          <CardMedia
            className={classes.mediaBack}
            image={`https://ak-static.cms.nba.com/wp-content/uploads/silos/nba/latest/440x700/${player.pl.pid}.png`}
          />
          <div className={classes.overlay}>
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
          </div>
        </FrontSide>
        {/* Front of Card End */}
        {/* Back of Card Start */}
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
          <Card>
            <CardContent>
              <Typography variant="body2">
                D.O.B: {player.pl.dob}
                <br />
                Height: {player.pl.ht}
                <br />
                Weight: {player.pl.wt}
                <br />
                <hr />
                Career ({player.pl.y} years in league)
                <br />
                Total pts: {player.pl.ct.pts}
                <br />
                Avg PPG: {player.pl.ca.pts}
                {/* {player.pl.ca.sa[player.pl.ca.sa.length - 1].val} Season
                <br />
                PPG: {player.pl.ca.sa[player.pl.ca.sa.length - 1].pts}
                <br />
                PPG: {player.pl.ca.sa[player.pl.ca.sa.length - 1].pts}
                <br />
                PPG: {player.pl.ca.sa[player.pl.ca.sa.length - 1].pts} */}
              </Typography>
            </CardContent>
          </Card>
        </BackSide>
        {/* Back of Card End */}
      </Flippy>
    );
  });

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Dropdown
          options={options}
          onChange={handleChange}
          placeholder="Select team"
        />
      </FormControl>
      <br />
      <Grid container spacing={2}>
        {currentRoster}
      </Grid>
    </div>
  );
}

export default Players;
