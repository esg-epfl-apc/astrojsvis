let file_path = "/_test_files/spi_acs_FULL_SKY_lc.fits";

let fits_reader_wrapper = new FITSReaderWrapper(file_path);

let bokeh_wrapper = new BokehWrapper();

let d3_wrapper = new D3Wrapper();

WrapperContainer.setFITSReaderWrapper(fits_reader_wrapper);
WrapperContainer.setBokehWrapper(bokeh_wrapper);
WrapperContainer.setD3Wrapper(d3_wrapper);

VisualizationContainer.setBokehVisualization(new BokehGraph());
VisualizationContainer.setD3Visualization(new D3Graph());

customElements.define('header-component', HeaderComponent);
customElements.define('data-component', DataComponent);
customElements.define('settings-component', SettingsComponent);
customElements.define('visualization-component', VisualizationComponent);
