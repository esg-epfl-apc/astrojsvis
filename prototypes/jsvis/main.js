let file_path = "./_test_files/spiacs_lc_query.fits";

let fits_reader_wrapper = new FITSReaderWrapper(file_path);

let bokeh_wrapper = new BokehWrapper();

let d3_wrapper = new D3Wrapper();

FileRegistry.addToAvailableFiles({
    file_name: file_path,
    type: 'fits',
    raw_content: ''
});

WrapperContainer.setFITSReaderWrapper(fits_reader_wrapper);
WrapperContainer.setBokehWrapper(bokeh_wrapper);
WrapperContainer.setD3Wrapper(d3_wrapper);

VisualizationContainer.setBokehVisualization(new BokehGraph());
VisualizationContainer.setD3Visualization(new D3Graph());

customElements.define('file-component', FileComponent);
customElements.define('header-component', HeaderComponent);
customElements.define('data-component', DataComponent);
customElements.define('settings-component', SettingsComponent);
customElements.define('visualization-component', VisualizationComponent);
