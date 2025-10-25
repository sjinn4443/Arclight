// utils/ipEnricher.cjs
const enrichIp = async (ip) => {
  console.log(`Mock enriching IP: ${ip}`);
  // Simulate enrichment with mock data
  return {
    country: "Mock Country",
    city: "Mock City",
    latitude: 0,
    longitude: 0,
    error: null,
  };
};

module.exports = {
  enrichIp,
};
