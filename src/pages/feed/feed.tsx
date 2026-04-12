import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import {
  fetchFeed,
  getIsLoading,
  getOrdersFeed
} from '../../services/slices/feedSlice';
import { useDispatch } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersFeed);
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  const handleRefresh = () => dispatch(fetchFeed());

  return <FeedUI orders={orders} handleGetFeeds={handleRefresh} />;
};
