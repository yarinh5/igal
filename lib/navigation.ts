export function initialScrollAction(type: string, hash: string) {
  return type === 'reload' || !hash ? { reset: true, hash: '' } : { reset: false, hash };
}
