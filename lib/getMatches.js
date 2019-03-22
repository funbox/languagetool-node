const axios = require('axios');

async function getMatches({ url, text } = {}) {
  try {
    const response = await axios({ url, method: 'post', params: { language: 'auto', text } });

    return response.data.matches;
  } catch (error) {
    throw error;
  }
}

module.exports = getMatches;
