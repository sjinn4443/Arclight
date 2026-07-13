async function init() {}

async function saveProfile() {}

async function bumpRefresh() {}

async function saveIp() {}

async function updateIpLocation() {}

async function getUsersForDashboard() {
  return [];
}

async function deleteUserForDashboard() {
  throw new Error("Reports delete storage is not configured");
}

module.exports = {
  init,
  saveProfile,
  bumpRefresh,
  saveIp,
  updateIpLocation,
  getUsersForDashboard,
  deleteUserForDashboard,
};
