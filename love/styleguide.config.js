const path = require('path');

module.exports = {
  title: 'LOVE-frontend',
  serverPort: 3001,
  require: [path.join(__dirname, 'src/index.css')],
  assetsDir: 'docsrc/assets',
  pagePerSection: true,
  tocMode: 'collapse',
  sections: [
    {
      name: 'Overview',
      content: 'docsrc/overview.md',
    },
    {
      name: 'Instructions',
      external: true,
      href: 'https://github.com/lsst-ts/LOVE-frontend/blob/develop/README.md',
    },
    {
      name: 'Contributing',
      external: true,
      href: 'https://github.com/lsst-ts/LOVE-frontend/blob/develop/CONTRIBUTING.md',
    },
    {
      name: 'How it works',
      content: 'docsrc/howitworks.md',
    },
    {
      name: "API",
      sections: [
        {
          name: 'Container Components',
          content: 'docsrc/ui.md',
          components: ['src/components/**/*.container.jsx'],
          exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
          usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
        },
        {
          name: 'UI Components',
          content: 'docsrc/ui.md',
          components: ['src/components/GeneralPurpose/**/*.jsx'],
          exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
          usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
        }
      ]
    }
  ],
  styleguideDir: '../docs',
  propsParser(filePath, source, resolver, handlers) {
    // if (filePath.indexOf('.container.jsx') > -1) {
    //   handlers.push((documentation, nodePath) => {
    //     documentation.set('testes','DASDASDSADSA');
    //   })
    // }
    return require('react-docgen').parse(source, resolver, handlers);
  },
  // ignore: ['**/*']
  // ignore: ['**/__tests__/**',
  // '**/*.test.{js,jsx,ts,tsx}',
  // '**/*.spec.{js,jsx,ts,tsx}',
  // '**/*.d.ts',
  // '**/components/HealthStatusSummary/Button/Button.jsx',
  // '**/components/HealthStatusSummary/Button/UploadButton.jsx',
  // '**/components/HealthStatusSummary/RawTelemetryTable/ColumnHeader/ColumnHeader.jsx',
  // '**/components/HealthStatusSummary/RawTelemetryTable/ColumnHeader/FilterButton/FilterButton.jsx',
  // '**/components/HealthStatusSummary/RawTelemetryTable/FilterDialog/FilterDialog.jsx',
  // '**/components/HealthStatusSummary/RawTelemetryTable/TelemetrySelectionTag/TelemetrySelectionTag.jsx',
  // '**/components/HealthStatusSummary/RawTelemetryTable/fakeData.jsx',
  // '**/components/icons/**'
  // ],
  // theme: {
  //   color: {
  //     base: '#788F9B', //default font color, color of headers and paragraphs
  //     light: '788F9B', // color of urls, "props&methods" "view code" "add examples to this components" and corner squares
  //     lightest: '#yellow',
  //     link: '#788F9B', // --link-font-color
  //     linkHover: '#667986', //  --link-hover-font-color
  //     focus: 'rgba(22, 115, 177, 0.25)',//??
  //     border: '#788F9B',
  //     name: '#788F9B',
  //     type: '#788F9B',
  //     error: '#c00',
  //     baseBackground: '#0c161d', // right panel, color taken from uiguide
  //     codeBackground: '#f5f5f5',
  //     sidebarBackground: '0c161d', // of the list of components
  //     ribbonBackground: '#0c161d',
  //     ribbonText: '#788F9B',
  //     // Based on default Prism theme
  //     codeComment: '#788F9B',
  //     codePunctuation: '#999',
  //     codeProperty: '#905',
  //     codeDeleted: '#905',
  //     codeString: '#690',
  //     codeInserted: '#690',
  //     codeOperator: '#9a6e3a',
  //     codeKeyword: '#1673b1',
  //     codeFunction: '#DD4A68',
  //     codeVariable: '#e90',
  //   },
  //   fontFamily: {
  //     base: '"Comic Sans MS", "Comic Sans", cursive'
  //   }
  // }
};
