# Color Demultiplexer

Interpolates theme color tokens into a linear scale and samples namespace references in CSS custom properties at runtime.

---

## Usage

```
// index.js

import colorDemux from 'https://eiiisd.github.io/color-demux/dist/colorDemux.js';

const based = new colorDemux('#001A4D #003366 #335C85 #6685A3 #99ADC2 #CCD6E0')
  .detect('rah');
```

```
/* style.css */

.lel {
  color: var(--rah-10);
  background: var(--rah-90);
}

.swag {
  --local-color: var(--rah-33);
  color: var(--local-color);
}
```

```
/* inline styles generated at runtime */

:root {
  --rah-10: #001A4D;
  --rah-33: #335C85;
  --rah-90: #CCD6E0;
}
```


## Class API

- `colorDemux.get(n: float)`
- `colorDemux.quantize(n: integer)`
- `colorDemux.log()`
- `colorDemux.detect(name: string)`
