let config;
let configLocal;
// TODO: Implement more sophisticated configuration provider

try {
  config = require("./default");
} catch (e) {
}

try {
  configLocal = require("./default.local");
} catch (e) {
}

const getConfig = () => configLocal || config;
const getAdditionalTasks = () => additionalTasksLocal || additionalTasks;

module.exports = {
  getConfig,
  getAdditionalTasks,
};