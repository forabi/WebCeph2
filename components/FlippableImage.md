This is a cephalometric image component:

    <FlippableImage
      style={{ height: 250 }} 
      src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG" 
    />

This is one is flipped horizontally:

    <FlippableImage
      style={{ height: 250 }}
      isFlippedX 
      src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG" 
    />

This is one is flipped vertically:

    <FlippableImage
      style={{ height: 250 }}
      isFlippedY 
      src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG" 
    />

This is one is flipped horizontally and vertically:

    <FlippableImage
      style={{ height: 250 }}
      isFlippedX
      isFlippedY
      src="https://upload.wikimedia.org/wikipedia/commons/6/66/Cephalometric_radiograph.JPG" 
    />
