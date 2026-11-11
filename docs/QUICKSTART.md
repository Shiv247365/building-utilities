# Building Utilities Audit Platform

## Present the final demo

1. Extract the ZIP completely to a folder on your laptop.
2. Open **demo.html** in Microsoft Edge, Chrome, or another current browser.
3. Choose **Water audit** or **Electricity forecast** in the sidebar.
4. Select **Try sample portfolio** or **Try sample data**, or upload one of the CSV files in **examples/**.

The final demo is self-contained and works offline. It includes the models, sample records, navigation, manual water checker, and research comparison panels. Opening a source-reference link uses the internet. The app processes uploaded data in the browser and keeps the current session while switching tools. Reloading the page starts a fresh session.

## What is included

- **demo.html** is the final presentation app.
- **examples/** contains small, correctly formatted CSVs for upload demonstrations.
- **data/** contains the full BDG2 cleaned electricity CSV and the exact filtered NYC water extracts used in the experiments.
- **notebooks/** contains three executed notebooks with methods, code, and saved results.
- **results/** contains plain-text copies of the saved experiment output.
- **source/** contains the editable app templates, shared theme, fitted model parameters, and rebuild/check scripts.
- **PROJECT_GUIDE.md** contains the research questions, results, limitations, and a three-person work split.
- **DEMO_GUIDE.md** contains a presentation sequence and a feature checklist.
- **data/DATA_SOURCES.md** records dataset scope, download queries, units, and attribution.
- **MANIFEST_SHA256.json** records the packaged files and their hashes.

## Rerun experiments

Use Python 3.12. The supplied results used NumPy 2.3.5 and pandas 3.0.1. Install those dependencies once with an internet connection, or provide them from your existing Python environment.

From the extracted package root, run these commands in a terminal.

```text
python -m pip install -r requirements.txt
python source/run_experiment.py electricity
python source/run_experiment.py water
python source/run_experiment.py priority
```

The runners read the included datasets and print the results. They need no dataset downloads. Alternatively, open a notebook with Jupyter and run all cells. Run from the package root or the notebooks directory. Memory use depends on the Python environment, with the electricity CSV being the largest input. Small numeric differences can occur between platforms and linear algebra libraries.

## Edit or rebuild the app

Edit the HTML templates and **source/utilities_theme.css**. The JSON files contain the fitted parameters and bundled examples. Then run from the package root.

```text
python source/rebuild_demo.py
```

This rebuilds **demo.html** and the component pages in **source/generated/**. Editing presentation files does not retrain the models. The notebooks document the fitted models and experiment splits.

## Run the included functional checks

With Node.js 24 available, run from the package root.

```text
node source/checks/check_utilities_demo.cjs
node source/checks/check_water_portfolio.cjs
node source/checks/check_electricity.cjs
node source/checks/check_water_demo.cjs
```

These checks cover navigation, model parity, CSV parsing, sample uploads, quality flags, exports, and unit conversion. They simulate the app's document interactions. Browser visual preview was unavailable during development, so check the final app's appearance on the laptop used for presentation.
