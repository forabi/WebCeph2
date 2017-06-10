type GeoPoint = { x: number; y: number };

enum ImageTypes {
  CephLateral = 'ceph_lateral',
  CephPA = 'ceph_pa',

  PhotoLateral = 'photo_lateral',
  PhotoFrontal = 'photo_frontal',

  Panoramic = 'panoramic',
}

enum Analysis {
  Basic = 'basic',
  Common = Basic,
  Downs = 'downs',
  Bjork = 'bjork',
  Tweed = 'tweed',
  Steiner = 'steiner',
  RickettsLateral = 'ricketts_lateral',
  RickettsFrontal = 'ricketts_frontal',
  SoftTissuesLateral = 'soft_tissues_lateral',
  SoftTissuesFrontal = 'soft_tissues_frontal',
  FaceProportionsFrontal = 'face_proportions_frontal',
}

type Image<T extends ImageTypes> = {
  name: string | null;
  dateTaken: Date | null;
  src: string;
  width: number;
  height: number;
  type: T;
  scaleFactor: number | null;
  rotate: number;
  brightness: number;
  contrast: number;
  invertColors: number;
}

type StoreState = {
  images: {
    [id: string]: Image<ImageTypes>;
  };
  manualTracing: {
    [imageId: string]: {
      [symbol: string]: GeoPoint;
    };
  }
};

