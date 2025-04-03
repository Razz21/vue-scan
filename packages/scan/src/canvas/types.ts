export type ActiveRect = {
  name: string;
  rect: DOMRect;
  uid: number;
  title: string;
  renderCount: number;
  lastUpdated?: number;
};

export type BatchRect = {
  uid: number;
  rect: DOMRect;
  name: string;
};
