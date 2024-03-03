export default class DomHelper {
    public static addClassToApp(...classNames: string[]) {
        document.querySelector('#app')?.classList.add(...classNames);
    }

    public static removeClassFromApp(...classNames: string[]) {
        document.querySelector('#app')?.classList.remove(...classNames);
    }
}