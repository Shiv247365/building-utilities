# Dataset provenance

The CSV bytes in this package are the files used for the saved results. Package names for the NYC exports were made descriptive. Numeric values and source rows were retained. File hashes are recorded in the root manifest.

## BDG2 hourly electricity

**electricity_cleaned.csv** is the authors' full cleaned electricity export, covering 2016 and 2017. It contains 17,544 timestamp rows and 1,578 building columns across the available sites. The electricity experiment selects Bear, Fox, Panther and Rat, which contribute 639 columns before eligibility filtering. Hourly values are kWh sums. Timestamps are local clock labels. Missing cells and source cleaning affect which forecast windows qualify.

Source file page [BDG2 cleaned electricity](https://github.com/buds-lab/building-data-genome-project-2/blob/master/data/meters/cleaned/electricity_cleaned.csv).

Attribution [Miller et al., Scientific Data 7, 368 (2020)](https://doi.org/10.1038/s41597-020-00712-x).

Reuse notice [BDG2 repository licence](https://github.com/buds-lab/building-data-genome-project-2/blob/master/LICENSE). The repository labels this licence Attribution-ShareAlike 4.0. The included export is unchanged. The demo uses selected excerpts with citation and a link to that licence.

## NYC annual multifamily water records

**nyc_multifamily_2022_2023.csv** contains 41,951 rows, with 19,732 from 2022 and 22,219 from 2023. **nyc_multifamily_2024.csv** contains 26,745 rows. These are source extracts filtered to self-selected Multifamily Housing and the listed years. Subsequent quality screening and grouping are performed by the notebooks. Counts refer to annual records, with repeated property IDs across years.

Source and published terms [NYC Local Law 84 energy and water disclosures](https://data.cityofnewyork.us/Environment/NYC-Building-Energy-and-Water-Data-Disclosure-for-/5zyy-y8am/about_data).

Water use is reported in thousands of US gallons (kgal). Floor area is in square feet and occupancy is a percentage. The app's portfolio upload format uses US gallons. The notebooks multiply the source kgal values by 1,000 when converting to gallons.

The exact selected fields are report_year, property_id, parent_property_id, nyc_borough_block_and_lot, nyc_building_identification, primary_property_type_self, primary_property_type, number_of_buildings, occupancy, property_gfa_self_reported, property_gfa_calculated_1, water_use_all_water_sources, metered_areas_water, estimated_values_water, alert_water_meter_has_less.

The source queries are [2022–23 extract](https://data.cityofnewyork.us/resource/5zyy-y8am.csv?%24select=report_year%2Cproperty_id%2Cparent_property_id%2Cnyc_borough_block_and_lot%2Cnyc_building_identification%2Cprimary_property_type_self%2Cprimary_property_type%2Cnumber_of_buildings%2Coccupancy%2Cproperty_gfa_self_reported%2Cproperty_gfa_calculated_1%2Cwater_use_all_water_sources%2Cmetered_areas_water%2Cestimated_values_water%2Calert_water_meter_has_less&%24where=report_year+in+%282022%2C2023%29+and+primary_property_type_self+%3D+%27Multifamily+Housing%27&%24limit=100000&%24order=report_year%2Cproperty_id%2C%3Aid) and [2024 extract](https://data.cityofnewyork.us/resource/5zyy-y8am.csv?%24select=report_year%2Cproperty_id%2Cparent_property_id%2Cnyc_borough_block_and_lot%2Cnyc_building_identification%2Cprimary_property_type_self%2Cprimary_property_type%2Cnumber_of_buildings%2Coccupancy%2Cproperty_gfa_self_reported%2Cproperty_gfa_calculated_1%2Cwater_use_all_water_sources%2Cmetered_areas_water%2Cestimated_values_water%2Calert_water_meter_has_less&%24where=report_year+%3D+2024+and+primary_property_type_self+%3D+%27Multifamily+Housing%27&%24limit=100000&%24order=report_year%2Cproperty_id%2C%3Aid). Live source data can be revised. Reproducing this package's results uses the included files.
