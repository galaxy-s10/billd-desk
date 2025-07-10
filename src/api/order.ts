import { IList, IOrder } from '@/interface';
import request from '@/utils/request';

/**
 * 开始支付
 */
export function fetchAliPay(data: {
  goodsId: number;
  liveRoomId: number;
  money?: number;
}) {
  return request.post('/order/pay', data);
}

/**
 * 查询是否支付
 * @param out_trade_no 订单支付时传入的商户订单号
 * @returns
 */
export function fetchAliPayStatus(params: { out_trade_no: string }) {
  return request.get('/order/pay_status', {
    params,
  });
}

/**
 * 支付列表（支付中和已支付）
 * @param out_trade_no 订单支付时传入的商户订单号
 * @returns
 */
export function fetchOrderList(params: IList<IOrder>) {
  return request.get('/order/order_list', {
    params,
  });
}
