import { PaginationProps } from 'naive-ui';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

export const usePage = () => {
  const { t } = useI18n();
  const paginationReactive = reactive<PaginationProps>({
    page: 1, // 当前页
    itemCount: 0, // 总条数
    pageSize: 10, // 分页大小
    pageSizes: [10, 20, 30, 50, 100],
    showSizePicker: true,
    onUpdatePageSize: (pageSize: number) => {
      paginationReactive.pageSize = pageSize;
      paginationReactive.page = 1;
    },
    onUpdatePage: (page: number) => {
      paginationReactive.page = page;
    },
    prefix: ({ itemCount }) => {
      return t('common.pageTotal', { total: itemCount });
      // return `一共${itemCount}条数据`;
    },
  });
  return paginationReactive as any;
};
