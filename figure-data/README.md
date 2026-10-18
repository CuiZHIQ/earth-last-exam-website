# Observed typhoon tracks

The website chart is drawn by EvolventAI from observations, not from simulated forecasts.

- Source: [JMA RSMC best-track archive](https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/besttrack.html), `Besttracks/bst_all.zip`.
- [JMA record format](https://www.jma.go.jp/jma/jma-eng/jma-center/rsmc-hp-pub-eg/Besttracks/e_format_bst.html).
- International IDs: 2306 (Khanun, 106 records), 2309 (Saola, 51 records). All archived stages and record times are retained, including tropical-depression and post-tropical records where present. No interpolation or smoothing was applied to the data.
- `jma-khanun-saola.csv` stores the extracted UTC time, latitude/longitude in degrees, JMA grade and central pressure in hPa.
- [JMA terms](https://www.jma.go.jp/jma/en/copyright.html): attributed reuse; the chart is an ELE rendering, not an official JMA chart.
- Basemap: exterior land rings intersecting 109–141°E, 8–42°N from [Natural Earth 1:50m land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson). Full intersecting exterior rings are retained and clipped by the plotting viewport. Inland-water holes are not rendered. No administrative borders are drawn.
- [Natural Earth public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/).

Downloaded input SHA-256:

```
bst_all.zip             76b65a4210e0a9f69c6ce56b401ac572d4203c11edf1f30691a20a891353cef6
ne_50m_land.geojson      e874b27a51d146452be360cafb3cc50c86001074a67d534113e6534682f9826b
```

Reproduce with Python and Matplotlib:

```sh
python scripts/plot-observed-tracks.py
python scripts/plot-observed-pressure.py
```

The chart uses longitude/latitude axes with aspect corrected at 25°N. Circles indicate 00 UTC; square/triangle markers identify the first/last archive records. Straight rendered segments connect consecutive records. These records are retrospective analyses; they are not instantaneous raw measurements, model output, or benchmark results.

The plotting basemap is too coarse for landfall verification. The task contract specifies separate, fixed high-resolution coast geometry.

The pressure figure uses the `pressure_hpa` column from the same archive extraction.
It retains every time and connects records without smoothing; absent pressure codes
remain gaps. Both panels share one pressure scale but retain their own UTC dates.
It describes the observed storms and does not report model performance.
