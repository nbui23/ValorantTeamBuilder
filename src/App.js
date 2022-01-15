import { useEffect, useState } from "react";
import AgentCard from "./components/agentCard";
import Select from "react-select";
import 'bootstrap/dist/css/bootstrap.css';

const allOptions = [
  { value: "controller", label: "Controller" },
  { value: "duelist", label: "Duelist" },
  { value: "initiator", label: "Initiator" },
  { value: "sentinel", label: "Sentinel" }
];

function App() {
  const [options, setOptions] = useState(allOptions);

  const [agentDetails, setAgentDetails] = useState([]);
  const [team, setTeam] = useState([]);

  const getAllAgents = async () => {
    const res = await fetch("https://valorant-api.com/v1/agents/");
    const results = await res.json();

    const agentNames = [],
      agentImages = [],
      agentRoles = [],
      agentDetails = [];

    for (let i = 0; i < Object.keys(results["data"]).length; i++) {
      if (results["data"][i]["developerName"] !== "Hunter_NPE") {
        agentNames.push(results["data"][i]["displayName"]);
        agentImages.push(results["data"][i]["displayIcon"]);
        agentRoles.push(results["data"][i]["role"]["displayName"]);
      } else {
        continue;
      }
    }

    for (let i = 0; i < agentNames.length; i++) {
      agentDetails[i] = [agentNames[i], [agentImages[i], agentRoles[i]]];
    }
    agentDetails.sort();
    setAgentDetails(agentDetails);
  };

  const refreshPage = async () => {
    window.location.reload(false);
  }

  const analyzeTeam = () => {
    if (team.length == 5) {
      sessionStorage.setItem('teamArray', team);
    }
  }

  useEffect(() => {
    getAllAgents();
  }, []);

  const moveToTeam = (name) => {
    if (team.length < 5) {
      const newTeam = [...team, agentDetails.find((agent) => agent[0] === name)];
      const newAgentDetails = agentDetails.filter((agent) => agent[0] !== name);
      setTeam(newTeam);
      setAgentDetails(newAgentDetails);
    } 
  };

  return (
    <div className="app-container">
      <h2>Valorant Team Builder</h2>
      <div className="d-grid gap-2 d-md-flex">
        <button className="btn btn-primary mr-2 rounded" onClick={analyzeTeam}>Analyze</button>
        <button className="btn btn-danger ml-2 rounded" onClick={refreshPage}>Clear</button>
      </div>
      <h3>Team Composition: </h3>
      <div className="teamComp">
        {team.map((agentDetails) => (
          <AgentCard
            key={agentDetails[0]}
            img={agentDetails[1][0]}
            name={agentDetails[0]}
            role={agentDetails[1][1]}
            handleClick={(name) =>
              console.debug(`${name} is already on the team`)
            }
          />
        ))}
      </div>
      <Select
        options={allOptions}
        onChange={(selectedOptions) => setOptions(selectedOptions)}
        defaultValue={allOptions}
        isMulti
      />
      <div id="agent_container" className="agent-container">
        {agentDetails
          .filter(
            (agentDetails) =>
              options.filter((option) => option.label === agentDetails[1][1])
                .length > 0
          )
          .map((agentDetails) => (
            <AgentCard
              key={agentDetails[0]}
              img={agentDetails[1][0]}
              name={agentDetails[0]}
              role={agentDetails[1][1]}
              handleClick={moveToTeam}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
