import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorState,
  clearConstructor
} from '../../services/slices/constructorSlice';
import {
  postOrderThunk,
  getOrder,
  getOrderRequest,
  clearOrder
} from '../../services/slices/orderSlice';
import { getUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(getConstructorState);
  const user = useSelector(getUser);

  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrder);

  const constructorItems = { bun, ingredients };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!user) return navigate('/login');

    const dataToPost = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(postOrderThunk(dataToPost));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
    navigate('/', { replace: true });
  };

  // Добавляем пропущенный расчет цены
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
