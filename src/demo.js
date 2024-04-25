import React, { useState, useEffect } from "react";
import { WebProvider } from "@blockcore/provider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import { v4 as uuidv4 } from "uuid";

const Demo = () => {
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState("");
  const [wallet, setWallet] = useState(null);

  //   Signing Text states
  const [signingText, setSigningText] = useState("");
  const [signedTextSignature, setSignedTextSignature] = useState("");
  const [signedTextKey, setSignedTextKey] = useState("");
  const [signedTextNetwork, setSignedTextNetwork] = useState("");

  //Payment states
  const [paymentRequestAmount, setPaymentRequestAmount] = useState("");
  const [paymentTransactionId, setPaymentTransactionId] = useState("");

  //Dropdown data
  const networks = [
    { name: "Bitcoin", id: "BTC" },
    { name: "City Chain", id: "CITY" },
    { name: "StratisTest", id: "TSTRAX" },
  ];

  //Loads web provider on component mount
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

  //Drop down handling
  const handleNetworkChange = (event) => {
    const selectedNetwork = event.target.value;
    setNetwork(selectedNetwork);
    provider && provider.setNetwork(selectedNetwork);
  };

  //Amount field handling
  const handleAmountChange = (event) => {
    setPaymentRequestAmount(event.target.value);
  };

  const paymentRequest = async () => {
    try {
      const result = await provider?.request({
        method: "payment",
        params: [
          {
            network: network.toLowerCase(),
            amount: paymentRequestAmount,
            address: "Ccoquhaae7u6ASqQ5BiYueASz8EavUXrKn",
            label: "Your Local Info",
            message: "Invoice Number 5",
            data: "MzExMzUzNDIzNDY",
            id: "4324",
          },
        ],
      });

      console.log("Payment result:", result);

      setPaymentTransactionId(result.transactionId);
    } catch (error) {
      console.error("Error making payment request:", error);
    }
  };

  const signMessageAnyAccount = async (value) => {
    console.log("Sign button pressed");
    try {
      console.log("Sending the request for signing to web provider.");
      const result = await provider.request({
        method: "signMessage",
        params: [{ message: value, network: provider.indexer.network }],
      });
      console.log("Result signing:", result);

      setSignedTextKey(result.key);
      setSignedTextSignature(result.response.signature);
      setSignedTextNetwork(result.network);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  const connect = async () => {
    const challenge = uuidv4();

    try {
      const result = await provider.request({
        method: "wallets",
        params: [{ challenge: challenge }],
      });

      console.log("Result:", result);

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
          <Card>
            <CardHeader title="Signing demo" />
            <CardContent>
              <TextField
                label="Basic text"
                variant="outlined"
                fullWidth
                value={signingText}
                onChange={(e) => setSigningText(e.target.value)}
              />
              {signedTextSignature && (
                <div>
                  <p>
                    Signature:
                    <br />
                    {signedTextSignature}
                  </p>
                  <p>
                    Key/Address:
                    <br />
                    {signedTextKey}
                  </p>
                  <p>
                    Network:
                    <br />
                    {signedTextNetwork}
                    <br />
                  </p>
                </div>
              )}
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => signMessageAnyAccount(signingText)}
              >
                Request Signing
              </Button>
            </CardActions>
          </Card>
          <Card>
            <CardHeader title="Payment demo" />
            <CardContent>
              <TextField
                label="Amount"
                variant="outlined"
                type="number"
                value={paymentRequestAmount}
                onChange={handleAmountChange}
              />
              <p>
                {paymentTransactionId &&
                  `Transaction ID: ${paymentTransactionId}`}
              </p>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={paymentRequest}
              >
                Payment Request
              </Button>
            </CardActions>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Demo;
