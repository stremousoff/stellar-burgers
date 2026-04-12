import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getOrdersThunk,
  getUserOrders
} from '../../services/slices/userOdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
