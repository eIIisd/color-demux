# Color Demultiplexer

Interpolates theme color tokens into a linear scale and samples namespace references in CSS custom properties at runtime.

---

## API

`import colorDemux from 'colorDemux.js';`


- `colorDemux.get(n: float)`
- `colorDemux.quantize(n: integer)`
- `colorDemux.log()`
- `colorDemux.detect(name: string)`
