import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchallBadges ,deleteBadge} from '../features/customAdmin/customAdminSlice';
import { Button, Card } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const Badges = () => {
  const dispatch = useDispatch();
  const { badges, loading } = useSelector((state) => state.customAdmin);
  
  useEffect(() => {
    dispatch(fetchallBadges());
  }, [dispatch]);

  return (
        <Card>
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Badges</h1>
      
      {loading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {badges && badges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
              <img
                src={badge.badge_image}
                alt={badge.badge_name}
                className="w-24 h-24 object-cover rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold">{badge.badge_name}</h2>
              <p className="text-gray-600 text-sm mb-2 capitalize">Type: {badge.badge_type}</p>
              <p className="text-gray-800 font-medium">Threshold: {badge.badge_threshold}</p>
              <p className="text-gray-500 text-sm text-center mt-2">{badge.badge_description}</p>
              <Button className='btn-custom-red mt-2' onClick={() => dispatch(deleteBadge(badge.id))}>Delete</Button>
            </div>
          ))}
        </div>
      )}
          <Link to="/admin/add-badges/" className='btn-custom-blue mt-2 w-60 mx-auto'>add new Badges</Link> 
    </div>
    </Card>
  );
};

export default Badges;
