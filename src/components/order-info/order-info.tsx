import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { getOrderByNumberApi } from '@api';
import { TOrder, TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const [localOrder, setLocalOrder] = useState<TOrder | null>(null);

  const ingredients = useSelector(getIngredients);

  const orderFromStore = useSelector((state) =>
    state.feed.orders.find((item) => item.number === Number(number))
  );

  useEffect(() => {
    if (!orderFromStore && number) {
      getOrderByNumberApi(Number(number))
        .then((data) => {
          if (data.orders.length) {
            setLocalOrder(data.orders[0]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [orderFromStore, number]);

  const orderData = orderFromStore || localOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
