// jshint esversion: 8
// jshint maxerr: 1000

"use strict";  // JavaScript code is executed in "strict mode"

/**
* @desc TwittStorm, Geosoftware 2, WiSe 2019/2020
* @author Jonathan Bahlmann, Katharina Poppinga, Benjamin Rieke, Paula Scharf
*/



/**
* @desc Enables drawing polygons in a map, using mapbox-gl-draw.
* Drawn polygons can be edited and deleted.
* ...... TWITTERWEITERVERARBEITUNG ......
*
* @author Katharina Poppinga
* @param {mapbox-map} map mapbox-map in which the polygons shall be drawn
* @param {} draw
*/
function drawForAOI(map, draw) {

	// ************************ events for drawn polygons ************************
	// https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/API.md

	// if a polygon is drawn ...
	map.on('draw.create', function (e) {
		// all currently drawn polygons
		let data = draw.getAll();

		let pids = [];

		// ID of the added feature
		const lid = data.features[data.features.length - 1].id;

		data.features.forEach((f) => {
			if (f.geometry.type === 'Polygon' && f.id !== lid) {
				pids.push(f.id)
			}
		});
		draw.delete(pids);

		let coordinatesAOI = e.features[0].geometry.coordinates[0];

		// *************************************************************************
		// putting together the AOI-string for URL (for permalink-functionality) and write this AOI-string into URL:
		let aoiString =	"[[" + coordinatesAOI[0].toString() + "]";

		for (let i = 1; i < coordinatesAOI.length; i++) {
			aoiString = aoiString + ",[" + coordinatesAOI[i].toString() + "]";
		}
		aoiString = aoiString + "]";

		// TODO: oder nach zoomToCoordinates erst??
		updateURL("aoi", aoiString);
		// *************************************************************************

		//
		zoomToCoordinates(coordinatesAOI);
		onlyShowUnwetterAndTweetsInPolygon(turf.polygon(e.features[0].geometry.coordinates));
	});

	// if a polygon is deleted ...
	map.on('draw.delete', function (e) {
		showAllUnwetterAndNoTweets();
	});

	// if a polygon is edited/updated ...
	map.on('draw.update', function (e) {
		zoomToCoordinates(e.features[0].geometry.coordinates[0]);
		onlyShowUnwetterAndTweetsInPolygon(turf.polygon(e.features[0].geometry.coordinates));
	});

	// if a polygon is selected or deselected ...
	map.on('draw.selectionchange', function (e) {
		console.log("drawnPolygons-selectionchanged:");
		console.log(e.features);
	});

	//
	map.on('draw.modechange', function (e) {
		popupsEnabled = (e.mode !== "draw_polygon");
	})
}
