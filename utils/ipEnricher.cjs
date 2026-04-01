// utils/ipEnricher.cjs
const enrichIp = async (ip) => {
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
