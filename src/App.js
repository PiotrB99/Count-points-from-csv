import {useState} from "react";
import './App.css';
import Papa from "papaparse";

const App = () => {
  const [csvData, setCSVData] = useState(null);
  const [winnersName, setWinnersName] = useState(null);
  const [winnersPoints, setWinnersPoints] = useState(null);
  const [allPoints, setAllPoints] = useState(null);
  const [allTeams, setAllTeams] = useState(null)
  // const [winnigTeamIndex, setWinningIndex]
  const countPoints = (e) => {
    const csvFileInput = document.querySelector("#files");
    Papa.parse(csvFileInput.files[0], {
      delimiter: ",",
      skipEmptyLines: true,
      complete: (results) => {
        setCSVData(results.data);
      }
    });
  }

  const showWinner = () => {
    if(csvData !== null){
      if(csvData.length > 2){
        const rowLength = csvData.length;
        const columnLenght = csvData[0].length;
        const pointsArray = [];
        let flagForPointsArray = 0;
        //saving data to array
        for(let i = 1; i<columnLenght; i++){
          let tempVal = 0;
          pointsArray.push(new Array(0));
          for(let j = 1; j<rowLength; j++){
            pointsArray[flagForPointsArray][tempVal]=csvData[j][i];
            tempVal++;
          }
          flagForPointsArray++;
        }
        //summing points for every group
        const sumedPoints = []
        for(let i = 0; i< pointsArray.length; i++){
          let addingPoints = 0;
          for(let j = 0; j<pointsArray[i].length; j++){
            addingPoints = addingPoints + parseInt(pointsArray[i][j]);
          }
          sumedPoints.push(addingPoints);
        }
        console.log("sumedPoints: ", sumedPoints);
        

        //returning winner
        const max = Math.max(...sumedPoints);

        const indexes = []; //indexes of winners 
        const winnersPoints = [];
        for (let index = 0; index < sumedPoints.length; index++) {
          if (sumedPoints[index] === max) {
            indexes.push(index);
            winnersPoints.push(sumedPoints[index]);
          }
        }

        //all teams assigned to new array and removing winned teams
        const allTeamsArray = [];
        for(let i = 1; i < columnLenght; i++){
          allTeamsArray.push(csvData[0][i]);
        }
        // setAllTeams(allTeamsArray);
        indexes.map((deleteThisTeam) => allTeamsArray.splice(deleteThisTeam,1));//deleting winning team/s
        const allPointsArr = sumedPoints;
        indexes.map((deleteThisPoints) => allPointsArr.splice(deleteThisPoints,1));
        console.log("allTeamsArray: ", allTeamsArray);
        console.log("allPointsArr: ", allPointsArr);
        setAllPoints(allPointsArr);
        setAllTeams(allTeamsArray);
        //assing wining team/s
        const winners = [];
        for(let i = 0; i < indexes.length; i++){
          winners.push(csvData[0][indexes[i]+1]);
        }
        console.log("winners: ", winners)
        setWinnersName(winners);
        setWinnersPoints(winnersPoints);

      }else if(csvData.length <= 2){
        const arrayOfPoints = [];
        for(let i = 1; i<csvData[1].length; i++){
          arrayOfPoints.push(parseInt(csvData[1][i]))
        }
        console.log("arrayOfPoints: ", arrayOfPoints);
        const max = Math.max(...arrayOfPoints);

        const indexes = []; //indexes of winners 
        const winnersPoints = [];
        const allPointsArr = [];
        for (let index = 1; index < csvData[1].length; index++) {
          allPointsArr.push(csvData[1][index]);
          if (parseInt(csvData[1][index]) === max) {
            indexes.push(index);
            winnersPoints.push(csvData[1][index]);
          }
        }

        const winners = [];
        console.log("indexes[0]+1: ", indexes[0]+1);
        console.log("csvData: ", csvData);
        for(let i = 0; i < indexes.length; i++){
          winners.push(csvData[0][indexes[i]]);
        }
        setWinnersName(winners);
        setWinnersPoints(winnersPoints);

        const columnLenght = csvData[0].length;
        const allTeamsArray = [];
        for(let i = 1; i < columnLenght; i++){
          allTeamsArray.push(csvData[0][i]);
        }
        console.log("indexes: ", indexes);
        console.log("allTeamsArray: ", allTeamsArray);
        console.log("allPointsArr: ", allPointsArr);
        // indexes.map((deleteThisTeam) => {console.log("deleteThisTeam:", deleteThisTeam-1);allTeamsArray.splice(deleteThisTeam-1,1)});//deleting winning team/s
        // indexes.map((deleteThisPoints) => {console.log("deleteThisPoints:",deleteThisPoints-1); allPointsArr.splice(deleteThisPoints-1,1)});
        setAllPoints(allPointsArr);
        setAllTeams(allTeamsArray);
      } 
    } else{
      setWinnersName("Dodaj plik!");
    }
  }

  return (
    <div className="App">
      <div className="input-files-wrapper">
        <input type="file" id="files" name="file" onChange={(e) => countPoints(e)} />
        <button onClick={()=> {showWinner()}}>Pokaż wygranego</button>
      </div>
      <div className="padding-for-winners"></div>
      {winnersName === null ? "" : winnersName.length === 1 && winnersName !== "Dodaj plik!" ? <div className="winners-title">Zwycięzka drużyna:</div> : <div className="winners-title">Zwycięzkie drużyny:</div>}
      {winnersName === null ? "" : typeof winnersName === "string" 
      ? <div>{winnersName}</div> 
      : typeof winnersName === "object" ? 
      winnersName.map( 
            (winner, index) => {
              return <div key={index+"grupa"} className="winning-teams-style">
                <div className="winners-name-wrapper">
                  {/* <div>Zwycięzka drużyna:</div>  */}
                  <div className="winners-name">{winner}</div> 
                </div>
                <div>Ilość punktów: <div className="points">{winnersPoints[index]}</div></div>
              </div>
              }
          ) : ""
      }
      <div className="padding-for-winners"></div>
      {allTeams === null ? "" : <div className="rest-of-teams-title">Wszystkie drużyny:</div>}
      {allTeams === null ? "" 
        : typeof allTeams === "object" 
        ? allTeams.map((teamsName, index)=> 
        {
          return <div>
            <div>
              <div className="teams-name-title">Nazwa drużyny:</div> 
              <div className="teams-name">{teamsName}</div>
              <div className="teams-points">Punkty: <div className="style-for-points">{allPoints[index]}</div></div>
            </div>
          </div>}) : ""}
    </div>
  );
}

export default App;
