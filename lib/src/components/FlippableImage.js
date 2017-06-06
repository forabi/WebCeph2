var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
/** An enhanced image component */
export const FlippableImage = (props) => {
    const { src, isFlippedX, isFlippedY, style } = props, rest = __rest(props, ["src", "isFlippedX", "isFlippedY", "style"]);
    let transform = '';
    if (isFlippedX === true) {
        transform += ' scale(-1, 1)';
    }
    if (isFlippedY === true) {
        transform += ' scale(1, -1)';
    }
    const d = React.createElement("img", { src: "fasdf" });
    return (React.createElement("img", Object.assign({ src: src || undefined, style: Object.assign({}, style, { transform }) }, rest)));
};
FlippableImage.defaultProps = {
    isFlippedX: false,
    isFlippedY: true,
};
export default FlippableImage;
//# sourceMappingURL=FlippableImage.js.map