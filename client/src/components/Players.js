import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import { CardContent, Fade } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "5px solid black",
    borderRadius: "5px",

    "&:hover": {
      boxShadow: "-1px 10px 29px 0px rgba(192,192,192,0.8)",
      "& $hoverInfo": {
        display: "block",
      },
    },
  },

  rootback: {
    height: 650,
    backgroundColor: "red",
    borderRadius: "5px",
    border: "5px solid black",
    "&:hover": {
      boxShadow: "-1px 10px 29px 0px rgba(192,192,192,0.8)",
    },
  },
  hoverInfo: {
    display: "none",
    position: "absolute",
    bottom: 11,
    left: 16,
    right: 0,
    height: 200,
    width: "92%",
    borderRadius: "5px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  header: {
    minHeight: 70,
    borderRadius: "2px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  media: {
    height: 300,
    backgroundColor: "white",
    borderRadius: "5px",

    // paddingTop: "56%", //
  },
  mediaBack: {
    height: 615,
    border: "2px solid black",
    // background: `url(${("./logo.png")})`,
    borderRadius: "5px",
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    top: "18px",
    left: "18px",
    color: "black",
    backgroundColor: "white",
    opacity: 0.8,
  },
  cardBack: {
    border: "0.5rem outset rgb(192,192,192)",
    boxShadow: "0 0 0 .2rem black",
    borderRadius: "12px",
    marginBottom: 10,

    outlineOffset: " 0.5rem",
  },
  cardInfo: {
    border: "0.5rem outset rgb(192,192,192)",
    boxShadow: "0 0 0 .2rem black",
    borderRadius: "12px",
    outlineOffset: " 0.5rem",
  },

  formControl: {
    marginBottom: theme.spacing(1),
    minWidth: 200,
  },
}));

const options = [
  { value: "1610612737", label: "Atlanta Hawks" },
  { value: "1610612751", label: "Brooklyn Nets" },
  { value: "1610612738", label: "Boston Celtics" },
  { value: "1610612766", label: "Charlotte Hornets" },
  { value: "1610612741", label: "Chicago Bulls" },
  { value: "1610612739", label: "Cleveland Cavaliers" },
  { value: "1610612742", label: "Dallas Mavericks" },
  { value: "1610612743", label: "Denver Nuggets" },
  { value: "1610612765", label: "Detroit Pistons" },
  { value: "1610612744", label: "Golden State Warriors" },
  { value: "1610612745", label: "Houston Rockets" },
  { value: "1610612754", label: "Indiana Pacers" },
  { value: "1610612746", label: "L.A. Clippers" },
  { value: "1610612747", label: "L.A. Lakers" },
  { value: "1610612763", label: "Memphis Grizzlies" },
  { value: "1610612748", label: "Miami Heat" },
  { value: "1610612749", label: "Milwaukee Bucks" },
  { value: "1610612750", label: "Minnesota Timberwolves" },
  { value: "1610612740", label: "New Orleans Pelicans" },
  { value: "1610612752", label: "New York Knicks" },
  { value: "1610612760", label: "Oklahoma City Thunder" },
  { value: "1610612753", label: "Orlando Magic" },
  { value: "1610612755", label: "Philadelphia 76ers" },
  { value: "1610612756", label: "Phoenix Suns" },
  { value: "1610612757", label: "Portland Trail Blazers" },
  { value: "1610612758", label: "Sacramento Kings" },
  { value: "1610612759", label: "San Antonio Spurs" },
  { value: "1610612761", label: "Toronto Raptors" },
  { value: "1610612762", label: "Utah Jazz" },
  { value: "1610612764", label: "Washington Wizards" },
];

function Players() {
  const classes = useStyles();
  const [roster, setRoster] = useState([]);
  const [allNBATeams, setAllNBATeams] = useState([]);
  const [teamSelected, setTeamSelected] = useState("Portland Trail Blazers");
  const [teamData, setTeamData] = useState([]);
  const [teamId, setTeamId] = useState("1610612757");
  const ref = useRef();

  const handleChange = (event) => {
    if (event.label !== teamSelected) {
      setRoster([]);
      setTeamId(event.value);
      setTeamSelected(event.label);
      getTeamData(allNBATeams, event.value);
    }
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
      .get("https://data.nba.net/prod/2020/teams_config.json")
      .then((res) => {
        let teamList = res.data.teams.config;
        setAllNBATeams(teamList);
        for (let i = 0; i < teamList.length; i++) {
          if (teamList[i].teamId === teamId) {
            setTeamData(teamList[i]);
            console.log(teamList[i]);
          }
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://data.nba.com/prod/v1/2020/teams/${teamId}/roster.json`)
      .then((res) => {
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
  }, [teamId]);

  function getTeamData(teams, id) {
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].teamId === id) {
        console.log(teams[i]);
        setTeamData(teams[i]);
      }
    }
  }

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
        <FrontSide
          className={classes.root}
          style={{ backgroundColor: teamData.primaryColor }}
        >
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
                  style={{ backgroundColor: teamData.primaryColor }}
                >
                  {player.pl.num}
                </Avatar>
              }
              title={`${player.pl.fn} ${player.pl.ln}`}
              subheader={playerPosition(player.pl.pos)}
            />
          </div>

          <div className={classes.hoverInfo}>Info</div>
        </FrontSide>
        {/* Front of Card End */}
        {/* Back of Card Start */}
        <BackSide
          className={classes.rootback}
          style={{ backgroundColor: teamData.primaryColor }}
        >
          <Card className={classes.cardBack}>
            <CardHeader
              className={classes.header}
              avatar={
                <Avatar
                  aria-label="Player Number"
                  variant="square"
                  className={classes.square}
                  style={{ backgroundColor: teamData.primaryColor }}
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
            <CardContent className={classes.cardInfo}>
              <div variant="body2">
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
              </div>
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
          value={{ value: "1610612757", label: "Portland Trail Blazers" }}
          options={options}
          onChange={handleChange}
          placeholder="Select team"
        />
        Click player to learn more
      </FormControl>
      <br />
      <Grid container spacing={2}>
        {currentRoster}
      </Grid>
    </div>
  );
}

export default Players;
