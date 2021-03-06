import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from "./Home";
import Application from "./Application";
import PackList from "./PackList";
import CollectionEditor from "./CollectionEditor";

const Router = createStackNavigator(
  {
    Home: { screen: Home },
    PackList: { screen: PackList },
    Application: { screen: Application },
    CollectionEditor: { screen: CollectionEditor }
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
);

export default createAppContainer(Router);