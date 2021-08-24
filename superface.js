const { getClient } = require("./client");

// get centralized superface client
const client = getClient();

//  ReverseGeocode
//  https://superface.ai/address/geocoding
//
//  available providers: mock, google-apis, opencage
//
async function getAddress(latitude, longitude, service) {
  const profile = await client.getProfile("address/geocoding");
  const provider = await client.getProvider(service); // HINT: if you do not configure provider the first in your super.json is used
  const result = await profile.useCases.ReverseGeocode.perform(
    { latitude, longitude },
    { provider }
  );

  let success = false,
    message,
    log;

  if (result.isErr()) {
    message = "Getting address failed";
    log = { kind: result.error.kind, message: result.error.message }
  } else {
    message = result.value[0].formattedAddress;
    log = result.value
    success = true;
  }
  
  console.log(message);

  return {
    success,
    message,
    log
  };
}

module.exports = {
  getAddress
};
