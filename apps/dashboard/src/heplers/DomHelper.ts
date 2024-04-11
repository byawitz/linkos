export default class DomHelper {
  public static addClassToID(id: string, ...classNames: string[]) {
    document.querySelector(`#${id}`)?.classList.add(...classNames);
  }

  public static removeClassFromID(id: string, ...classNames: string[]) {
    document.querySelector(`#${id}`)?.classList.remove(...classNames);
  }

  static getTheme() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
