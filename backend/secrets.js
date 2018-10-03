// secrets.js
const secrets = {
    dbUri: "mongodb://YellowTeam:eecs497@ds121163.mlab.com:21163/yellow-project1"
  };
  
  export const getSecret = key => secrets[key];