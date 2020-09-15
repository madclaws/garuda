declare class  gamezop {
  static Initialize(gzp: object): Promise<void>;
  static setState(sessionData: Object): void;
  static gameMuted: boolean;
  static pause(): void;
  static play(): void;
  static mute(): void;
  static unmute(): void
}

declare class  GZLOADER {
  static modify(x: number, y: number): void;
  static loadProcess(progress: number): void;
  static unload(): void;
}