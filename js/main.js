//Do not start until jquery and our DOM is ready...

var hoverID = null
var hoverClass = null
var selHoverID = null
var selHoverClass = null
var container
var anim = 0.3
var year = 12

var outerColor1 = [93,26,128]; //R,G,B links
var outerColor2 = [128,26,60]; //R,G,B rechts
var innerColor1 = [150,41,204]; //R,G,B links
var innerColor2 = [204,41,96]; //R,G,B rechts

var outerGreyColor1 = [37,10,51]; //R,G,B links
var outerGreyColor2 = [51,11,24]; //R,G,B rechts
var innerGreyColor1 = [75,20,102]; //R,G,B links
var innerGreyColor2 = [102,21,48]; //R,G,B rechts

var resColOuter
var resColInner

var resColOuterGrey
var resColInnerGrey

var testArr = []
var detailEl = []
var ageSpecificEl = []


var jSelectCountries
var jSelectGreyCountries
var jSelection

var birthActive = false
var ageSpecificActive = false

var scaleFactor = 1.2

$(document).ready(function () {

    for (var i = 0; i <= dataAll.length - 1; i++) {
        testArr.push(dataAll[i].pop2015)
    }
    console.log(testArr)

    document.onkeydown = function () {
        keyInput();
    };

    $(document)
        .on("mousedown", function (event) {
            mouseX = event.pageX
            $(document).bind("mousemove", function (event) {
                var currentX = event.pageX;
                if ((currentX - mouseX) > 20 && year <= 12) {
                    changeYear(false);
                    mouseX = event.pageX;

                }
                if ((mouseX - currentX) > 20 && year >= 1) {
                    changeYear(true);
                    mouseX = event.pageX;
                }
                //console.log(event.pageX);
            });
        })

        .on("mouseup", function (event) {
            $(document).unbind("mousemove");

        })

    //The code at the top is run immediately after loading the HTML page
    console.log("Starting web app, Jquery is ready");

    init();

    //Our initial setup function
    function init() {
        //Step 1: Import (automatically via HTML file) and log the used data
        //"users" is the name of the variable defined in dataset.js
        // console.log("Current working dataset:");
        // console.table(dataAll);

        //Step 2 (optional): Transform the loaded data, e.g. generating additional attributes
        //This example generates a numerical attribute for genders
        // for (var i = users.length - 1; i >= 0; i--) {
        // 	if(users[i].gender === "female") {
        // 		users[i].genderFlag = 1;
        // 	} else if(users[i].gender === "male"){
        // 		users[i].genderFlag = 2;
        // 	} else {
        // 		users[i].genderFlag = 0;
        // 	}
        // };

        container = Snap("#container")
        // var placeholder = Snap("#placeholder")
        var xOffset = 1200
        var yOffset = 800
        var multiplier = 7

        //Erzeuge platzhalter zum deaktivieren
        for (var i = 0; i <= dataAll.length - 1; i++) {
            var radiusPop = calcR(i, true, year)
            var radiusBirth = calcR(i, false, year)

            var circleGrey = container.circle(radiusPop / 2, radiusPop / 2, radiusPop / 2);
            circleGrey.attr({
                cx: dataAll[i].long * multiplier + xOffset,
                cy: dataAll[i].lat * -multiplier + yOffset,
                id: dataAll[i].location,
                fill: "#330b18",
                "class": "greyMap"

            });
            var circleGreyInner = container.circle(radiusPop / 2, radiusPop / 2, radiusBirth / 2);
            circleGreyInner.attr({
                cx: dataAll[i].long * multiplier + xOffset,
                cy: dataAll[i].lat * -multiplier + yOffset,
                id: dataAll[i].location,
                fill: "#55152d",
                "class": "greyMap"

            });

            g = container.g(circleGrey, circleGreyInner)
            g.attr({
                id: i,
                "class": "greyMap"
            })
        }

        //Erzeuge Kreise zum auswählen
        for (var i = 0; i <= dataAll.length - 1; i++) {

            var radiusPop = calcR(i, true, year)
            var radiusBirth = calcR(i, false, year)

            var circle = container.circle(radiusPop / 2, radiusPop / 2, radiusPop / 2);

            circle.attr({
                cx: dataAll[i].long * multiplier + xOffset,
                cy: dataAll[i].lat * -multiplier + yOffset,
                id: dataAll[i].location,
                fill: "#801a3c",
                "class": "map"

            });

            var circleInner = container.circle(radiusPop / 2, radiusPop / 2, radiusBirth / 2);
            circleInner.attr({
                cx: dataAll[i].long * multiplier + xOffset,
                cy: dataAll[i].lat * -multiplier + yOffset,
                id: dataAll[i].location,
                fill: "#cc2960",
                "class": "map"

            });

            g = container.g(circle, circleInner)
            g.attr({
                id: i,
                "class": "map"
            })
        }

        jSelectCountries = $("g.map")

        jSelectCountries.on("mouseenter", function () {

            hoverID = $(this)
            TweenMax.to($(this), anim, {css: {scale: getScaleFactor(hoverID), transformOrigin: "center center"}})
            //todo: function für scale negativ abhängig von radius / pop2015
            // console.log(hoverID)
        });

        jSelectCountries.on("mouseleave", function () {
            hoverID = null
            TweenMax.to($(this), anim, {css: {scale: 1, transformOrigin: "center center"}})
            // console.log(hoverID)
        });

        jSelectCountries.on("click", function () {
            selectCountry(hoverID)
        });

        jSelectGreyCountries = $("g.greyMap")

        jSelectGreyCountries.on("mouseenter", function () {
            hoverID = $(this)
            hoverClass = $(this).attr("class")
            TweenMax.to($(this), anim, {css: {scale: getScaleFactor(hoverID), transformOrigin: "center center"}})
            TweenMax.to($(".select"+this.id), anim, {css: {scale: 1.2, transformOrigin: "center center"}})
            // TweenMax.to($(".select"+this.id), anim, {x: "+=50"})
            // console.log(hoverID)
            // console.log(hoverClass)
        });

        jSelectGreyCountries.on("mouseleave", function () {
            hoverID = null
            hoverClass = null
            TweenMax.to($(this), anim, {css: {scale: 1, transformOrigin: "center center"}})
            TweenMax.to($(".select"+this.id), anim, {css: {scale: 1, transformOrigin: "center center"}})
            // TweenMax.to($(".select"+this.id), anim, {x: "-=50"})
            // console.log(hoverID)
            // console.log(hoverClass)
        });

        jSelectGreyCountries.on("click", function () {
            unSelectCountry(hoverID)
        });
    }

    function calcR(k, isPop, yearInt) {
        var radiusPop = 0
        var radiusBirth = 0

        switch (yearInt) {
            case 1:
                radiusBirth = dataAll[k].birth1960
                radiusPop = dataAll[k].pop1960
                break;
            case 2:
                radiusBirth = dataAll[k].birth1965
                radiusPop = dataAll[k].pop1965
                break;
            case 3:
                radiusBirth = dataAll[k].birth1970
                radiusPop = dataAll[k].pop1970
                break;
            case 4:
                radiusBirth = dataAll[k].birth1975
                radiusPop = dataAll[k].pop1975
                break;
            case 5:
                radiusBirth = dataAll[k].birth1980
                radiusPop = dataAll[k].pop1980
                break;
            case 6:
                radiusBirth = dataAll[k].birth1985
                radiusPop = dataAll[k].pop1985
                break;
            case 7:
                radiusBirth = dataAll[k].birth1990
                radiusPop = dataAll[k].pop1990
                break;
            case 8:
                radiusBirth = dataAll[k].birth1995
                radiusPop = dataAll[k].pop1995
                break;
            case 9:
                radiusBirth = dataAll[k].birth2000
                radiusPop = dataAll[k].pop2000
                break;
            case 10:
                radiusBirth = dataAll[k].birth2005
                radiusPop = dataAll[k].pop2005
                break;
            case 11:
                radiusBirth = dataAll[k].birth2010
                radiusPop = dataAll[k].pop2010
                break;
            case 12:
                radiusBirth = dataAll[k].birth2015
                radiusPop = dataAll[k].pop2015
                break;
        }
        // console.log(radiusPop)

        var resultRadiusPop = Math.sqrt((radiusPop / 2000) / Math.PI) * 14;

        if (!isPop) {
            var resultRadiusBirth = Math.sqrt((radiusBirth / 150) / Math.PI) * 2.4 * resultRadiusPop;
            // var resultRadiusBirth = radiusBirth / 200* 3 * resultRadiusPop;

            // console.log(resultRadiusBirth);
            return resultRadiusBirth;
        } else {
            return resultRadiusPop;
        }
    }

    var flip = true;
    function keyInput(e) {
        e = e || window.event;
        switch (e.keyCode) {
            case 65: // a swype links
                if (hoverID != undefined && hoverClass != "greyMap") selectCountry(hoverID)
                if (birthActive) hideDetailBirthAllYears()
                break;
            case 83: //s swype rechts
                if (hoverID != undefined && hoverClass != "map") unSelectCountry(hoverID)
                if (selHoverID != undefined && !birthActive) detailBirthAllYears()
                    break;
            case 37://leftarrow
                updateNodes(true);
                break;
            case 39://rightarrow
                updateNodes(false);
                break;
            case 68:// d //zoom out
                // if (selHoverID != undefined && !ageSpecificActive) {
                //     detailBirthAllYears()
                // }
                if (ageSpecificActive) hideAgeSpecific()
                break;
            case 70:// f //zoom in
                if (selHoverID != undefined && !birthActive && !ageSpecificActive) showAgeSpecific()
                break;
            case 81: // q
                if (flip) {
                    console.log("test")
                    new TimelineMax().to($("g.map, g.greyMap"), anim, {opacity: 1}).to($("g.map, g.greyMap").scale, anim, { x: 0.5, y: 0.5 }, -anim);
                    // TweenMax.to($(this), anim, {css: {scale: 1.2, transformOrigin: "center center"}})
                    flip = !flip
                } else {
                    new TimelineMax().to($("g.map, g.greyMap"), anim, {opacity: 1}).to($("g.map, g.greyMap").scale, anim, { x: 0.5, y: 0.5 }, -anim);
                    flip = !flip
                }
                break;
        }
    }

    //Selektion als Elemente
    var selectionEl = []
    //Index der selektierten Länder
    var selIndex = []
    //Elements der selektierten Länder
    var selElements = []
    //Pixel, die jedes Element zurücklegen muss um PLatz für die nächste Selektion zu schaffen (wird in Schleife aktualisiert)
    var y = null
    //Aktuelle yPosition der Selektion
    var selectionYNow = []

    var testarray2 = []
    function selectCountry(hoverIDIntern) {

        // console.log("---------------------")

        //Aktueller Index der Selektion
        var indA = selIndex.length
        // console.log(indA)
        var j = $(hoverIDIntern).attr("id")
        selIndex.push(j)
        selElements.push(hoverIDIntern)
        // console.log(j)
        //Das gehoverte Land (aktive hoverIDIntern) ausblenden
        TweenMax.to($(hoverIDIntern), anim, {
            x: "-=100", y: "0", opacity: 0
        });

        $(hoverIDIntern).css("pointer-events", "none").addClass("selected")


        //Neue Gruppe mit circles aus den Daten erzeugen
        var radiusPop = calcR(j, true, year)
        var radiusBirth = calcR(j, false, year)

        testarray2.push(j)

        // console.log(testarray2)

        resColOuter = interpolateColor(outerColor1, outerColor2, 1/12*year)
        resColInner = interpolateColor(innerColor1, innerColor2, 1/12*year)

        var circle = container.circle(radiusPop / 2, radiusPop / 2, (radiusPop / 2) * (75 / (radiusPop / 2)));
        circle.attr({
            cx: 150,
            cy: 1440 / (selIndex.length + 1) * selIndex.length,
            id: j,
            fill: "rgb("+resColOuter[0]+","+resColOuter[1]+","+resColOuter[2]+")",
            "class": "select"
        });

        var circleInner = container.circle(radiusPop / 2, radiusPop / 2, (radiusBirth / 2) * (75 / (radiusPop / 2)));
        circleInner.attr({
            cx: 150,
            cy: 1440 / (selIndex.length + 1) * selIndex.length,
            id: j,
            fill: "rgb("+resColInner[0]+","+resColInner[1]+","+resColInner[2]+")",
            "class": "select"
        });

        //Der Gruppe die Stelle im Datenarray der Auswahl mitgeben
        g = container.g(circle, circleInner)
        g.attr({
            id: j,
            x: 100,
            y: 1440 / (selIndex.length + 1) * selIndex.length,
            "class": "select select" + selIndex[indA],
            "style": "-webkit-backface-visibility: hidden"
        })

        selectionYNow[indA] = 1440 / (selIndex.length + 1) * selIndex.length


        // console.log("selIndex.length "+ selIndex.length)
        // console.log("yPos neuer Kreis: "+900 / (selIndex.length + 1) * selIndex.length)

        //Liste der selektierten Elemente
        selectionEl.push($(".select" + selIndex[indA]))

        //Eingangsanimation
        TweenMax.from(selectionEl[selectionEl.length - 1], anim, {x: 100, opacity: 0})

        for (var i = 0; i < selectionEl.length - 1; i++) {
            // console.log(i)
            //Anzahl der Selektierten Länder
            var length = selectionEl.length

            //Position nach alter Selektionsanzahl
            var yAlt = 1440 / (length) * (i+1)
            //Position nach neuer Selektionszahl
            var yNeu = 1440 / (length+1) * (i+1)

            //Differenz der Position = Offset für nötige Animation
            y = yAlt - yNeu

            selectionYNow[i] = yNeu

            TweenMax.to(selectionEl[i], anim, {y: "-="+y})
            //Achtung "-="
        }

        // console.log("//StartAdd")
        // console.log(selectionElBackup)
        // console.log(selectionEl)
        // console.log(selIndex)
        // console.log(selectionYNow)
        // console.log("//EndAdd")

        // $(".select").on("mouseenter", function () {
        //     hoverID = $(this)
        //     hoverClass = $(this).attr("class")
        // // console.log(hoverID, hoverClass)
        //     TweenMax.to($(this), anim, {css: {scale: 1.5, transformOrigin: "center center"}})
        // });

        var jSelection = $("g.select")
        jSelection.off()

        jSelection.on("mouseenter", function () {
            selHoverID = $(this)
            selHoverClass = $(this).attr('class').split(' ')[0];
            TweenMax.to(selectionEl, anim, {css: {scale: 1.2, transformOrigin: "center center"}})
            // console.log(selHoverID)
            // console.log(selHoverClass)
        });

        jSelection.on("mouseleave", function () {
            selHoverID = null
            selHoverClass = null
            TweenMax.to(selectionEl, anim, {css: {scale: 1, transformOrigin: "center center"}})
            // console.log(selHoverID)
            // console.log(selHoverClass)

        });
    }

    function unSelectCountry(hoverIDIntern) {

        var j = $(hoverIDIntern).attr("id")
        var indexofUnSelection = selIndex.indexOf(j)
        // console.log("indexod unseceltion " + indexofUnSelection)
        TweenMax.to($(selElements[indexofUnSelection]), anim, {x: "+=100", opacity: 1})
        $(selElements[indexofUnSelection]).css("pointer-events", "auto").removeClass("selected")

        //Selektion
        TweenMax.to($(selectionEl[indexofUnSelection]), anim, {
            x: "+=100", opacity: 0, onComplete: del, onCompleteParams: [indexofUnSelection]
        })
    }

    function detailBirthAllYears() {

        birthActive = true

        // console.log(selectionEl)
        // console.log(selIndex)
        // console.log(selectionYNow)

        for (var selectionPos = 0; selectionPos < selIndex.length; selectionPos++) {
            for (var year = 1; year <= 12; year++) {

                var radiusPop = calcRDetail(selIndex[selectionPos], true, year)
                var radiusBirth = calcRDetail(selIndex[selectionPos], false, year)


                resColInner = interpolateColor(innerColor1, innerColor2, 1/12*year)

                // var circle = container.circle(radiusPop / 2, radiusPop / 2, (radiusPop / 2) * (50 / (radiusPop / 2)));
                // circle.attr({
                //     cx: -60 + 120 * year,
                //     cy: selectionYNow[selectionPos],
                //     id: selectionPos,
                //     fill: "rgb("+resColOuter[0]+","+resColOuter[1]+","+resColOuter[2]+")",
                //     "class": "map"
                // });

                var circleInner = container.circle(radiusPop / 2, radiusPop / 2, (radiusBirth / 2) * (50 / (radiusPop / 2)));
                circleInner.attr({
                    //Positionierung im tween unten beachten
                    cx: -50 + 190 * year,
                    cy: selectionYNow[selectionPos],
                    id: year,
                    opacity: 0,
                    fill: "rgb("+resColInner[0]+","+resColInner[1]+","+resColInner[2]+")",
                    "class": "detail"
                });

                detailEl.push($("#"+year+".detail"))
                // console.log(detailEl)
                //Eingangsanimation

            }
        }
        TweenMax.to(detailEl, anim, {delay: 0.4, x: 100, opacity: 1})

        TweenMax.to(selectionEl, anim, {delay: 0.4,css: {scale: 1, transformOrigin: "center center"}})
        TweenMax.to(selectionEl, anim, {delay: 0.4,x: "+=50", opacity: 0}, 0.05)

        // TweenMax.staggerTo(jSelectCountries, anim, {css: {scale: 0, transformOrigin: "center center"}}, 0.001)
        // TweenMax.staggerTo(jSelectGreyCountries, anim, {css: {scale: 0, transformOrigin: "center center"}}, 0.001)

        TweenMax.staggerTo(jSelectCountries.not(".selected"), anim, {x: "+=100", opacity: 0}, 0.001)
        TweenMax.staggerTo(jSelectGreyCountries.not(".selected"), anim, {x: "+=100", opacity: 0}, 0.001)

        jSelectCountries.css("pointer-events", "none")
        jSelectGreyCountries.css("pointer-events", "none")

    }

    function hideDetailBirthAllYears() {

        birthActive = false

        TweenMax.to(detailEl, anim, {x: -100, opacity: 0, onComplete: function(){for(var i = 0; i <= detailEl.length-1; i++){
            detailEl[i].remove()}
        }})

        TweenMax.to(selectionEl, anim, {x: "-=50", opacity: 1}, 0.05)

        // TweenMax.staggerTo(jSelectCountries, anim, {css: {scale: 1, transformOrigin: "center center"}}, 0.001)
        // TweenMax.staggerTo(jSelectGreyCountries, anim, {css: {scale: 1, transformOrigin: "center center"}}, 0.001)

        TweenMax.staggerTo(jSelectCountries.not(".selected"), anim, {delay: 0.4, x: "-=100", opacity: 1}, 0.001)
        TweenMax.staggerTo(jSelectGreyCountries.not(".selected"), anim, {delay: 0.4, x: "-=100", opacity: 1}, 0.001)

        jSelectCountries.css("pointer-events", "auto")
        jSelectGreyCountries.css("pointer-events", "auto")
    }


    function showAgeSpecific() {
        //TODO:

        ageSpecificActive = true

        // console.log(selectionEl)
        // console.log(selIndex)
        // console.log(selectionYNow)

        for (var selectionPos = 0; selectionPos < selIndex.length; selectionPos++) {

            resColInner = interpolateColor(innerColor1, innerColor2, 1/12*year)

            for (var AgeGroup = 0; AgeGroup < 7; AgeGroup++) {

                var radiusBirth = calcRAgeSpecific(selIndex[selectionPos], false, year, AgeGroup+1)

                var circleInnerDetail = container.circle(radiusBirth / 2, radiusBirth / 2, radiusBirth / 2);
                circleInnerDetail.attr({
                    //Positionierung im tween unten beachten
                    cx: 720 + 150 * AgeGroup,
                    cy: selectionYNow[selectionPos],
                    id: AgeGroup,
                    opacity: 0,
                    fill: "rgb("+resColInner[0]+","+resColInner[1]+","+resColInner[2]+")",
                    "class": "AgeSpecific"+ selectionPos
                });

                ageSpecificEl.push($("#"+AgeGroup+".AgeSpecific"+selectionPos))
                //Eingangsanimation

            }
        }
        // console.log(ageSpecificEl)
        TweenMax.to(ageSpecificEl, anim, {delay: 0.4, x: 100, opacity: 1})

        // TweenMax.to(selectionEl, anim, {delay: 0.2,css: {scale: 1, transformOrigin: "center center"}})
        TweenMax.to(selectionEl, anim, {delay: 0.2,x: "+=150", opacity: 0}, 0.05)

        // TweenMax.staggerTo(jSelectCountries, anim, {css: {scale: 0, transformOrigin: "center center"}}, 0.001)
        // TweenMax.staggerTo(jSelectGreyCountries, anim, {css: {scale: 0, transformOrigin: "center center"}}, 0.001)

        TweenMax.staggerTo(jSelectCountries.not(".selected"), anim, {x: "+=100", opacity: 0}, 0.001)
        TweenMax.staggerTo(jSelectGreyCountries.not(".selected"), anim, {x: "+=100", opacity: 0}, 0.001)

        jSelectCountries.css("pointer-events", "none")
        jSelectGreyCountries.css("pointer-events", "none")
    }

    function hideAgeSpecific() {

        ageSpecificActive = false

        TweenMax.to(ageSpecificEl, anim, {x: -100, opacity: 0, onComplete: function(){for(var i = 0; i <= ageSpecificEl.length-1; i++){
            ageSpecificEl[i].remove()}
        }})

        TweenMax.to(selectionEl, anim, {x: "-=150", opacity: 1}, 0.05)

        // TweenMax.staggerTo(jSelectCountries, anim, {css: {scale: 1, transformOrigin: "center center"}}, 0.001)
        // TweenMax.staggerTo(jSelectGreyCountries, anim, {css: {scale: 1, transformOrigin: "center center"}}, 0.001)

        TweenMax.staggerTo(jSelectCountries.not(".selected"), anim, {delay: 0.4, x: "-=100", opacity: 1}, 0.001)
        TweenMax.staggerTo(jSelectGreyCountries.not(".selected"), anim, {delay: 0.4, x: "-=100", opacity: 1}, 0.001)

        jSelectCountries.css("pointer-events", "auto")
        jSelectGreyCountries.css("pointer-events", "auto")
    }

    function changeYear(toPresent) {

        if(toPresent && year < 12) {
            year++
        } else if(!toPresent && year > 1){
            year--
        } else {
            return null
        }

        resColOuter = interpolateColor(outerColor1, outerColor2, 1/12*year)
        resColInner = interpolateColor(innerColor1, innerColor2, 1/12*year)

        resColOuterGrey = interpolateColor(outerGreyColor1, outerGreyColor2, 1/12*year)
        resColInnerGrey = interpolateColor(innerGreyColor1, innerGreyColor2, 1/12*year)
        // console.log(resColInner)


        // console.log(year)
        for (var i = 0; i <= dataAll.length - 1; i++) {

            var radiusPop = calcR(i, true, year)
            var radiusBirth = calcR(i, false, year)

            // console.log(radiusBirth)
            // console.log(radiusPop)

            // console.log($("#"+i+".map").find("circle:first-child"))



            var selectMap = $("#"+i+".map")
            var selectGreyMap = $("#"+i+".greyMap")

            TweenMax.to(selectMap.find("circle:first-child"), anim, {attr:{ r: radiusPop/2,  fill: "rgb("+resColOuter[0]+","+resColOuter[1]+","+resColOuter[2]+")"}})
            TweenMax.to(selectMap.find("circle:last-child"), anim, {attr:{ r: radiusBirth/2, fill: "rgb("+resColInner[0]+","+resColInner[1]+","+resColInner[2]+")"}})
            TweenMax.to(selectGreyMap.find("circle:first-child"), anim, {attr:{ r: radiusPop/2, fill: "rgb("+resColOuterGrey[0]+","+resColOuterGrey[1]+","+resColOuterGrey[2]+")"}})
            TweenMax.to(selectGreyMap.find("circle:last-child"), anim, {attr:{ r: radiusBirth/2, fill: "rgb("+resColInnerGrey[0]+","+resColInnerGrey[1]+","+resColInnerGrey[2]+")"}})
        }

        for (var i = 0; i <= selIndex.length - 1; i++) {

            radiusPop = calcR(selIndex[i], true, year)
            radiusBirth = calcR(selIndex[i], false, year)

            var selectSelection = $("#"+selIndex[i]+".select")

            // console.log(selectSelection)

            TweenMax.to(selectSelection.find("circle:first-child"), anim, {attr:{ r: (radiusPop / 2) * (50 / (radiusPop / 2)), fill: "rgb("+resColOuter[0]+","+resColOuter[1]+","+resColOuter[2]+")"}})
            TweenMax.to(selectSelection.find("circle:last-child"), anim, {attr:{ r: (radiusBirth / 2) * (50 / (radiusPop / 2)), fill: "rgb("+resColInner[0]+","+resColInner[1]+","+resColInner[2]+")"}})
        }


        // console.log(selIndex)
        for (var selectionPos = 0; selectionPos < selectionEl.length; selectionPos++) {
            for (var AgeGroup = 0; AgeGroup < 7; AgeGroup++) {

                var selectAgeSpecific = $("#"+AgeGroup+".AgeSpecific"+selectionPos)

                // console.log(selectAgeSpecific)
                var radiusAgeSpecific = calcRAgeSpecific(selIndex[selectionPos], false, year, AgeGroup+1)
                TweenMax.to(selectAgeSpecific, anim, {attr:{ r: radiusAgeSpecific / 2, fill: "rgb("+resColInner[0]+","+resColInner[1]+","+resColInner[2]+")"}})

            }
        }
    }

    var interpolateColor = function(color1, color2, factor) {
        if (arguments.length < 3) { factor = 0.5; }
        var result = color1.slice();
        for (var i=0;i<3;i++) {
            result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]));
        }
        return result;
    };

    function del(indexofUnSelection) {

        $(selectionEl[indexofUnSelection]).remove()
        selElements.splice(indexofUnSelection, 1)
        selectionEl.splice(indexofUnSelection, 1)
        selIndex.splice(indexofUnSelection, 1)
        selectionYNow.splice(indexofUnSelection, 1)

        // console.log("//StartRemove")
        // console.log(selectionEl)
        // console.log(selIndex)
        // console.log(selectionYNow)
        // console.log("--------------")

        for (var i = 0; i < selectionEl.length; i++) {
            // console.log(i)
            var length = selectionEl.length

            var PosAkt = selectionYNow[i]
            var PosZiel = 1440 / (length+1) * (i+1)


            y = PosAkt - PosZiel
            selectionYNow[i] += -y

            // console.log("Selektion "+i)
            // console.log("Length: "+length)
            // console.log(selectionYNow[i])
            // console.log("Ziel: "+PosZiel)
            // console.log("Start: "+PosAkt)
            // console.log("Y: "+y)
            // console.log("//EndRemove")

            TweenMax.to(selectionEl[i], anim, {y: "-="+y})
            //Achtung "-="
        }

    }
});
function calcRDetail(k, isPop, yearInt) {
    var radiusPop = 0
    var radiusBirth = 0

    switch (yearInt) {
        case 1:
            radiusBirth = dataAll[k].birth1960
            radiusPop = dataAll[k].pop1960
            break;
        case 2:
            radiusBirth = dataAll[k].birth1965
            radiusPop = dataAll[k].pop1965
            break;
        case 3:
            radiusBirth = dataAll[k].birth1970
            radiusPop = dataAll[k].pop1970
            break;
        case 4:
            radiusBirth = dataAll[k].birth1975
            radiusPop = dataAll[k].pop1975
            break;
        case 5:
            radiusBirth = dataAll[k].birth1980
            radiusPop = dataAll[k].pop1980
            break;
        case 6:
            radiusBirth = dataAll[k].birth1985
            radiusPop = dataAll[k].pop1985
            break;
        case 7:
            radiusBirth = dataAll[k].birth1990
            radiusPop = dataAll[k].pop1990
            break;
        case 8:
            radiusBirth = dataAll[k].birth1995
            radiusPop = dataAll[k].pop1995
            break;
        case 9:
            radiusBirth = dataAll[k].birth2000
            radiusPop = dataAll[k].pop2000
            break;
        case 10:
            radiusBirth = dataAll[k].birth2005
            radiusPop = dataAll[k].pop2005
            break;
        case 11:
            radiusBirth = dataAll[k].birth2010
            radiusPop = dataAll[k].pop2010
            break;
        case 12:
            radiusBirth = dataAll[k].birth2015
            radiusPop = dataAll[k].pop2015
            break;
    }
    // console.log(radiusPop)

    var resultRadiusPop = Math.sqrt((radiusPop / 2000) / Math.PI) * 16;

    if (!isPop) {
        // var resultRadiusBirth = Math.sqrt((radiusBirth / 150) / Math.PI) * 2 * resultRadiusPop;
        var resultRadiusBirth = radiusBirth / 200* 3 * resultRadiusPop;

        // console.log(resultRadiusBirth);
        return resultRadiusBirth;
    } else {
        return resultRadiusPop;
    }
}

