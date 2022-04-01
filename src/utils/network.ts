const axios = require('axios');

export const API_URL = 'http://127.0.0.1:6000';

/**
 * Make a get request on an endpoint
 *
 * @param {string} endPoint the end point to use
 * @param {string} token the authorization api key token
 * @returns {Object} the result from the api call as a json object
 */
export const httpGet = async (
  endPoint: string,
  token?: string,
): Promise<any> => {
  try {
    let headers: Record<string, any> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    // const res = await fetch(API_URL + endPoint, {
    //   method: 'GET',
    //   headers,
    // });

    // const result = await res.json();

    await axios
      .get(API_URL + endPoint, {
        headers: headers,
      })
      .then((result: any) => {
        console.log(result);

        return result;
      })
      .catch((error: any) => {});
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 * Make a post request
 *
 * @param {string} endPoint the endpoint to use
 * @param {Record<string,any>} data the data to post
 * @param {string} token the token to authenticate with
 */
export const httpPost = async (
  endPoint: string,
  data: Record<string, any>,
  token?: string,
): Promise<any> => {
  try {
    let headers: Record<string, any> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    const res = await fetch(API_URL + endPoint, {
      method: 'GET',
      headers,
      body: JSON.stringify(data),
    });

    const result = await res.json();

    return result;
  } catch (error) {
    return error;
  }
};
