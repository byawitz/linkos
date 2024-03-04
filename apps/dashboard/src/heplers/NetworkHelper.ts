export default class NetworkHelper {
  static readonly whoAmI = '/whoami';
  static readonly addLink = '/links/add';
  static readonly getLinks = '/links/';
  static readonly getLink = '/links/get/:id';
  static readonly updateLink = '/links/update/:id';
  static readonly deleteLink = '/links/delete/:id';

  public static async get(url: string) {
    try {
      const res = await fetch(NetworkHelper.baseUrl(url));
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }

  public static baseUrl(appendUrl = '') {
    const base = import.meta.env.MODE === 'development' ? 'http://localhost:8081/v1/api' : `${window.location.origin}/v1/api`;
    return `${base}${appendUrl}`;
  }
}
