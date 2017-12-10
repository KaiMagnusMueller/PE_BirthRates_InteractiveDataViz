# PE_BirthRates_InteractiveDataViz
Final version of my PE II WS 16/17 project

### About the Project

This project uses open data supplied by the UN about fertility rates (childs per 100 women in the corresponding year) of most countries, age distribution of mothers and their total populations. Additionally, I used Googles coordinate data to map each countries data to its geographic center. Each datapoint was available every 5 years from 1960 to 2015. This makes it possible to see how each country changed in the past 55 years.

### How it works

The user can select countries on the world map to compare them. Selected countries are added to the selection on the left side of the screen and normalized to display their population as the same radius. This makes their individual birth rates easier to compare. From there on, users can view birth rates of all years of all selected countries or get a detailed view of birth rates in all six age groups. This is of course available in all years.

![Alt text](/example_images/NeuFinal_03.png?raw=true)

The user is presented with a world map and can hover over any country to highlight it.
A left swype with two fingers adds a country to the selection. A darker shadow stays on the world map to indicate which countries are selected. A swype right deselects the respective country. The selected countries are lined up on the left hand side.

![Alt text](/example_images/NeuFinal_06.png?raw=true)

On any screen a drag and hold changes the current year. The inner and outer circles change in color to distinguish between each year. The inner and outer colors are interpolated from lavender to red.

### Birth Rate Change
![Alt text](/example_images/NeuFinal_07.png?raw=true)

When hovering over a selection, the circles increases in size for a small amount to hint at further action. Swyping right displays all birth rates from 1950 to 2015. The color interpolation is clearly visible and the population is not displayed. The selected countries vertical position remains unchanged to keep the vizualizations consistent.

### Birth Rate Detail
![Alt text](/example_images/NeuFinal_08.png?raw=true)
![Alt text](/example_images/NeuFinal_09.png?raw=true)

A zoom-in gesture triggers a detailed view of birth rates distinguished by age groups. All other circles display averaged birth rates.It is possible to scroll through time here and the change certain countries went through in a relative short amount of time becomes obvious.
