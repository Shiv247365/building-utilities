# CE 663 project guide

## Purpose and course fit

The platform supports facilities teams making two decisions. Seven-Day Meter forecasts the next 24 hourly electricity readings from seven days of observed use. Water Audit Queue allocates a limited number of property reviews using annual water disclosures.

The supplied course brief connects electricity to the FCH topic “role of AI and data driven techniques” under Technologies for Sustainable Development, and water to the board topic “Integrated Water Management.”

## Electricity experiment

The source file has 1,578 building columns across all available electricity sites. The four sites named by BuildingsBench contribute 639 columns in this export. The published BuildingsBench processed count is 611. This experiment uses its own explicit window filters and building split.

The fitted cohort contains 376 buildings and 112,126 valid forecast days from 2016. Validation uses 128 different 2016 buildings. The test uses 118 previously unseen buildings and 37,808 forecast days from 2017. Each test building has at least 30 complete forecast days. Input scaling uses only the prior 168 hours.

| Method | Test hourly MAE, kWh | Median building normalized error |
| --- | ---: | ---: |
| Copy yesterday | 9.45 | 12.47% |
| Copy last week | 11.63 | 15.85% |
| Pooled ridge regression | 8.84 | 11.33% |

Ridge beat the validation-selected baseline, copying yesterday, on 80 of 118 test buildings. The median paired difference was −0.81 percentage points, with a 95% site-stratified building-bootstrap interval of −1.37 to −0.23.

The sites are shared across splits. Transfer to another site is a separate question. The cleaned source removes some outliers and zero values. The experiment evaluates the published local-clock grid and complete eligible windows.

## Water experiments

The individual benchmark fits the latest eligible 2022–23 record for each of 13,054 properties. The 2024 held-out test contains 2,394 properties across 2,160 groups. The regression's median absolute intensity error is 21.22 US gal/ft²/year, versus 23.11 for the overall median and 22.77 for the size-band median. Its empirical comparison band covered 78.9% of held-out readings.

The portfolio extension trains next-year risk using 6,581 paired annual records and validates policy choice on 2,094 pairs in separate property groups. Evaluation uses 1,843 matched 2023-to-2024 properties across 1,747 held-out groups. At a 10% review budget, each policy selects 185 properties.

| Policy | Next-year elevated reports found | Future gallons above cutoff represented |
| --- | ---: | ---: |
| Reported intensity | 133 | 80.5% |
| Peer-adjusted ratio | 153 | 91.9% |
| Gallons above expected | 125 | 94.7% |
| Trained risk score | 153 | 95.2% |

The peer-ratio precision gain over raw intensity was +10.8 percentage points, with a 95% group-bootstrap interval of +6.0 to +15.2. The portfolio target is elevated next-year reported use relative to the fixed benchmark cutoff. These volume shares describe reported volume above a cutoff. Only 69.6% of eligible 2023 candidates had usable 2024 follow-up. The portfolio extension is retrospective because the 2024 benchmark had already been examined earlier in the project. The data supplies no confirmed leaks, audit outcomes, or intervention savings.

## Three-person work split

1. **Electricity and forecasting.** Reproduce eligibility counts and the building split, explain the ridge features and scaling, and inspect weekday/weekend and site results.
2. **Water and evaluation.** Reproduce property grouping, data quality filters, benchmark errors, queue metrics, uncertainty, and missing-follow-up analysis.
3. **Platform and workflow.** Maintain the common interface, CSV contracts, validation, examples, exports, functional checks, and presentation sequence.

Each member should understand both experiments and review the other members' results before the viva. These are proposed work assignments.

## Term-paper outline

1. Facilities-management decisions and CE 663 context.
2. Prior work and dataset provenance.
3. Data cleaning, independent units, and frozen splits.
4. Electricity baselines, ridge model, and evaluation.
5. Water benchmarking, calibrated range, and budgeted review policies.
6. Results, sensitivity, and failure cases.
7. Platform workflow and reproducibility.
8. Limitations, local validation needs, and conclusions supported by the experiments.

## PPT outline

Use approximately 10 slides covering the problem, two use cases, data and split design, electricity methods and results, water methods and results, the live demo, limitations, and team contributions. Use the saved outputs in results/ as the source of numeric tables.

## Closest sources

- Miller et al. (2020), The Building Data Genome Project 2. https://doi.org/10.1038/s41597-020-00712-x
- BuildingsBench (2023). https://proceedings.neurips.cc/paper_files/paper/2023/file/3f17bf868966df01ca125e5bbc9ee24e-Paper-Datasets_and_Benchmarks.pdf
- Wang and El-Gohary (2019), Machine Learning-Based Prediction of Building Water Consumption for Improving Building Water Efficiency. https://doi.org/10.1061/9780784482445.018
- Kontokosta and Jain (2015), Modeling the determinants of large-scale building water use. https://doi.org/10.1016/j.scs.2015.05.007
- EPA multifamily water score. https://www.energystar.gov/buildings/resources-audience/multifamily-housing/water-score
