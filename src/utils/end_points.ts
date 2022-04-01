/**
 * List of available end points to the swagger climate engine APIs
 */
export enum End_Points {
  /**
   * Request map layers from a time period
   */
  RASTER_MAPID = '/raster/mapid',
  /**
   * Get the time series
   */
  TIMESERIES_POINTS = '/timeseries/native',
  /**
   * Get min and max time period
   */
  DATASET_DATES = '/metadata/dataset_dates',
}
