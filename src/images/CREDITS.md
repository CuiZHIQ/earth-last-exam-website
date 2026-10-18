# Scientific imagery

The satellite and astronaut photographs introduce the scientific setting. The research figures listed below show observations and forecast fields processed in ELE's development experiments. Conceptual experiment diagrams remain separate from measured results.

## ELE typhoon development experiments

- `typhoon-ahi-b13.png`: calibrated JMA Himawari-9 AHI band 13 scans from the NOAA public archive, nominal 05:40 UTC on 1 August and 28 August 2023. Native projection, common brightness-temperature scale, original navigation and line times. Produced by ELE's `tools/typhoon_satellite_figures.py` from the existing calibrated files.
- `typhoon-tracks.png`: archived NOAA GFS and all 31 GEFS members, with JMA reference positions. The two development initializations are 1 August and 28 August 2023 at 00 UTC. The plots preserve the original three-hour model positions. Initial centers use retrospective JMA positions; ensemble weights have not been calibrated. Produced by `tools/typhoon_figures.py`.
- `typhoon-tracker-divergences.png`: actual GEFS sea-level pressure and 850 hPa winds, derived relative vorticity, two tracker selections and JMA reference positions. Four examples come from the existing center-divergence diagnosis; 850 hPa fields have not been masked below terrain. Produced by `tools/typhoon_tracking_diagnostics.py`.
- The source figure files are copied unchanged from the ELE task repository. No additional model experiment was run for this website update.
- Data providers: [JMA](https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/besttrack.html), [NOAA GFS](https://registry.opendata.aws/noaa-gfs-bdp-pds/), [NOAA GEFS](https://registry.opendata.aws/noaa-gefs/), [Himawari archive](https://registry.opendata.aws/noaa-himawari/).
- Coastlines: [GSHHG 2.3.7, high resolution](https://ftp.soest.hawaii.edu/gshhg/). The original license accompanies the figures in [GSHHG-LICENSE.txt](GSHHG-LICENSE.txt).
- Figures and derived diagnostics: EvolventAI. Original data and geometry remain attributable to their providers.

## Earth from DSCOVR

- File: `earth-epic.jpg`, 1041 × 1041 pixels.
- Instrument: Earth Polychromatic Imaging Camera (EPIC), DSCOVR.
- Observation: 6 July 2015. A color composite from the instrument's red, green and blue channels.
- Credit: NASA / DSCOVR EPIC team.
- [Source and scientific context](https://science.nasa.gov/earth/earth-observatory/an-epic-new-view-of-earth-86257/).
- [NASA image asset](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/86000/86257/epicfirstlight_DSC_2015186_lrg.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1041&w=1041).

## Typhoon Saola

- File: `saola-viirs.jpg`, 3152 × 2101 pixels.
- Instrument: Visible Infrared Imaging Radiometer Suite (VIIRS), NOAA–NASA Suomi NPP.
- Observation: 1 September 2023, approximately 1 p.m. local time according to the source.
- Saola appears near the southern coast of China on the left. Haikui is east of Taiwan on the right.
- Credit: NASA Earth Observatory image by Lauren Dauphin, using VIIRS data from NASA EOSDIS LANCE, GIBS/Worldview, and the Suomi National Polar-orbiting Partnership.
- [Source and scientific context](https://science.nasa.gov/earth/earth-observatory/typhoon-saola-swipes-chinas-coast-151787/).
- [NASA image asset](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/151000/151787/typhoonsaola_vir_2023244_lrg.jpg?crop=faces%2Cfocalpoint&fit=clip&h=2101&w=3152).

## Lena River Delta

- File: `lena-delta.jpg`, 1200 × 1225 pixels.
- Instrument: Operational Land Imager-2 (OLI-2), Landsat 9.
- Observation: 17 June 2022.
- Credit: NASA Earth Observatory / Joshua Stevens, using Landsat data from the U.S. Geological Survey.
- [Source and scientific context](https://science.nasa.gov/earth/earth-observatory/lena-river-sedimentation-150076/).
- [NASA image asset](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/150000/150076/lena_oli2_2022168_lrg.jpg?fit=clip&w=1200).

## Barents Sea phytoplankton bloom

- File: `barents-bloom.jpg`, 1600 × 1066 pixels.
- Instrument: Moderate Resolution Imaging Spectroradiometer (MODIS), Terra.
- Observation: 3 August 2023.
- Credit: NASA Earth Observatory / Michala Garrison, using MODIS data from NASA EOSDIS LANCE and GIBS/Worldview.
- [Source and scientific context](https://science.nasa.gov/earth/earth-observatory/a-bloom-in-a-changing-barents-sea-151667/).
- [NASA image asset](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/151000/151667/barentsbloom_tmo_2023215_lrg.jpg?fit=clip&w=1600).
- Geographic boundary lines are part of the published NASA image, not ELE annotations.

## Zagros Mountains

- File: `zagros-folds.jpg`, 1600 × 1066 pixels.
- Photograph: ISS066-E-182850, acquired by the Expedition 66 crew using a Nikon D5, 50 mm focal length.
- Observation: 7 February 2022.
- Credit: NASA / ISS Crew Earth Observations Facility and Earth Science and Remote Sensing Unit, Johnson Space Center.
- [Source and scientific context](https://science.nasa.gov/earth/earth-observatory/ridges-and-valleys-of-the-zagros-mountains-150811/).
- [NASA image asset](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/150000/150811/iss066e182850_lrg.jpg?fit=clip&w=1600).
- NASA's published version is cropped and contrast-enhanced, with lens artifacts removed, as described on the source page. ELE applies no additional crop or color adjustment.

## Typhoon Maysak from the ISS

- File: `maysak-eye.jpg`, 1800 × 1197 pixels.
- Observation: 31 March 2015.
- Credit: ESA/NASA / Samantha Cristoforetti.
- [Source and scientific context](https://science.nasa.gov/earth/earth-observatory/typhoon-maysak-from-the-space-station-85630/).
- [NASA-hosted image asset](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/85000/85630/maysak_iss_2015090_lrg.jpg?fit=clip&w=1800).
- Used as an informational scientific illustration on the typhoon page. Maysak is not presented as one of the task's development events.
- This ESA/NASA credit is separate from solely NASA-produced imagery. See [ESA's image-use terms](https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website) for educational, editorial and informational uses; other uses require a separate licence.

## Elephant Foot Glacier

- File: `elephant-foot-glacier.jpg`, 1400 × 1400 pixels.
- Instrument: Operational Land Imager (OLI), Landsat 8.
- Observation: 21 June 2014.
- Credit: NASA Earth Observatory / Jesse Allen, using Landsat data from the U.S. Geological Survey.
- [Source and scientific context](https://science.nasa.gov/earth/earth-observatory/elephant-foot-glacier-85303/).
- [NASA image asset](https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/85000/85303/elephantfoot_oli_2014172_lrg.jpg?fit=clip&w=1400).

## Reuse and display

NASA's [Earth Science imagery reuse policy](https://science.nasa.gov/earth/faq/) permits reuse of its materials unless a copyright restriction is indicated and asks for attribution. Joint or third-party credits have their own terms, as noted above. These credits apply separately from ELE's original website assets. Attribution does not imply that the image providers participate in or endorse ELE.

The files are served by NASA's image service at web-appropriate resolutions and stored locally. The website preserves the full published frames and their aspect ratios, without an additional color filter, annotation or crop. Some source images have already been processed by their publishers, as noted above. Every image links to a larger local view, with its source page alongside the caption. Below-the-fold images load lazily.

## Observed typhoon tracks

`typhoon-observed-tracks.svg` is an original EvolventAI data rendering from the [JMA RSMC best-track archive](https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/besttrack.html). It includes all 106 archived Khanun positions and 51 Saola positions in 2023, including the stages before and after typhoon intensity. Coordinates are plotted without smoothing; daily markers indicate 00 UTC. These are retrospective best-track analyses, not forecast results.

Land outlines come from [Natural Earth 1:50m land](https://www.naturalearthdata.com/about/terms-of-use/) (public domain); longitude/latitude axes use an aspect correction at 25°N. The chart was prepared by EvolventAI and is not an official JMA product. [JMA attribution and reuse terms](https://www.jma.go.jp/jma/en/copyright.html) apply to the underlying track data.

The source repository includes the extracted records, basemap rings, input hashes and a Matplotlib script for reproducing the chart. The display basemap is separate from the fine-scale coastline required for task evaluation. Synthetic terrain and invented forecast trajectories are no longer displayed on the website.

## Observed central pressure

`typhoon-observed-pressure.svg` uses the same 157 JMA best-track records and reuse
terms. The two panels share a 900–1020 hPa scale and use their actual UTC dates.
Dots show archived samples; straight segments connect records without fitting or
smoothing. Labels mark the minimum archived pressure for each storm, not a forecast
score. Missing pressure codes would remain gaps. Reproduce it with
`python scripts/plot-observed-pressure.py` from the source repository.
