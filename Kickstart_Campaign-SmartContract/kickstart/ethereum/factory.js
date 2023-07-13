import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x6196962cC0e77C7584d61DE91d420086857471AA"
);

export default instance;
