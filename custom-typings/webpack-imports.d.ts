type SpriteSymbol = {
  id: string;
  viewBox: string;
  content: string;
  url: string;
};

declare module 'icons/*.svg' {
  const symbol: SpriteSymbol;
  export default symbol;
}

declare module 'svg-sprite-loader!*.svg' {
  const symbol: SpriteSymbol;
  export default symbol;
}

declare module '!!file-loader!*' {
  const url: string;
  export default url;
}

declare module 'file-loader!*' {
  const url: string;
  export default url;
}

declare module '!!svg-react-loader*' {
  import React from 'react';
  type Props = React.SVGAttributes<SVGSVGElement>;
  const SVGComponent: React.ComponentClass<Props>;
  export default SVGComponent;
}

declare module '!!json-loader!*' {
  const json: object;
  export default json;
}

declare module 'json-loader!*' {
  const json: object;
  export default json;
}
