import Chart from 'chart.js/auto';

import { API } from '../utils/api';
import { StateContext, TypeStateContext } from './CEPanelContent';

import {
  TypeIconButtonProps,
  TypePanelProps,
  TypeWindow,
} from 'geoview-core-types';

const w = window as TypeWindow;

const cgpv = w['cgpv'];

const { makeStyles } = cgpv.ui;

const useStyles = makeStyles((theme: any) => ({
  fieldSetContainer: {
    marginTop: 10,
    marginBottom: 10,
    maxWidth: 400,
  },
  fieldSetField: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
}));

export const ClimateEngine = (): JSX.Element => {
  const { ui, react, types, api } = cgpv;

  const { useState, useEffect, useContext, useCallback } = react;

  const [loaded, setLoaded] = useState(false);
  const [inProcess, setInProcess] = useState(false);

  const [loadedLayer, setLoadedLayer] = useState<string>();
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dataset, setDataset] = useState('LANDSAT8_SR');
  const [variable, setVariable] = useState('NDVI');
  const [variables, setVariables] = useState([]);

  const state = useContext(StateContext);

  const { auth, mapId, buttonPanel } = state;

  const { apiKey, deleteApiKey } = auth;

  const { Select, TextField, Button, CircularProgress } = ui.elements;
  // const { ListSubheader } = mui;

  const classes = useStyles();

  const map = api.map(mapId).map;

  const { MapIcon } = ui.elements;

  /**
   * Load the map layer for the selected date range on selected dataset and variable
   */
  const loadMapLayer = async () => {
    const result = (await API.getMapLayer(
      dataset,
      variable,
      startDate,
      endDate,
      apiKey,
    )) as any;

    if (!result.details) {
      const basemapUrl = result.tile_fetcher;

      // remove previous layer if exists
      if (loadedLayer) api.map(mapId).layer.removeLayerById(loadedLayer);

      // add the new layer
      const config: any = {
        'geoviewLayerType': 'xyzTiles',
        'initialSettings': { 'visible': true },
        'listOfLayerEntryConfig': [
          { 'layerId': 'toner', 'source': { 'dataAccessPath': { 'en': basemapUrl } } }
        ]
      };
      const layerId = api.map(mapId).layer.addLayer(config);

      setLoadedLayer(layerId);

      // once done, notify user
      api.event.emit(
        types.snackbarMessagePayload(
          api.eventNames.SNACKBAR.EVENT_SNACKBAR_OPEN,
          mapId,
          {
            type: 'key',
            value: 'Processing Finished',
            params: [],
          },
        ),
      );
    }
  };

  /**
   * Get the date range for selected dataset
   */
  const getDateRange = async () => {
    // get supported date range for time series
    const dateRange = (await API.getTimePeriodRange(dataset, apiKey)) as any;

    if (!dateRange.details) {
      setMinDate(dateRange.min);
      setMaxDate(dateRange.max);

      setStartDate(dateRange.max);
      setEndDate(dateRange.max);
    }
  };

  /**
   * Get time series for selected date range on selected dataset and variable
   * then display a chart with the available points
   *
   * @param {number} lat latitude value
   * @param {number} lng longtitude value
   */
  const getTimeSeries = async (lat: number, lng: number) => {
    const result = (await API.getTimeSeries(
      lat,
      lng,
      dataset,
      variable,
      startDate,
      endDate,
      apiKey,
    )) as any;

    if (!result.details) {
      if (!Array.isArray(result)) {
        api.event.emit(
          types.snackbarMessagePayload(
            api.eventNames.SNACKBAR.EVENT_SNACKBAR_OPEN,
            mapId,
            {
              type: 'key',
              value: 'No points found',
              params: [],
            },
          ),
        );
      } else {
        let labels: string[] = [];
        let data: number[] = [];

        for (var i = 0; i < result[0].length; i++) {
          let value = result[0][i][variable];

          if (value === -9999) value = 0;

          labels.push(result[0][i].Date);
          data.push(value);
        }

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: variable,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data,
            },
          ],
        };

        const config = {
          type: 'line',
          data: chartData,
          options: {},
        };

        api.map(mapId).modal.modals['chartContainerModal'].open();

        const chartElement = document.getElementById('chartContainer');

        if (chartElement) {
          chartElement.outerHTML = '<canvas id="chartContainer"></canvas>';
        }

        const chart = new Chart(
          document.getElementById('chartContainer') as HTMLCanvasElement,
          config as any,
        );
      }
    }
  };

  /**
   * Get the variables for the dataset
   *
   * @param {string} dataset the selected dataset
   */
  const getVariableByDataset = async (dataset: string) => {
    let res = (await API.getDatasetVariables(dataset, apiKey)) as any;

    if (res.variables && res.variables.length > 0) {
      cgpv.api.map('mapWM').modal.modals['chartContainerModal'].update({
        content: '',
        header: {
          title: dataset,
        },
      });

      setDataset(dataset);
      setVariables(res.variables);
      setVariable(res.variables[0]);

      getDateRange();
    }
  };

  const mapClick = (e: any) => {
    const point = e.coordinate;

    const coordinate = api.projection.transformPoints(
      e.coordinate,
      'EPSG:3857',
      'EPSG:4326',
    )[0] as number[];

    // get time series at the click location and open a chart
    getTimeSeries(coordinate[1], coordinate[0]);

    api.map(mapId).layer.vector?.deleteGeometry('clickPosition');

    api
      .map(mapId)
      .layer.vector?.addMarker([point[0], point[1]], {}, 'clickPosition');
  };

  useEffect(() => {
    // TODO: Do not load automatically
    // if (startDate.length && endDate.length && !loaded) {
    //   setLoaded(true);
    //   api.map(mapId).removeComponent('loadingIndicator');

    //   loadMapLayer();
    // }

    // listen to map click events
    map.on('click', mapClick);

    return () => {
      map.un('click', mapClick);
    };
  }, [startDate, endDate, loaded, variable]);

  useEffect(() => {
    const panelContainerQuery =
      document.getElementsByClassName('MuiPaper-root');

    if (panelContainerQuery && panelContainerQuery.length > 0) {
      const panelContainer = panelContainerQuery[0] as HTMLElement;

      panelContainer.style.width = 410 + 'px';
    }

    createProcessProgressModal();
    createChartModal();

    getVariableByDataset(dataset);

    // By pass the hidden form and first load
    setLoaded(true)
    // TODO: make it work = add a loading indicator to map
    // api
    //   .map(mapId)
    //   .addComponent('loadingIndicator', <CircularProgress isLoaded={loaded} />);
  }, []);

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

  /**
   * Create a chart modal
   */
  const createChartModal = () => {
    cgpv.api.map('mapWM').modal.createModal({
      id: 'chartContainerModal',
      content: <canvas id="chartContainer"></canvas>,
      width: 750,
      header: {
        title: dataset,
      },
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
                <Select
                  id="dataset"
                  value={dataset}
                  onChange={(e: any) => getVariableByDataset(e.target.value)}
                  inputLabel={{
                    id: 'select-dataset',
                  }}
                  menuItems={[
                    {
                      type: 'header',
                      item: {
                        children: 'Landsat At-Surface Reflectance',
                      },
                    },
                    {
                      item: {
                        value: 'LANDSAT7_SR',
                        children: 'Landsat 7 Surface Reflectance',
                      },
                    },
                    {
                      item: {
                        value: 'LANDSAT8_SR',
                        children: 'Landsat 8 Surface Reflectance',
                      },
                    },
                    {
                      type: 'header',
                      item: {
                        children: 'Landsat Top-Of-Atmosphere Reflectance',
                      },
                    },
                    {
                      item: {
                        value: 'LANDSAT7_TOA',
                        children: 'Landsat 7 TOA Reflectance',
                      },
                    },
                    {
                      item: {
                        value: 'LANDSAT8_TOA',
                        children: 'Landsat 8 TOA Reflectance',
                      },
                    },
                  ]}
                />
              </div>
              <div className={classes.fieldSetField}>
                <label htmlFor="variable">Variable:</label>
                <Select
                  id="variable"
                  value={variable}
                  onChange={(e: any) => setVariable(e.target.value)}
                  inputLabel={{
                    id: 'select-variable',
                  }}
                  menuItems={variables.map((item: string) => {
                    return {
                      key: item,
                      item: {
                        value: item,
                        children: item,
                      },
                    };
                  })}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className={classes.fieldSetContainer}>
            <legend>Time Period</legend>
            <div>
              <div>
                Range: {minDate} to {maxDate}
              </div>
              <div className={classes.fieldSetField}>
                <label htmlFor="startDate">Start Date:</label>
                <TextField
                  id="startDate"
                  type="date"
                  value={startDate}
                  inputProps={{
                    min: minDate,
                    max: maxDate,
                    style: { backgroundColor: '#fff' },
                  }}
                  onChange={(e: any) => setStartDate(e.target.value)}
                />
              </div>
              <div className={classes.fieldSetField}>
                <label htmlFor="endDate">End Date:</label>
                <TextField
                  id="endDate"
                  type="date"
                  value={endDate}
                  inputProps={{
                    min: minDate,
                    max: maxDate,
                    style: { backgroundColor: '#fff' },
                  }}
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
