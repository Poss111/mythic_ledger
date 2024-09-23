const fs = require('fs-extra');
const concat = require('concat');

build = async () =>{
    const files = [
        './dist/mythic-ledger/runtime.js',
        './dist/mythic-ledger/polyfills.js',
        './dist/mythic-ledger/main.js'
      ];
    
      await fs.ensureDir('widget');
      await concat(files, 'widget/app-mythic-ledger.js');
}
build();