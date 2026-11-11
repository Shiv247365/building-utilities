# Building Utilities Audit Platform

**CE 663 project: electricity forecasting and water audit prioritization.**

An offline facilities-management demo with three workflows:

- **Seven-Day Meter:** forecast the next 24 hourly electricity readings from the preceding 168 hours; compare with yesterday and last-week baselines.
- **Water Audit Queue:** rank annual property records under four review policies and an adjustable review budget; inspect quality checks and export a shortlist.
- **Check One Property:** compare annual water use with an area-and-occupancy benchmark using US or metric inputs.

**Team:** Shivesh Shukla, Aaditya Rathi, and Siddhant Singh.

## Run the demo

Clone or download the project and open **demo.html** in Chrome, Edge, or Firefox. The demo works offline and needs no installation. Choose a tool and select its sample-data button, or upload a small CSV from [examples/](examples/). The large research datasets are inputs for the notebooks, not demo-upload files.

For a single download containing the app, datasets, notebooks, and report, use the [complete project release ZIP](https://github.com/Shiv247365/building-utilities/releases/latest/download/Building_Utilities_Complete.zip). Extract it completely before opening the demo.

## Get all datasets

The original CSV datasets are included through **Git LFS**, including the 175 MB electricity export.

```sh
git lfs install
git clone https://github.com/Shiv247365/building-utilities.git
cd building-utilities
git lfs pull
```

The browser demo is self-contained even without the research CSVs. For research reproduction, confirm that the files in `data/` are full CSVs rather than small Git LFS pointer files.

## Repository layout

```text
demo.html             Final self-contained presentation app
data/                 Exact research CSVs and provenance
examples/             Small CSVs accepted by the demo
notebooks/            Three executed analytical notebooks
results/              Saved experiment output
source/               Editable UI, fitted parameters, rebuild scripts
  checks/             Existing functional checks
  generated/          Standalone component pages
docs/                 Setup, presentation, and project guides
  report/             Detailed report in PDF and LaTeX
requirements.txt      Pinned research dependencies
MANIFEST_SHA256.json  Content hashes for project files
```

## Reproduce the experiments

Use Python 3.12 with the included datasets available locally.

```sh
python -m pip install -r requirements.txt
python source/run_experiment.py electricity
python source/run_experiment.py water
python source/run_experiment.py priority
```

To rebuild the demo after editing its templates or fitted-parameter files:

```sh
python source/rebuild_demo.py
```

The notebooks retain their original saved outputs. See [Quickstart](docs/QUICKSTART.md) for the complete workflow and existing Node.js functional-check commands.

## Research results

| Experiment | Held-out result |
| --- | --- |
| Electricity ridge forecast | 8.843 kWh hourly MAE; 11.325% median building NMAE; improved on copy-yesterday for 80 of 118 buildings |
| Individual water benchmark | 21.22 US gal/ft²/year median absolute intensity error; 78.9% empirical band coverage |
| Water queue, 10% budget | Peer ratio found 153 elevated next-year reports in 185 reviews: 82.7% precision and 77.7% recall |

The water queue is a retrospective screening study. Elevated reported use does not establish a leak or achievable savings. The electricity evaluation uses unseen buildings within represented sites. Local deployment needs local validation.

## Documentation

- [Quickstart](docs/QUICKSTART.md)
- [Demo and presentation guide](docs/DEMO_GUIDE.md)
- [Research project guide](docs/PROJECT_GUIDE.md)
- [Detailed PDF report](docs/report/Building_Utilities_Report.pdf)
- [Editable LaTeX report](docs/report/Building_Utilities_Report.tex)
- [Dataset sources and reuse notices](data/DATA_SOURCES.md)

## Data attribution

Electricity: Building Data Genome Project 2, Miller et al. (2020), [Scientific Data](https://doi.org/10.1038/s41597-020-00712-x). The repository's [Attribution-ShareAlike licence](https://github.com/buds-lab/building-data-genome-project-2/blob/master/LICENSE) applies to the source export.

Water: [NYC Open Data energy and water disclosures](https://data.cityofnewyork.us/Environment/NYC-Building-Energy-and-Water-Data-Disclosure-for-/5zyy-y8am/about_data). The exact selected extracts, units, and queries are documented in `data/DATA_SOURCES.md`.
