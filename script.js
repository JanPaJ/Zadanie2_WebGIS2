"use strict"
require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Legend",
    // "esri/symbols/Symbol",
    ],(Map, SceneView, FeatureLayer, GraphicsLayer, Legend,)=>{



        const layer = new FeatureLayer({
            url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0",
        });

        const map = new Map({
            basemap: "streets-night-vector",
        });
    
        const view = new SceneView ({
            map: map,
            container: "mapDiv",
            zoom:5,
            center:[-100, 40]
        });


        let legend = new Legend({
            view: view
          });
          
          view.ui.add(legend, "bottom-right");
        

          const simpleRenderer = {
            type : "simple",
            symbol : {
                type:"point-3d",
                size: 20,
                symbolLayers: [
                    {
                        type:"object",
                        resource: {
                            primitive: "cylinder"
                        },
                        width: 50000,
                    }
                ]
            },
            visualVariables:[
                {
                    type:"color",
                    field:"MAGNITUDE",
                    stops:[
                        {
                            value: 0.5,
                            color:"green"
                        },
                        {
                            value:4.48 ,
                            color:"red"
                        }
                    ]
                },
                {
                    type:"size",
                    field:"DEPTH",
                    stops:[
                        {
                            value: -3.39,
                            size: 2000
                        },
                        {
                            value:30.97 ,
                            size: 40000
                        }
                    ]
                }
            ]
            
        };

        const layer2 = new FeatureLayer({
            url: "https://services.arcgis.com/ue9rwulIoeLEI9bj/ArcGIS/rest/services/Earthquakes/FeatureServer/0",
            renderer: simpleRenderer,
        });
        
        map.add(layer2)


        // QUERY____________________
        let query = layer.createQuery();
        query.where = "MAGNITUDE > 4"
        query.outFields = ['*'];
        query.returnGeometry = true;

        const gl = new GraphicsLayer();

        layer.queryFeatures(query)
        .then(response => {

            getResults(response.features);
            
        }).catch(err => {
            console.log(err)
        })
        
        const getResults = (features) => {
            console.log(1)
            const symbol = {
                type: "simple-marker",
                color: "red",
                size:8
            };


            features.map(elem => {
                elem.symbol = symbol
            }); 

            gl.addMany(features);
            map.add(gl)
        }
        // ______________________________
        
    });