import type { Ref } from 'vue';
import NetworkHelper from '@/heplers/NetworkHelper';
import type { Router } from 'vue-router';

export default class CursorPaginator {
  private items: Ref<any[]>;
  private readonly url: string;
  private hasNext: Ref<boolean>;
  private hasPrev: Ref<boolean>;
  private tableLoading: Ref<boolean>;
  private router: Router;

  constructor(url: string, items: Ref<any[]>, tableLoading: Ref<boolean>, hasNext: Ref<boolean>, hasPrev: Ref<boolean>, router: Router) {
    this.url = url;
    this.items = items;
    this.tableLoading = tableLoading;
    this.hasPrev = hasPrev;
    this.hasNext = hasNext;
    this.router = router;
  }

  public async next() {
    this.tableLoading.value = true;

    await this.loadData(CursorPaginator.getURLParam('next'));

    this.tableLoading.value = false;
  }

  public async prev() {
    this.tableLoading.value = true;
    const id = parseInt(CursorPaginator.getURLParam('prev')) + parseInt(CursorPaginator.getURLParam('size'));

    await this.loadData(id);

    this.tableLoading.value = false;
  }

  public async loadData(lastId: any = 0) {
    try {
      const res = await NetworkHelper.get(`${this.url}${lastId}/`);

      if (res.success) {
        const data = res.data;

        this.items.value = data.items;
        this.hasPrev.value = data.hasPrev;
        this.hasNext.value = data.hasNext;
        const next = data.items[data.items.length - 1].id;
        const size = data.size;

        await this.router.replace(`${this.router.currentRoute.value.path}?next=${next}&prev=${lastId}&size=${size}`);
      }
    } catch (e) {
      // TODO: Toast for error
    }
  }

  private static getURLParam(param: string) {
    const url = new URL(window.location.href.replace('#', ''));

    return url.searchParams.get(param) ?? '0';
  }

  async init() {
    await this.loadData(CursorPaginator.getURLParam('prev'));
  }
}
