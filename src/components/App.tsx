// import React, { useEffect, createContext, useState, useMemo } from 'react';
import React, { useEffect } from 'react';

import makeStyles from '@mui/styles/makeStyles';

import { CEPanelContent } from './CEPanelContent';
// import { GEEPanelContent } from './GEEPanelContent';

import translationEn from '../../public/locales/en-CA/translation.json';
import translationFr from '../../public/locales/fr-CA/translation.json';

import {
  TypeIconButtonProps,
  TypePanelProps,
  TypeWindow,
} from 'geoview-core-types';

// get reference to window object
const w = window as TypeWindow;

// get reference to geoview apis
const cgpv = w['cgpv'];

/**
 * main container and map styling
 */
const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
  },
}));

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

      const MapIcon = cgpv.ui.elements.MapIcon;

      // button props
      const ceButton: TypeIconButtonProps = {
        // set ID to ceButtonPanel so that it can be accessed from the core viewer
        id: 'ceButtonPanel',
        tooltip: translations[language].custom.cePanelTitle,
        tooltipPlacement: 'right',
        children: <MapIcon />,
        visible: true,
      };

      // panel props
      const cePanel: TypePanelProps = {
        title: translations[language].custom.cePanelTitle,
        icon: <MapIcon />,
        width: 300,
      };

      // create a new button panel on the appbar
      const ceButtonPanel = cgpv.api
        .map('mapWM')
        .appBarButtons.createAppbarPanel(ceButton, cePanel, null);

      // set panel content
      ceButtonPanel?.panel?.changeContent(
        <CEPanelContent buttonPanel={ceButtonPanel} mapId={'mapWM'} />,
      );

      // // create Google Earth Engine Panel
      // // button props
      // const geeButton = {
      //   // set ID to geeButtonPanel so that it can be accessed from the core viewer
      //   id: 'geeButtonPanel',
      //   tooltip: translations[language].custom.geePanelTitle,
      //   tooltipPlacement: 'right',
      //   icon: '<i class="material-icons">public</i>',
      //   visible: true,
      //   type: 'icon',
      // };

      // // panel props
      // const geePanel = {
      //   title: translations[language].custom.geePanelTitle,
      //   icon: '<i class="material-icons">public</i>',
      //   width: 300,
      // };

      // // create a new button panel on the appbar
      // const geeButtonPanel = cgpv.api
      //   .map('mapWM')
      //   .appBarButtons.createAppbarPanel(geeButton, geePanel, null);

      // // set panel content
      // geeButtonPanel?.panel?.changeContent(
      //   <GEEPanelContent buttonPanel={geeButtonPanel} mapId={'mapWM'} />,
      // );
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
      data-lang="en-CA"
      data-config="{
        'map': {
          'interaction': 'dynamic',
          'initialView': {
            'zoom': 4,
            'center': [-100, 60]
          },
          'projection': 3857,
          'basemapOptions': {
            'id': 'transport',
            'shaded': false,
            'labeled': true
          },
          'layers': []
        },
        'theme': 'dark',
        'languages': ['en-CA']
        }"
    ></div>
  );
};

export default App;
