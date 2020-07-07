import { color, scaleLinear, interpolateHcl, hcl } from 'd3';

const btoa = window.btoa;
const atob = window.atob;
const sig = '_';
const isEncoded = value => value.charAt(0) === sig;
const asc = (a,b) => a.l-b.l;
const round = num => Math.round((num + Number.EPSILON) * 10) / 10;

const minifyHex = (hex) => {
  hex = hex.substr(1).split('');
  if (
       hex[0] === hex[1]
    && hex[2] === hex[3]
    && hex[4] === hex[5]
  ) return `#${[hex[0],hex[2],hex[4]].join('')}`;
  return `#${hex.join('')}`;
};

const formatHex = (c) => {
  return minifyHex(color(c).formatHex());
}

const formatColors = (string) => {
  let colors = string
    .split(' ')
    .map(c => hcl(c))
    .sort(asc)
    .filter(c => c.l !== 0 && c.l !== 100)
    .map(formatHex)
    ;
  return [...new Set(colors)];
}

const toHclRange = (range) => {
  const black = hcl(undefined, 0, 0);
  const white = hcl(undefined, 0, 100);
  
  range = range.map(c => hcl(c))
    .sort(asc);

  if (range[0].l !== 0) range = [black, ...range];
  if (range[range.length-1].l !== 100) range = [...range, white];
  
  return range;
};

const encode = (value) => {
  if (isEncoded(value)) return value;
  return sig + btoa(value
    .split(' ')
    .filter(Boolean)
    .map(formatHex)
    .join('')
  );
}

const decode = (value) => {
  if (!isEncoded(value)) return value;
  return atob(value.substr(1))
    .split('#')
    .filter(Boolean)
    .map(c => formatHex(`#${c}`))
    .join(' ');
}

const scale = (domain, range) => {
  return scaleLinear()
    .domain(domain)
    .range(range.map(c => hcl(c)))
    .interpolate(interpolateHcl);
}

class colorDemux {
  constructor(string){
    let colors = isEncoded(string)
      ? formatColors(decode(string))
      : formatColors(string);
    
    string = colors.join(' ');
    
    let range = toHclRange(colors);
    let domain = range.map(c => c.l/100);
      
    this.range = range;
    this.domain = domain;
    this.scale = scale(domain, range);
    this.sig = encode(string);
  }
  
  get(n) {
    return formatHex(this.scale(n));
  }
  
  quantize(n) {
    let arr = [];
    for (let i = 0; i < n+1; ++i) {
      arr.push(formatHex(this.scale(i/n)))
    }
    return arr;
  }
  
  log() {
    console.log(this.range.map(c => `${round(c.l)}: ${formatHex(c)}`).join('\n'));
  }
  
  detect(name) {
    const isSameDomain = (styleSheet) => {
      if (!styleSheet.href) return true;
      return styleSheet.href.indexOf(window.location.origin) === 0;
    };
    
    const isStyleRule = (rule) => rule.type === 1;
    
    const getCSSCustomPropIndex = () =>
      [...document.styleSheets].filter(isSameDomain).reduce(
        (finalArr, sheet) =>
          finalArr.concat(
            [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
              const props = [...rule.style]
                .map((propName) => [
                  propName.trim(),
                  rule.style.getPropertyValue(propName).trim()
                ].join(':'));
    
              return [...propValArr, ...props];
            }, [])
          ),
        []
      ).join(';');
    
    const cssCustomPropIndex = getCSSCustomPropIndex();
    
    const regex = new RegExp(`--${name}-\\d+`,'g');
    
    const matches = cssCustomPropIndex.match(regex)
      .map(match => match.split(`--${name}-`)[1])
      .map(match => parseInt(match))
      .filter(match => match<=100)
      .sort((a,b) => a-b);
      
    let style = document.createElement('style');
    let vars = [...new Set(matches)].map(n => `  --${name}-${n}: ${this.get(n/100)};`).join('\n')
    style.innerHTML = `:root {\n${vars}\n}`;
    document.head.appendChild(style);
  }
}

export default colorDemux;
