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
import Switch from "@material-ui/core/Switch";
import { getMainColor, getSecondaryColor, getColors } from "nba-color";
import * as NBAIcons from "react-nba-logos";

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
    borderRadius: "5px",
    border: "5px solid black",
    "&:hover": {
      boxShadow: "-1px 10px 29px 0px rgba(192,192,192,0.8)",
    },
  },
  hoverInfo: {
    display: "none",
    position: "absolute",
    bottom: 13,
    left: 14,
    right: 0,
    height: 200,
    width: "93%",
    padding: 15,
    borderRadius: "5px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
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
    height: 612,
    border: "5px ",
    borderRadius: "5px",
    border: "0.5rem outset rgb(192,192,192)",
    borderRadius: "12px",
    marginBottom: 10,
    outlineOffset: " 0.5rem",
  },
  overlay: {
    position: "absolute",
    borderRadius: "3px",
    top: "20px",
    left: "20px",
    color: "black",
    backgroundColor: "white",
    opacity: 0.8,
  },
  cardBack: {
    border: "0.5rem outset rgb(192,192,192)",
    borderRadius: "12px",
    marginBottom: 10,

    outlineOffset: " 0.5rem",
  },
  cardInfo: {
    border: "0.5rem outset rgb(192,192,192)",
    boxShadow: "0 0 0 .2rem",
    borderRadius: "12px",
    outlineOffset: " 0.5rem",
  },

  formControl: {
    marginBottom: theme.spacing(1),
    minWidth: 200,
    paddingTop: 20,
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
  const [primaryColor, setPrimaryColor] = useState([]);
  const [secondaryColor, setSecondaryColor] = useState([]);
  const [invertColor, setInvertColor] = useState(false);
  const ref = React.createRef();

  const handleChange = (event) => {
    if (event.label !== teamSelected) {
      setRoster([]);
      setTeamId(event.value);
      setTeamSelected(event.label);
      getTeamData(allNBATeams, event.value);
    }
  };

  const toggleColors = () => {
    setInvertColor(!invertColor);
    let tempColor = primaryColor;
    setPrimaryColor(secondaryColor);
    setSecondaryColor(tempColor);
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
            console.log(teamList[i]);
            setTeamData(teamList[i]);

            setPrimaryColor(getMainColor(teamList[i].tricode));
            setSecondaryColor(getSecondaryColor(teamList[i].tricode));
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
              console.log(playerCard);
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
        console.log(getColors(teams[i].tricode));
        setPrimaryColor(getMainColor(teams[i].tricode));
        setSecondaryColor(getSecondaryColor(teams[i].tricode));
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
          style={{
            backgroundColor: primaryColor.hex,
            borderColor: secondaryColor.hex,
          }}
        >
          <CardMedia
            className={classes.mediaBack}
            style={{
              backgroundColor: secondaryColor.hex,
              borderColor: secondaryColor.hex,
            }}
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
                  style={{
                    backgroundColor: primaryColor.hex,
                    color: secondaryColor.hex,
                  }}
                >
                  {player.pl.num}
                </Avatar>
              }
              title={`${player.pl.fn} ${player.pl.ln}`}
              subheader={playerPosition(player.pl.pos)}
            />
          </div>

          <div className={classes.hoverInfo}>
            {player.pl.ca.sa
              ? player.pl.ca.sa[player.pl.ca.sa.length - 1].val
              : "N/A"}
            &nbsp;Season Stats
            <br />
            PPG:&nbsp;
            {player.pl.ca.sa
              ? player.pl.ca.sa[player.pl.ca.sa.length - 1].pts
              : "N/A"}
            <br />
            RPG:&nbsp;
            {player.pl.ca.sa
              ? player.pl.ca.sa[player.pl.ca.sa.length - 1].reb
              : "N/A"}
            <br />
            APG:&nbsp;
            {player.pl.ca.sa
              ? player.pl.ca.sa[player.pl.ca.sa.length - 1].ast
              : "N/A"}
          </div>
        </FrontSide>
        {/* Front of Card End */}
        {/* Back of Card Start */}
        <BackSide
          className={classes.rootback}
          style={{
            backgroundColor: primaryColor.hex,
            borderColor: secondaryColor.hex,
          }}
        >
          <Card
            className={classes.cardBack}
            style={{
              borderColor: primaryColor.hex,
              boxShadow: `0 0 0 .2rem ${secondaryColor.hex}`,
            }}
          >
            <CardHeader
              className={classes.header}
              avatar={
                <Avatar
                  aria-label="Player Number"
                  variant="square"
                  className={classes.square}
                  style={{
                    backgroundColor: primaryColor.hex,
                    color: secondaryColor.hex,
                  }}
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
            <CardContent
              className={classes.cardInfo}
              style={{ boxShadow: `0 0 0 .2rem ${secondaryColor.hex}` }}
            >
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
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <FormControl className={classes.formControl}>
            <Dropdown
              options={options}
              onChange={handleChange}
              placeholder="Select team"
            />
          </FormControl>
          <div>Click player to learn more</div>
        </Grid>
        <Grid item xs={3}>
          <br />
          <div>
            Invert Card Colors
            <br />
            <Switch checked={invertColor} onChange={toggleColors} />
          </div>
        </Grid>
      </Grid>

      <br />
      <Grid container spacing={2}>
        {currentRoster}
      </Grid>
    </div>
  );
}

export default Players;
