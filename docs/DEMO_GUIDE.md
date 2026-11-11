# Presentation guide

## Before presenting

Open demo.html from the extracted folder. Keep the two sample upload CSVs in examples/ available. Test both tools once in the browser that will be used in class. The large research CSVs belong to the notebook workflow. Use the small example CSVs when demonstrating the app's upload controls.

## A combined 60-second demo

1. **0–10 seconds.** Show the home page. Explain that a facilities team can plan next-day electricity use and prioritize annual water reviews in the same workspace.
2. **10–30 seconds.** Open Electricity forecast. Choose Try sample data and Generate forecast. Show the day total and peak hour. Choose Show measured use and compare the model with copying yesterday and last week.
3. **30–50 seconds.** Open Water audit and choose Try sample portfolio. Keep the review budget at 10%. Compare the peer-ratio and gallons-based policies. Open a property to explain its reported and expected use.
4. **50–60 seconds.** Export the shortlist or show Data checks. Point out the validation panels and that both datasets and all experiment code are included for reuse.

## Features available in the final app

**Portfolio water audit.** CSV upload and sample portfolio, four ranking policies, adjustable review budget, full use-versus-expected table, portfolio totals, search, shortlist/full-ranking view, pagination, property details, data checks and exports, shortlist export, and retrospective policy comparisons at three review budgets.

**Single-property water check.** Use Check one property. Enter floor area, occupancy, and annual metered water. Select US or metric units. Confirm full-year coverage and compare use with the expected range. Three examples, next-action guidance, and the benchmark performance table are included.

**Electricity.** CSV upload, downloadable sample CSV, four example buildings, next-day hourly forecasts, daily total and peak hour, yesterday/last-week/model comparisons, measured-use reveal for bundled examples, per-method errors, seven-day history, and held-out evaluation results.

## Input formats

Water portfolio files use one annual record per property. The columns are property_id, floor_area_ft2, occupancy_pct, annual_water_gal, complete_year, estimated_water, and whole_property. The final three columns use yes/no values. Units are US gallons and square feet. The sample deliberately includes two records with quality issues.

Electricity uploads use timestamp,kwh and exactly 168 consecutive local-clock hours from midnight on the first day to 23:00 on the seventh day. Each reading is the energy in kWh used during that hour. The forecast begins at the next midnight.

## Questions to prepare for

- **What does a water flag prove?** It identifies unusually high reported use under the benchmark. Inspect meters and billing records to determine the cause.
- **Why do the portfolio and individual checker have separate models?** The individual checker estimates typical annual intensity and a calibrated range. The portfolio study evaluates priorities for next-year elevated reports using a separately frozen benchmark.
- **Does it work at IIT Kanpur?** The experiments use US buildings. A campus application needs local validation and suitable property and meter records.
- **Is the interface the research contribution?** The experiments test small-input forecasting and the yield of alternative review policies under the same review budget. The app makes those results inspectable and reusable.
