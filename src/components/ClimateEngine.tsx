import { API } from '../utils/api';
import { StateContext } from './PanelContent';

const w = window as any;

const cgpv = w['cgpv'];

const { makeStyles } = cgpv.ui;

const useStyles = makeStyles((theme: any) => ({
  fieldSetContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  fieldSetField: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
}));

export const ClimateEngine = (): JSX.Element => {
  const { ui, mui, react, types, api, leaflet } = cgpv;

  const { tileLayer } = leaflet;

  const { useState, useEffect, useContext, useCallback } = react;

  const [loaded, setLoaded] = useState(false);
  const [inProcess, setInProcess] = useState(false);

  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dataset, setDataset] = useState('LANDSAT8_SR');
  const [variable, setVariable] = useState('NDVI');

  const state = useContext(StateContext);

  const { auth, mapId, buttonPanel } = state;

  const { apiKey, deleteApiKey } = auth;

  const { Button, CircularProgress } = ui.elements;
  const { TextField, Select, MenuItem } = mui;

  const classes = useStyles();

  /**
   * Load the map layer for the selected date range on selected dataset and variable
   */
  const loadMapLayer = async () => {
    // api.map(mapId).modal.modals['processIndicator'].open();

    const result = (await API.getMapLayer(
      dataset,
      variable,
      startDate,
      endDate,
      apiKey,
    )) as any;

    if (!result.details) {
      const basemapUrl = result.tile_fetcher;

      // const basemap = {
      //   id: result['map_id'],
      //   name: 'Dataset from ' + startDate + ' to ' + endDate,
      //   type: 'transport',
      //   description: '',
      //   descSummary: '',
      //   altText: '',
      //   thumbnailUrl: '',
      //   layers: [
      //     {
      //       id: 'transport',
      //       type: 'transport',
      //       url: basemapUrl,
      //       opacity: result.colormap_options.opacity,
      //       basemapPaneName: 'transport',
      //       options: {
      //         tms: false,
      //         tileSize: 1,
      //         noWrap: false,
      //         attribution: false,
      //       },
      //     },
      //   ],
      //   attribution: '',
      //   zoomLevels: {
      //     min: result.colormap_options.min,
      //     max: result.colormap_options.max,
      //   },
      // };

      // api.map(mapId).basemap.createBasemap(basemap);

      // api.map(mapId).basemap.setBasemap(result['map_id']);

      tileLayer(basemapUrl).addTo(api.map(mapId).map);

      buttonPanel.panel.close();
      // api.map(mapId).modal.modals['processIndicator'].close();
    }
  };

  /**
   * Get the date range for selected dataset
   */
  const getDateRange = useCallback(async () => {
    // get supported date range for time series
    const dateRange = (await API.getTimePeriodRange(dataset, apiKey)) as any;

    if (!dateRange.details) {
      setMinDate(dateRange.min);
      setMaxDate(dateRange.max);

      setStartDate(dateRange.max);
      setEndDate(dateRange.max);
    }

    if (startDate && endDate) {
      setLoaded(true);
      api.map(mapId).removeComponent('loadingIndicator');

      loadMapLayer();
    }
  }, [startDate, endDate]);

  /**
   * Get time series for selected date range on selected dataset and variable
   * then display a chart with the available points
   *
   * @param {number} lat latitude value
   * @param {number} lng longtitude value
   */
  const getTimeSeries = async (lat: number, lng: number) => {
    const result = await API.getTimeSeries(
      lat,
      lng,
      dataset,
      variable,
      startDate,
      endDate,
      apiKey,
    );

    if (!Array.isArray(result)) {
      api.event.emit(api.eventNames.EVENT_SNACKBAR_OPEN, mapId, {
        message: {
          type: 'key',
          value: 'No points found',
          params: [],
        },
      });
    } else {
      let values = [];
      for (var i = 0; i < result[0].length; i++) {
        let value = result[0][i].NDVI;

        if (value === -9999) value = 0;

        values.push([result[0][i].Date, value]);
      }

      console.log(values);
    }
  };

  useEffect(() => {
    createProcessProgressModal();
  }, []);

  useEffect(() => {
    getDateRange();

    // add a loading indicator to map
    api
      .map(mapId)
      .addComponent('loadingIndicator', <CircularProgress isLoaded={loaded} />);

    // listen to map click events
    const map = api.map(mapId).map;

    map.on('click', (e: any) => {
      const point = e.latlng;

      getTimeSeries(point.lat, point.lng);
    });

    return () => {
      map.off('click');
    };
  }, [getDateRange]);

  /**
   * Create a loading progress modal
   */
  const createProcessProgressModal = () => {
    const modalId = 'processIndicator';

    api.map(mapId).modal.createModal({
      id: modalId,
      content: <CircularProgress isLoaded={inProcess} />,
    });
  };

  return (
    <div>
      <Button
        tooltip="Logout"
        tooltipPlacement="right"
        type="text"
        variant="contained"
        onClick={() => {
          deleteApiKey();
        }}
      >
        Logout
      </Button>
      {loaded && (
        <div>
          <fieldset className={classes.fieldSetContainer}>
            <legend>Variables</legend>
            <div>
              <div className={classes.fieldSetField}>
                <label htmlFor="dataset">Dataset:</label>
                <Select id="dataset" value={dataset} disabled>
                  <MenuItem value="LANDSAT8_SR">LANDSAT8_SR</MenuItem>
                </Select>
              </div>
              <div className={classes.fieldSetField}>
                <label htmlFor="variable">Variable:</label>
                <Select id="variable" value={variable} disabled>
                  <MenuItem value="NDVI">NDVI</MenuItem>
                </Select>
              </div>
            </div>
          </fieldset>
          <fieldset className={classes.fieldSetContainer}>
            <legend>Time Period</legend>
            <div>
              <div className={classes.fieldSetField}>
                <label htmlFor="startDate">Start Date:</label>
                <TextField
                  id="startDate"
                  type="date"
                  inputProps={{ value: startDate, min: minDate, max: maxDate }}
                  onChange={(e: any) => setStartDate(e.target.value)}
                />
              </div>
              <div className={classes.fieldSetField}>
                <label htmlFor="endDate">End Date:</label>
                <TextField
                  id="endDate"
                  type="date"
                  inputProps={{ value: endDate, min: minDate, max: maxDate }}
                  onChange={(e: any) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <Button
            tooltip="Process Data"
            tooltipPlacement="right"
            type="text"
            variant="contained"
            onClick={() => loadMapLayer()}
          >
            Process Data
          </Button>
        </div>
      )}
    </div>
  );
};
