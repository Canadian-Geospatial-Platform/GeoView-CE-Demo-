import { End_Points } from './end_points';

import { httpGet } from './network';

/**
 * Class contains API function for the CE
 */
export class API {
  /**
   * Get the available date range for the catalog for a dataset
   *
   * @param {string} dataset the dataset to look for
   * @param {string} apiKey Authentication token
   *
   * @returns {Object} An object with min/max available dates
   */
  static getTimePeriodRange = async (
    dataset: string,
    apiKey?: string,
  ): Promise<Object> => {
    const result = await httpGet(
      `${End_Points.DATASET_DATES}?dataset=${dataset}`,
      apiKey,
    );

    return result;
  };

  /**
   * Get a map layer with provided time period
   *
   * @param {string} dataset the dataset to use
   * @param {string} variable the variable to use
   * @param {string} startDate the start date time period
   * @param {string} endDate the end date time period
   * @param {string} apiKey The authentication token
   * @returns {Object} an object containing the layer
   */
  static getMapLayer = async (
    dataset: string,
    variable: string,
    startDate: string,
    endDate: string,
    apiKey?: string,
  ): Promise<Object> => {
    const result = await httpGet(
      `${End_Points.RASTER_MAPID}/values?dataset=${dataset}&variable=${variable}&temporal_statistic=mean&start_date=${startDate}&end_date=${endDate}`,
      apiKey,
    );

    return result;
  };

  /**
   * Get a time series at specefic location and time period
   *
   * @param {number} lat a latitude point
   * @param {number} lng a longtitude point
   * @param {string} dataset the dataset to use
   * @param {string} variable the variable to use
   * @param {string} startDate the start date
   * @param {string} endDate the end date
   * @param {string} apiKey the authentication token
   * @returns {Object} returns the time series on that point
   */
  static getTimeSeries = async (
    lat: number,
    lng: number,
    dataset: string,
    variable: string,
    startDate: string,
    endDate: string,
    apiKey?: string,
  ): Promise<Object> => {
    const result = await httpGet(
      `${End_Points.TIMESERIES_POINTS}/points?dataset=${dataset}&variable=${variable}&area_reducer=mean&start_date=${startDate}&end_date=${endDate}&coordinates=[[${lng},${lat}]]`,
      apiKey,
    );

    return result;
  };
}
