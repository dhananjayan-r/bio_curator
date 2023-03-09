function venndiagram(dat, forResult){
    function intersection(array1,array2){
	    return array1.filter(x => array2.includes(x)).length
	}

    document.getElementById("container").innerHTML = `<h2>Venn diagram for ${forResult}</h2><p>This venn diagram is plot by default first one/two/three gene panel and it gene<p>`

    genepanels = []
    keys = Object.keys(dat)
    values = Object.values(dat)

    for(var i=0;i<keys.length;i++){
        genepanels.push(keys[i].replace('<sup>&copy;</sup>',' ').replace('<sup>TM</sup>',' '))
    }


    anychart.onDocumentReady(function () {
            if(genepanels.length == 1){
                var	venn = [
                    {x: genepanels[0], custom_field:values[0].length, value: 10, fill: "#bf4000 0.5"}
                ]
            }
            else if(genepanels.length == 2){
                var	venn = [
                    {x: genepanels[0], custom_field:values[0].length, value: 10, fill: "#bf4000 0.5"},
                    {x: genepanels[1], custom_field:values[1].length, value: 10, fill: "#59bf00 0.5"},
                    {x: [genepanels[0],genepanels[1]], custom_field:intersection(values[0],values[1]), value: 5,name :"common of "+genepanels[0]+" & "+genepanels[1], fill: "#00bf06 0.5"}
                ];
            }

            else {
                intersect1 = values[0].filter(x => values[1].includes(x))
                intersect2 = intersect1.filter(x => values[2].includes(x)).length
                console.log(values[0].length)
                var	venn = [
                        {x: genepanels[0], custom_field:values[0].length, value: 10, fill: "#bf4000 0.5"},
                        {x: genepanels[1], custom_field:values[1].length, value: 10, fill: "#59bf00 0.5"},
                        {x: genepanels[2], custom_field:values[2].length, value: 10, fill: "#bf000d 0.5"},
                        {x: [genepanels[0],genepanels[1]], custom_field: intersection(values[0],values[1]), value: 5, name :"common of "+genepanels[0]+" & "+genepanels[1], fill: "#00bf06 0.5"},
                        {x: [genepanels[0],genepanels[2]], custom_field: intersection(values[0],values[2]), value: 5, name :"common of "+genepanels[0]+" & "+genepanels[2], fill: "9fbf00 0.5"},
                        {x: [genepanels[2],genepanels[1]], custom_field: intersection(values[2],values[1]), value: 5, name :"common of "+genepanels[2]+" & "+genepanels[1], fill: "bf7900 0.5"},
                        {x: [genepanels[0],genepanels[1],genepanels[2]], custom_field: intersect2, value: 5, name :"common of "+genepanels[0]+" & "+genepanels[1]+" & "+genepanels[2]}
                    ];
            }
            // create venn diagram
            var chart = anychart.venn(venn);

            // configure labels of circles
            chart.labels().format("{%custom_field}");

            // configure labels of intersections
            chart.intersections().labels().format("{%custom_field}");

            // configure tooltips of circles
            chart.tooltip().format(
                "gene: {%custom_field}"
            );
            chart.tooltip().fontSize(10);
            chart.tooltip().width(500)
            chart.tooltip().height(100)
            // set container id for the chart
            chart.container('container');

            // initiate chart drawing
            chart.draw();

            // chart.legend(true);

            // chart.labels(false);

        });


}
