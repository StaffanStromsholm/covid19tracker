import React, { useState, useEffect } from 'react';
import './App.css'

const App = () => {
  //state
  const [searchQuery, setSearchQuery] = useState('Finland')
  const [url, setUrl] = useState(`https://api.covid19api.com/total/country/${searchQuery}`)
  const [location, setLocation] = useState('Finland')
  const [totalDeaths, setTotalDeaths] = useState();
  const [newDeaths, setNewDeaths] = useState();
  const [totalCases, setTotalCases] = useState();
  const [newCases, setNewCases] = useState();
  const [matches, setMatches] = useState([]);
  const [matchesBolean, setMatchesBolean] = useState(false);

  const fetchCoronaStatus = () => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setTotalDeaths(data[data.length - 1].Deaths);
        setNewDeaths(data[data.length - 1].Deaths - data[data.length - 2].Deaths)
        setTotalCases(data[data.length - 1].Confirmed)
        setNewCases(data[data.length - 1].Confirmed - data[data.length - 2].Confirmed)

      })
      .catch(error => console.log(error))
  }

  // 

  useEffect(() => {
    fetchCoronaStatus();
  }, [url])

  const handleSubmit = (e) => {
    setMatchesBolean(false);
    setLocation(searchQuery);
    setUrl(`https://api.covid19api.com/total/country/${searchQuery}`)
    e.preventDefault();
  }

  const handleChange = async e => {
    setMatchesBolean(true);
    setSearchQuery(e.target.value);
    let searchText = e.target.value
    const res = await fetch('https://api.covid19api.com/countries')
    const countries = await res.json()
    //get matches to current text input
    let matches = countries.filter(country => {
      const regex = new RegExp(`^${searchText}`, "gi")
      return country.Country.match(regex);

    })
    if (searchText.length === 0) {
      matches = [];
    }
    setMatches(matches)
  }

  const handleCountryClick = e => {
    setSearchQuery(e.target.innerHTML)
    setLocation(e.target.innerHTML)
    setUrl(`https://api.covid19api.com/total/country/${e.target.innerHTML}`)
    setMatchesBolean(false);
  }


  return (
    <div className="App">
      <h1>COVID-19 TRACKER</h1>

      <form onSubmit={handleSubmit}>
        <div class="form-group">
          <input id="autocomplete" autoComplete="off" onChange={handleChange} type="text" class="form-control" placeholder="Search Country" />
        </div>
      </form>

      <div style={{ position: "absolute" }}>
        <div class="card">
          <ul class="list-group list-group-flush">
          { matchesBolean ?
           matches.map((match, i) => (
         <li style={{width: "22rem"}} onClick={handleCountryClick} class="list-group-item">{match.Country}</li>
        ))
      : ""}
            
            
          </ul>
        </div>
        
      </div>

      <br />
      <h2><strong>{location.toUpperCase()}</strong></h2>
      <br />
      
      <h3>New Cases</h3>
      <p>{newCases}</p>
      <h3>Total Cases</h3>
      <p>{totalCases}</p>
      <h3>New Deaths</h3>
      <p>{newDeaths}</p>
      <h3>Total Deaths</h3>
      <p>{totalDeaths}</p>
    </div>
  )
}

export default App;