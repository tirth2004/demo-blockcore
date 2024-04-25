import React, { useState, useEffect } from "react";
import { WebProvider } from "@blockcore/provider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { v4 as uuidv4 } from "uuid";

const Demo = () => {
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState("");
  const [wallet, setWallet] = useState(null);
  const networks = [
    { name: "Any (user selected)", id: "" },
    { name: "Bitcoin", id: "BTC" },
    { name: "City Chain", id: "CITY" },
    { name: "Stratis", id: "STRAX" },
    { name: "x42", id: "X42" },
  ];

  const handleNetworkChange = (event) => {
    const selectedNetwork = event.target.value;
    setNetwork(selectedNetwork);
    provider && provider.setNetwork(selectedNetwork);
  };

  useEffect(() => {
    const initializeWebProvider = async () => {
      try {
        const webProvider = await WebProvider.Create();
        setProvider(webProvider);
        console.log(webProvider);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing web provider:", error);
      }
    };

    initializeWebProvider();
  }, []);

  const connect = async () => {
    const challenge = uuidv4();

    try {
      const result = await provider.request({
        method: "wallets",
        params: [{ challenge: challenge }],
      });

      console.log("Result:", result);
      // Update state with the wallet data
      setWallet(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Web provider initialized successfully!</p>
          <div>
            <FormControl variant="outlined">
              <InputLabel id="network-label">Network</InputLabel>
              <Select
                labelId="network-label"
                id="network-select"
                value={network}
                onChange={handleNetworkChange}
                label="Network"
              >
                {networks.map((network) => (
                  <MenuItem key={network.id} value={network.id}>
                    {network.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <button onClick={connect}>Connect</button>
          {wallet && (
            <div>
              {wallet && (
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  <h2>Wallet Information</h2>
                  <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    {JSON.stringify(wallet, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Demo;
