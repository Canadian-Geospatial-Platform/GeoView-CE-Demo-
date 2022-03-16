import React, { useEffect, createContext, useState, useMemo } from 'react';

import makeStyles from '@mui/styles/makeStyles';

import { PanelContent } from './PanelContent';

/**
 * main container and map styling
 */
const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
  },
}));

// get reference to window object
const w = window as any;

// get reference to geoview apis
const cgpv = w['cgpv'];

import translationEn from '../../public/locales/en-CA/translation.json';
import translationFr from '../../public/locales/fr-CA/translation.json';

/**
 * Create a container containing a leaflet map using the GeoView viewer
 *
 * @returns {JSX.Elemet} the element that creates the container and the map
 */
const App = (): JSX.Element => {
  const classes = useStyles();

  /**
   * initialize the map after it has been loaded
   */
  useEffect(() => {
    cgpv.init(() => {
      /**
       * translations object to inject to the viewer translations
       */
      const translations = {
        'en-CA': translationEn,
        'fr-CA': translationFr,
      };

      // get map instance
      const mapInstance = cgpv.api.map('mapWM');

      // add custom languages
      mapInstance.i18nInstance.addResourceBundle(
        'en-CA',
        'translation',
        translations['en-CA'],
        true,
        false,
      );
      mapInstance.i18nInstance.addResourceBundle(
        'fr-CA',
        'translation',
        translations['fr-CA'],
        true,
        false,
      );

      // get language
      const { language }: { language: 'en-CA' | 'fr-CA' } = mapInstance;

      // button props
      const button = {
        // set ID to testPanelButton so that it can be accessed from the core viewer
        id: 'testPanelButton',
        tooltip: translations[language].custom.panelTitle,
        tooltipPlacement: 'right',
        icon: '<i class="material-icons">map</i>',
        visible: true,
        type: 'icon',
      };

      // panel props
      const panel = {
        title: translations[language].custom.panelTitle,
        icon: '<i class="material-icons">map</i>',
        width: 300,
      };

      // create a new button panel on the appbar
      const buttonPanel = cgpv.api
        .map('mapWM')
        .appBarButtons.createAppbarPanel(button, panel, null);

      // set panel content
      buttonPanel?.panel?.changeContent(
        <PanelContent buttonPanel={buttonPanel} mapId={'mapWM'} />,
      );
    });
  }, []);

  return (
    <div
      id="mapWM"
      className={`llwp-map ${classes.container}`}
      style={{
        height: '100vh',
        zIndex: 0,
      }}
      data-leaflet="{ 'name': 'Web Mercator', 'projection': 3857, 'zoom': 4, 'center': [60,-96], 'language': 'en-CA', 'basemapOptions': { 'id': 'transport', 'shaded': false, 'labeled': true }, 'layers': [] } "
    ></div>
  );
};

export default App;
