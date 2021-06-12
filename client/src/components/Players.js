import React, { useEffect, useState } from "react";
import axios from "axios";

function Players() {
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

  const currentRoster = roster.map((player) => {
    return <li>{player.pl.fn}</li>;
  });

  return (
    <div>
      <ul>{currentRoster}</ul>
    </div>
  );
}

export default Players;
