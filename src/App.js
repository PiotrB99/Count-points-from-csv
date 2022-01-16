import {useState} from "react";
import './App.css';
import Papa from "papaparse";

const App = () => {
  const [csvData, setCSVData] = useState(null);
  const [winnersName, setWinnersName] = useState(null);
  const [winnersPoints, setWinnersPoints] = useState(null);

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
    // debugger;
    if(csvData !== null){
      if(csvData.length > 2){
        const rowLength = csvData.length;
        const columnLenght = csvData[0].length;
        const pointsArray = [];
        let flagForPointsArray = 0;
        //saving data to array
        for(let i = 1; i<columnLenght; i++){
          let tempVal = 0;
          pointsArray.push(new Array(columnLenght-1));
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

        const winners = [];
        for(let i = 0; i < indexes.length; i++){
          winners.push(csvData[0][indexes[i]+1]);
        }

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
        for (let index = 1; index < csvData[1].length; index++) {
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
      {winnersName === null ? "" : typeof winnersName === "string" 
      ? <div>{winnersName}</div> 
      : typeof winnersName === "object" ? 
      winnersName.map( 
            (winner, index) => {
              return <div key={index+"grupa"}>
                <div className="winners-name-wrapper">
                  <div>Zwycięzka drużyna:</div> 
                  <div className="winners-name">{winner}</div> 
                </div>
                <div>Ilość punktów: <div className="points">{winnersPoints[index]}</div></div>
              </div>
              }
          ) : ""
      }
    </div>
  );
}

export default App;
