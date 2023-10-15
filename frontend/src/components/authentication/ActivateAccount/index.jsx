import { useDispatch } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import { notificationShowed } from '../../../features/notifications/notificationsSlice';

const ActivateAccount = () => {
  const dispatch = useDispatch();

  const { status } = useParams();

  if (status === 'success') {
    dispatch(
      notificationShowed({
        status: 204,
        detail: 'Account activated. You can sign in now!',
      })
    );
  } else if (status === 'failed') {
    dispatch(
      notificationShowed({
        status: 404,
        detail: 'Invalid activation token.',
      })
    );
  }

  return <Navigate to='/auth/login' />;
};

export default ActivateAccount;
