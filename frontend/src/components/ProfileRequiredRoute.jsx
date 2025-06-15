import { Navigate } from 'react-router-dom';
import useAuth from '../contexts/useAuthContext';

const ProfileRequiredRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isProfileComplete) {
    return <Navigate to={`/edit-profile/${user.id}`} />;
  }

  return children;
};

export default ProfileRequiredRoute;