function calcRAgeSpecific(k, isPop, yearInt, AgeGroup) {
    var radiusBirth = 0
    var dataAgeGroup = ""

    switch (AgeGroup) {
        case 1:
            dataAgeGroup = AgeSpecific_1
            break;
        case 2:
            dataAgeGroup = AgeSpecific_2
            break;
        case 3:
            dataAgeGroup = AgeSpecific_3
            break;
        case 4:
            dataAgeGroup = AgeSpecific_4
            break;
        case 5:
            dataAgeGroup = AgeSpecific_5
            break;
        case 6:
            dataAgeGroup = AgeSpecific_6
            break;
        case 7:
            dataAgeGroup = AgeSpecific_7
            break;

    }

    switch (yearInt) {
        case 1:
            radiusBirth = dataAgeGroup[k].spec1960
            break;
        case 2:
            radiusBirth = dataAgeGroup[k].spec1965
            break;
        case 3:
            radiusBirth = dataAgeGroup[k].spec1970
            break;
        case 4:
            radiusBirth = dataAgeGroup[k].spec1975
            break;
        case 5:
            radiusBirth = dataAgeGroup[k].spec1980
            break;
        case 6:
            radiusBirth = dataAgeGroup[k].spec1985
            break;
        case 7:
            radiusBirth = dataAgeGroup[k].spec1990
            break;
        case 8:
            radiusBirth = dataAgeGroup[k].spec1995
            break;
        case 9:
            radiusBirth = dataAgeGroup[k].spec2000
            break;
        case 10:
            radiusBirth = dataAgeGroup[k].spec2005
            break;
        case 11:
            radiusBirth = dataAgeGroup[k].spec2010
            break;
        case 12:
            radiusBirth = dataAgeGroup[k].spec2015
            break;
    }
        var resultRadiusBirth = Math.sqrt((radiusBirth) / Math.PI) * 14;
        // console.log(resultRadiusBirth);
        return resultRadiusBirth;
}

function getScaleFactor(getThis) {
    console.log($(getThis))

    if($(getThis).find("circle:first-child").attr("r") >= 15) scaleFactor = 1.2
    if($(getThis).find("circle:first-child").attr("r") < 15) scaleFactor = 1.5
    if($(getThis).find("circle:first-child").attr("r") < 8) scaleFactor = 2
    if($(getThis).find("circle:first-child").attr("r") < 6) scaleFactor = 3
    if($(getThis).find("circle:first-child").attr("r") < 4) scaleFactor = 5
    if($(getThis).find("circle:first-child").attr("r") < 3) scaleFactor = 5.5
    if($(getThis).find("circle:first-child").attr("r") < 2) scaleFactor = 6

    return scaleFactor
}