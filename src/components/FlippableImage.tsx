import * as React from 'react';

export interface Props extends React.HTMLAttributes<HTMLImageElement> {
  /** whether the image is flipped horizontally */
  isFlippedX?: boolean;
  /** whether the image is flipped vertically */
  isFlippedY?: boolean;
}

/** An enhanced image component */
export const FlippableImage: React.StatelessComponent<Props> = (
  props: Props,
) => {
  const { src, isFlippedX, isFlippedY, style, ...rest } = props;

  let transform = '';
  if (isFlippedX === true) {
    transform += ' scale(-1, 1)';
  }
  if (isFlippedY === true) {
    transform += ' scale(1, -1)';
  }

  const d = <img src="fasdf" />;

  return (
    <img src={src || undefined} style={{ ...style, transform }} {...rest} />
  );
};

FlippableImage.defaultProps = {
  isFlippedX: false,
  isFlippedY: true,
};

export default FlippableImage;
